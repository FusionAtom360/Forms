create extension if not exists "pgcrypto";

create type public.form_status as enum ('draft', 'published', 'archived');
create type public.field_type as enum (
  'short_text',
  'long_text',
  'email',
  'number',
  'single_choice',
  'multiple_choice',
  'dropdown',
  'date',
  'rating',
  'file'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 120),
  description text not null default '',
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  status public.form_status not null default 'draft',
  settings jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  position integer not null check (position >= 0),
  type public.field_type not null,
  label text not null check (char_length(trim(label)) between 1 and 300),
  description text not null default '',
  key text not null check (key ~ '^[a-z][a-z0-9_]*$'),
  required boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (form_id, key),
  unique (form_id, position)
);

create table public.form_responses (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  respondent_id uuid references auth.users(id) on delete set null,
  respondent_email text,
  metadata jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

create table public.form_response_answers (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.form_responses(id) on delete cascade,
  field_id uuid not null references public.form_fields(id) on delete cascade,
  value jsonb not null default 'null'::jsonb,
  created_at timestamptz not null default now(),
  unique (response_id, field_id)
);

create index forms_owner_updated_idx on public.forms (owner_id, updated_at desc);
create index forms_published_slug_idx on public.forms (slug) where status = 'published';
create index fields_form_position_idx on public.form_fields (form_id, position);
create index responses_form_submitted_idx on public.form_responses (form_id, submitted_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger forms_set_updated_at
before update on public.forms
for each row execute function public.set_updated_at();

create trigger form_fields_set_updated_at
before update on public.form_fields
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.form_responses enable row level security;
alter table public.form_response_answers enable row level security;

create policy "Users can read their profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

create policy "Users can update their profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Owners can read their forms"
on public.forms for select
to authenticated
using (owner_id = (select auth.uid()));

create policy "Owners can create forms"
on public.forms for insert
to authenticated
with check (owner_id = (select auth.uid()));

create policy "Owners can update their forms"
on public.forms for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Owners can delete their forms"
on public.forms for delete
to authenticated
using (owner_id = (select auth.uid()));

create policy "Anyone can read published forms"
on public.forms for select
to anon, authenticated
using (status = 'published');

create policy "Owners can manage fields"
on public.form_fields for all
to authenticated
using (
  exists (
    select 1 from public.forms
    where forms.id = form_fields.form_id
      and forms.owner_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.forms
    where forms.id = form_fields.form_id
      and forms.owner_id = (select auth.uid())
  )
);

create policy "Anyone can read fields for published forms"
on public.form_fields for select
to anon, authenticated
using (
  exists (
    select 1 from public.forms
    where forms.id = form_fields.form_id
      and forms.status = 'published'
  )
);

create policy "Anyone can submit responses to published forms"
on public.form_responses for insert
to anon, authenticated
with check (
  exists (
    select 1 from public.forms
    where forms.id = form_responses.form_id
      and forms.status = 'published'
  )
  and (respondent_id is null or respondent_id = (select auth.uid()))
);

create policy "Owners can read responses"
on public.form_responses for select
to authenticated
using (
  exists (
    select 1 from public.forms
    where forms.id = form_responses.form_id
      and forms.owner_id = (select auth.uid())
  )
);

create policy "Anyone can submit answers to published forms"
on public.form_response_answers for insert
to anon, authenticated
with check (
  exists (
    select 1
    from public.form_responses
    join public.forms on forms.id = form_responses.form_id
    where form_responses.id = form_response_answers.response_id
      and forms.status = 'published'
  )
  and exists (
    select 1
    from public.form_fields
    join public.form_responses on form_responses.form_id = form_fields.form_id
    where form_fields.id = form_response_answers.field_id
      and form_responses.id = form_response_answers.response_id
  )
);

create policy "Owners can read answers"
on public.form_response_answers for select
to authenticated
using (
  exists (
    select 1
    from public.form_responses
    join public.forms on forms.id = form_responses.form_id
    where form_responses.id = form_response_answers.response_id
      and forms.owner_id = (select auth.uid())
  )
);

create or replace function public.submit_form_response(
  target_form_id uuid,
  submitted_answers jsonb,
  submitted_email text default null,
  submitted_metadata jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  new_response_id uuid;
  answer record;
  target_field_id uuid;
begin
  if jsonb_typeof(submitted_answers) <> 'object' then
    raise exception 'Answers must be a JSON object';
  end if;

  if not exists (
    select 1 from public.forms
    where id = target_form_id and status = 'published'
  ) then
    raise exception 'Form is not available for responses';
  end if;

  insert into public.form_responses (
    form_id,
    respondent_id,
    respondent_email,
    metadata
  )
  values (
    target_form_id,
    auth.uid(),
    nullif(trim(submitted_email), ''),
    coalesce(submitted_metadata, '{}'::jsonb)
  )
  returning id into new_response_id;

  for answer in select * from jsonb_each(submitted_answers)
  loop
    select id into target_field_id
    from public.form_fields
    where form_id = target_form_id and key = answer.key;

    if target_field_id is null then
      raise exception 'Unknown form field: %', answer.key;
    end if;

    insert into public.form_response_answers (response_id, field_id, value)
    values (new_response_id, target_field_id, answer.value);
  end loop;

  return new_response_id;
end;
$$;

revoke all on function public.submit_form_response(uuid, jsonb, text, jsonb) from public;
grant execute on function public.submit_form_response(uuid, jsonb, text, jsonb) to anon, authenticated;
