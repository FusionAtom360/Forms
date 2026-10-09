import { createClient } from "./server";
import type { Database } from "./database.types";

type FormInsert = Database["public"]["Tables"]["forms"]["Insert"];
type FieldInsert = Database["public"]["Tables"]["form_fields"]["Insert"];

export async function listOwnedForms() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*, form_fields(*)")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Unable to load forms: ${error.message}`);
  return data;
}

export async function createForm(input: Omit<FormInsert, "owner_id"> & { owner_id: string; fields?: Omit<FieldInsert, "form_id">[] }) {
  const supabase = await createClient();
  const { fields = [], ...form } = input;
  const { data, error } = await supabase.from("forms").insert(form).select().single();

  if (error) throw new Error(`Unable to create form: ${error.message}`);
  if (fields.length === 0) return data;

  const { error: fieldsError } = await supabase.from("form_fields").insert(
    fields.map((field) => ({ ...field, form_id: data.id })),
  );

  if (fieldsError) {
    await supabase.from("forms").delete().eq("id", data.id);
    throw new Error(`Unable to create form fields: ${fieldsError.message}`);
  }

  return data;
}

export async function getPublishedForm(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*, form_fields(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .order("position", { foreignTable: "form_fields", ascending: true })
    .maybeSingle();

  if (error) throw new Error(`Unable to load published form: ${error.message}`);
  return data;
}

export async function submitFormResponse(
  formId: string,
  answers: Database["public"]["Tables"]["form_response_answers"]["Insert"]["value"],
  email?: string,
  metadata?: Database["public"]["Tables"]["form_responses"]["Insert"]["metadata"],
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_form_response", {
    target_form_id: formId,
    submitted_answers: answers,
    submitted_email: email,
    submitted_metadata: metadata,
  });

  if (error) throw new Error(`Unable to submit form response: ${error.message}`);
  return data;
}
