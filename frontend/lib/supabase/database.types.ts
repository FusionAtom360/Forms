export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string;
          slug: string;
          status: "draft" | "published" | "archived";
          settings: Json;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string;
          slug: string;
          status?: "draft" | "published" | "archived";
          settings?: Json;
          published_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["forms"]["Insert"]>;
        Relationships: [];
      };
      form_fields: {
        Row: {
          id: string;
          form_id: string;
          position: number;
          type: "short_text" | "long_text" | "email" | "number" | "single_choice" | "multiple_choice" | "dropdown" | "date" | "rating" | "file";
          label: string;
          description: string;
          key: string;
          required: boolean;
          config: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          position: number;
          type: Database["public"]["Tables"]["form_fields"]["Row"]["type"];
          label: string;
          description?: string;
          key: string;
          required?: boolean;
          config?: Json;
        };
        Update: Partial<Database["public"]["Tables"]["form_fields"]["Insert"]>;
        Relationships: [];
      };
      form_responses: {
        Row: {
          id: string;
          form_id: string;
          respondent_id: string | null;
          respondent_email: string | null;
          metadata: Json;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          respondent_id?: string | null;
          respondent_email?: string | null;
          metadata?: Json;
        };
        Update: never;
        Relationships: [];
      };
      form_response_answers: {
        Row: {
          id: string;
          response_id: string;
          field_id: string;
          value: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          response_id: string;
          field_id: string;
          value: Json;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: {};
    Functions: {
      submit_form_response: {
        Args: {
          target_form_id: string;
          submitted_answers: Json;
          submitted_email?: string | null;
          submitted_metadata?: Json;
        };
        Returns: string;
      };
    };
    Enums: {
      form_status: "draft" | "published" | "archived";
      field_type: "short_text" | "long_text" | "email" | "number" | "single_choice" | "multiple_choice" | "dropdown" | "date" | "rating" | "file";
    };
    CompositeTypes: {};
  };
};
