export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      applications: {
        Row: {
          applied_date: string | null
          archived: boolean | null
          company_name: string
          created_at: string | null
          id: string
          job_url: string | null
          location: string | null
          notes: string | null
          position_title: string
          source: string | null
          source_email_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          applied_date?: string | null
          archived?: boolean | null
          company_name: string
          created_at?: string | null
          id?: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          position_title: string
          source?: string | null
          source_email_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          applied_date?: string | null
          archived?: boolean | null
          company_name?: string
          created_at?: string | null
          id?: string
          job_url?: string | null
          location?: string | null
          notes?: string | null
          position_title?: string
          source?: string | null
          source_email_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_source_email_id_fkey"
            columns: ["source_email_id"]
            isOneToOne: false
            referencedRelation: "emails"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_labels: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          label_path: string
          oauth_connection_id: string | null
          provider: string | null
          provider_label_id: string
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          label_path: string
          oauth_connection_id?: string | null
          provider?: string | null
          provider_label_id: string
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          label_path?: string
          oauth_connection_id?: string | null
          provider?: string | null
          provider_label_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_labels_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_labels_oauth_connection_id_fkey"
            columns: ["oauth_connection_id"]
            isOneToOne: false
            referencedRelation: "oauth_connections"
            referencedColumns: ["id"]
          },
        ]
      }
      emails: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          from_email: string | null
          id: string
          oauth_connection_id: string | null
          parsed_json: Json | null
          processed: boolean | null
          provider_message_id: string
          received_at: string | null
          subject: string | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          from_email?: string | null
          id?: string
          oauth_connection_id?: string | null
          parsed_json?: Json | null
          processed?: boolean | null
          provider_message_id: string
          received_at?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          from_email?: string | null
          id?: string
          oauth_connection_id?: string | null
          parsed_json?: Json | null
          processed?: boolean | null
          provider_message_id?: string
          received_at?: string | null
          subject?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "emails_oauth_connection_id_fkey"
            columns: ["oauth_connection_id"]
            isOneToOne: false
            referencedRelation: "oauth_connections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      oauth_connections: {
        Row: {
          access_token: string | null
          created_at: string | null
          email_address: string
          error_message: string | null
          id: string
          last_sync_at: string | null
          provider: string | null
          refresh_token: string | null
          sync_status: string | null
          token_expires_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string | null
          email_address: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          provider?: string | null
          refresh_token?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string | null
          email_address?: string
          error_message?: string | null
          id?: string
          last_sync_at?: string | null
          provider?: string | null
          refresh_token?: string | null
          sync_status?: string | null
          token_expires_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oauth_connections_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          settings: Json | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          settings?: Json | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          settings?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
