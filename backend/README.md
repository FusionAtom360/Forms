# Formly backend

The backend is a local Supabase project. It owns authentication, form definitions,
published form access, and response collection.

## Local development

Install the [Supabase CLI](https://supabase.com/docs/guides/cli), start Docker, and
run the following from `backend/`:

```bash
supabase start
supabase db reset
```

The CLI prints the local API URL and anon key. Copy them into
`frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

The service-role key must never be exposed to the browser. If a privileged server
operation is needed later, add it to a server-only module and use
`SUPABASE_SERVICE_ROLE_KEY` there.

## Data model

- `profiles` mirrors `auth.users` and stores workspace display information.
- `forms` stores the form identity, slug, publication status, and settings.
- `form_fields` stores ordered questions and their validation/configuration.
- `form_responses` stores one submission per respondent.
- `form_response_answers` stores typed answers for each field.

Forms are private to their owner while being edited. Published forms can be read
by anyone with the public slug, and anyone can submit a response. Responses and
answers remain visible only to the form owner.

Migrations live in `supabase/migrations`. Run `supabase db reset` after changing
them during local development.
