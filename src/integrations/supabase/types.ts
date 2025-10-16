export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      delivery_receipts: {
        Row: {
          created_at: string
          delivery_date: string | null
          delivery_time: string | null
          id: string
          image_url: string
          observations: string | null
          ocr_raw_data: Json | null
          receiver_name: string | null
          receiver_signature: string | null
          shipment_id: string | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          image_url: string
          observations?: string | null
          ocr_raw_data?: Json | null
          receiver_name?: string | null
          receiver_signature?: string | null
          shipment_id?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          image_url?: string
          observations?: string | null
          ocr_raw_data?: Json | null
          receiver_name?: string | null
          receiver_signature?: string | null
          shipment_id?: string | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_receipts_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "embarques"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_documents: {
        Row: {
          created_at: string
          document_number: string | null
          document_type: string
          driver_id: string
          expiry_date: string | null
          id: string
          image_url: string
          issue_date: string | null
          issuing_agency: string | null
          ocr_raw_data: Json | null
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          document_number?: string | null
          document_type: string
          driver_id: string
          expiry_date?: string | null
          id?: string
          image_url: string
          issue_date?: string | null
          issuing_agency?: string | null
          ocr_raw_data?: Json | null
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          document_number?: string | null
          document_type?: string
          driver_id?: string
          expiry_date?: string | null
          id?: string
          image_url?: string
          issue_date?: string | null
          issuing_agency?: string | null
          ocr_raw_data?: Json | null
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      embarques: {
        Row: {
          cargo_type: string | null
          client_name: string | null
          created_at: string
          delivery_date: string | null
          destination: string
          driver_id: string | null
          driver_value: number | null
          email_id: string | null
          id: string
          origin: string
          pickup_date: string | null
          status: string
          total_value: number | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          cargo_type?: string | null
          client_name?: string | null
          created_at?: string
          delivery_date?: string | null
          destination: string
          driver_id?: string | null
          driver_value?: number | null
          email_id?: string | null
          id?: string
          origin: string
          pickup_date?: string | null
          status?: string
          total_value?: number | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          cargo_type?: string | null
          client_name?: string | null
          created_at?: string
          delivery_date?: string | null
          destination?: string
          driver_id?: string | null
          driver_value?: number | null
          email_id?: string | null
          id?: string
          origin?: string
          pickup_date?: string | null
          status?: string
          total_value?: number | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          message_text: string
          name: string
          template_type: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          message_text: string
          name: string
          template_type: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          message_text?: string
          name?: string
          template_type?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      ranking_rules: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          name: string
          priority: number
          rule_config: Json
          rule_type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name: string
          priority?: number
          rule_config?: Json
          rule_type: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          priority?: number
          rule_config?: Json
          rule_type?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
