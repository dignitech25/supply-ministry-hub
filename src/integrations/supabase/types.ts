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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      _stg_products_website: {
        Row: {
          brand: string | null
          category: string | null
          description: string | null
          featured: boolean | null
          name: string | null
          primary_image_url: string | null
          rrp_cents: number | null
          sales_price_cents: number | null
          show_on_site: boolean | null
          sku: string | null
          tax_class: string | null
          trial_available: boolean | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          description?: string | null
          featured?: boolean | null
          name?: string | null
          primary_image_url?: string | null
          rrp_cents?: number | null
          sales_price_cents?: number | null
          show_on_site?: boolean | null
          sku?: string | null
          tax_class?: string | null
          trial_available?: boolean | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          description?: string | null
          featured?: boolean | null
          name?: string | null
          primary_image_url?: string | null
          rrp_cents?: number | null
          sales_price_cents?: number | null
          show_on_site?: boolean | null
          sku?: string | null
          tax_class?: string | null
          trial_available?: boolean | null
        }
        Relationships: []
      }
      brands: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          logo_url: string | null
          name: string
          slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_assets: {
        Row: {
          asset_type: string
          created_at: string
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          is_primary: boolean | null
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          asset_type: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          asset_type?: string
          created_at?: string
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          is_primary?: boolean | null
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      product_attributes: {
        Row: {
          attribute_name: string
          attribute_value: string
          created_at: string
          id: string
          product_id: string | null
          sort_order: number | null
        }
        Insert: {
          attribute_name: string
          attribute_value: string
          created_at?: string
          id?: string
          product_id?: string | null
          sort_order?: number | null
        }
        Update: {
          attribute_name?: string
          attribute_value?: string
          created_at?: string
          id?: string
          product_id?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      product_catalogue_list: {
        Row: {
          Brand: string | null
          "Brochure_URLs / Manual_URLs": string | null
          Clinical_Use_Cases: string | null
          Colour: string | null
          "Funding/Compliance": string | null
          GST: string | null
          Image_Alt_Text: string | null
          Image_URLs: string | null
          Key_Features: string | null
          Last_Checked_UTC: string | null
          Long_Description: string | null
          Meta_Description: string | null
          Primary_Category: string | null
          Product: string | null
          Range: string | null
          RRP: number | null
          SEO_Title: string | null
          Short_Description: string | null
          Size: string | null
          SKU: string
          Source_Site: string | null
          Source_URL: string | null
          Specifications: Json | null
          Subcategory: string | null
          Type: string | null
          URL_Slug: string | null
        }
        Insert: {
          Brand?: string | null
          "Brochure_URLs / Manual_URLs"?: string | null
          Clinical_Use_Cases?: string | null
          Colour?: string | null
          "Funding/Compliance"?: string | null
          GST?: string | null
          Image_Alt_Text?: string | null
          Image_URLs?: string | null
          Key_Features?: string | null
          Last_Checked_UTC?: string | null
          Long_Description?: string | null
          Meta_Description?: string | null
          Primary_Category?: string | null
          Product?: string | null
          Range?: string | null
          RRP?: number | null
          SEO_Title?: string | null
          Short_Description?: string | null
          Size?: string | null
          SKU: string
          Source_Site?: string | null
          Source_URL?: string | null
          Specifications?: Json | null
          Subcategory?: string | null
          Type?: string | null
          URL_Slug?: string | null
        }
        Update: {
          Brand?: string | null
          "Brochure_URLs / Manual_URLs"?: string | null
          Clinical_Use_Cases?: string | null
          Colour?: string | null
          "Funding/Compliance"?: string | null
          GST?: string | null
          Image_Alt_Text?: string | null
          Image_URLs?: string | null
          Key_Features?: string | null
          Last_Checked_UTC?: string | null
          Long_Description?: string | null
          Meta_Description?: string | null
          Primary_Category?: string | null
          Product?: string | null
          Range?: string | null
          RRP?: number | null
          SEO_Title?: string | null
          Short_Description?: string | null
          Size?: string | null
          SKU?: string
          Source_Site?: string | null
          Source_URL?: string | null
          Specifications?: Json | null
          Subcategory?: string | null
          Type?: string | null
          URL_Slug?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string | null
          brochure_url: string | null
          clinical_use_case: string | null
          color: string | null
          created_at: string | null
          description: string | null
          funding_context: string | null
          id: string
          image_url: string | null
          price_discounted: number | null
          price_rrp: number | null
          product_type: string | null
          size: string | null
          sku: string
          specifications: Json | null
          subtype: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          brand?: string | null
          brochure_url?: string | null
          clinical_use_case?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          funding_context?: string | null
          id?: string
          image_url?: string | null
          price_discounted?: number | null
          price_rrp?: number | null
          product_type?: string | null
          size?: string | null
          sku: string
          specifications?: Json | null
          subtype?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          brand?: string | null
          brochure_url?: string | null
          clinical_use_case?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          funding_context?: string | null
          id?: string
          image_url?: string | null
          price_discounted?: number | null
          price_rrp?: number | null
          product_type?: string | null
          size?: string | null
          sku?: string
          specifications?: Json | null
          subtype?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      products_backup_20251022: {
        Row: {
          brand: string | null
          brochure_url: string | null
          clinical_use_case: string | null
          color: string | null
          created_at: string | null
          description: string | null
          funding_context: string | null
          id: string | null
          image_url: string | null
          price_discounted: number | null
          price_rrp: number | null
          product_type: string | null
          size: string | null
          sku: string | null
          specifications: Json | null
          subtype: string | null
          title: string | null
          url: string | null
        }
        Insert: {
          brand?: string | null
          brochure_url?: string | null
          clinical_use_case?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          funding_context?: string | null
          id?: string | null
          image_url?: string | null
          price_discounted?: number | null
          price_rrp?: number | null
          product_type?: string | null
          size?: string | null
          sku?: string | null
          specifications?: Json | null
          subtype?: string | null
          title?: string | null
          url?: string | null
        }
        Update: {
          brand?: string | null
          brochure_url?: string | null
          clinical_use_case?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          funding_context?: string | null
          id?: string | null
          image_url?: string | null
          price_discounted?: number | null
          price_rrp?: number | null
          product_type?: string | null
          size?: string | null
          sku?: string | null
          specifications?: Json | null
          subtype?: string | null
          title?: string | null
          url?: string | null
        }
        Relationships: []
      }
      products_categorized: {
        Row: {
          barcode: string | null
          brand: string | null
          category_alternatives: string | null
          category_confidence: string | null
          category_path: string | null
          category_rule: string | null
          category_score: string | null
          clinical_use_case: string | null
          color_normalized: string | null
          description: string | null
          description_long: string | null
          description_short: string | null
          description_source_concat: string | null
          handle: string | null
          image_url: string | null
          is_consumable: string | null
          option1_name: string | null
          option1_value: string | null
          option2_name: string | null
          option2_value: string | null
          price_discounted: string | null
          price_rrp: number | null
          product_id: string | null
          product_type: string | null
          size: string | null
          size_normalized: string | null
          "size_normalized.1": string | null
          sku: string
          sku_clean: string | null
          spec_depth_mm: string | null
          spec_dimensions_text: string | null
          spec_height_mm: string | null
          spec_json_raw: string | null
          spec_length_mm: string | null
          spec_swl_kg: string | null
          spec_thickness_mm: string | null
          spec_weight_kg: string | null
          spec_width_mm: string | null
          specifications: string | null
          subcategory: string | null
          subtype: string | null
          title: string | null
          top_level_category: string | null
          vendor: string | null
        }
        Insert: {
          barcode?: string | null
          brand?: string | null
          category_alternatives?: string | null
          category_confidence?: string | null
          category_path?: string | null
          category_rule?: string | null
          category_score?: string | null
          clinical_use_case?: string | null
          color_normalized?: string | null
          description?: string | null
          description_long?: string | null
          description_short?: string | null
          description_source_concat?: string | null
          handle?: string | null
          image_url?: string | null
          is_consumable?: string | null
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          price_discounted?: string | null
          price_rrp?: number | null
          product_id?: string | null
          product_type?: string | null
          size?: string | null
          size_normalized?: string | null
          "size_normalized.1"?: string | null
          sku: string
          sku_clean?: string | null
          spec_depth_mm?: string | null
          spec_dimensions_text?: string | null
          spec_height_mm?: string | null
          spec_json_raw?: string | null
          spec_length_mm?: string | null
          spec_swl_kg?: string | null
          spec_thickness_mm?: string | null
          spec_weight_kg?: string | null
          spec_width_mm?: string | null
          specifications?: string | null
          subcategory?: string | null
          subtype?: string | null
          title?: string | null
          top_level_category?: string | null
          vendor?: string | null
        }
        Update: {
          barcode?: string | null
          brand?: string | null
          category_alternatives?: string | null
          category_confidence?: string | null
          category_path?: string | null
          category_rule?: string | null
          category_score?: string | null
          clinical_use_case?: string | null
          color_normalized?: string | null
          description?: string | null
          description_long?: string | null
          description_short?: string | null
          description_source_concat?: string | null
          handle?: string | null
          image_url?: string | null
          is_consumable?: string | null
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          price_discounted?: string | null
          price_rrp?: number | null
          product_id?: string | null
          product_type?: string | null
          size?: string | null
          size_normalized?: string | null
          "size_normalized.1"?: string | null
          sku?: string
          sku_clean?: string | null
          spec_depth_mm?: string | null
          spec_dimensions_text?: string | null
          spec_height_mm?: string | null
          spec_json_raw?: string | null
          spec_length_mm?: string | null
          spec_swl_kg?: string | null
          spec_thickness_mm?: string | null
          spec_weight_kg?: string | null
          spec_width_mm?: string | null
          specifications?: string | null
          subcategory?: string | null
          subtype?: string | null
          title?: string | null
          top_level_category?: string | null
          vendor?: string | null
        }
        Relationships: []
      }
      products_legacy: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string
          description: string | null
          featured: boolean
          id: string
          name: string
          primary_image_url: string | null
          rrp_cents: number | null
          sales_price_cents: number
          show_on_site: boolean
          sku: string
          tax_class: string | null
          trial_available: boolean
          updated_at: string
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          name: string
          primary_image_url?: string | null
          rrp_cents?: number | null
          sales_price_cents: number
          show_on_site?: boolean
          sku: string
          tax_class?: string | null
          trial_available?: boolean
          updated_at?: string
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string
          description?: string | null
          featured?: boolean
          id?: string
          name?: string
          primary_image_url?: string | null
          rrp_cents?: number | null
          sales_price_cents?: number
          show_on_site?: boolean
          sku?: string
          tax_class?: string | null
          trial_available?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      quote_items: {
        Row: {
          colour: string | null
          created_at: string
          id: string
          line_notes: string | null
          price_source: string | null
          product_id: string | null
          quantity: number
          quote_id: string | null
          size: string | null
          sku: string | null
          title: string | null
          unit_price: number | null
        }
        Insert: {
          colour?: string | null
          created_at?: string
          id?: string
          line_notes?: string | null
          price_source?: string | null
          product_id?: string | null
          quantity?: number
          quote_id?: string | null
          size?: string | null
          sku?: string | null
          title?: string | null
          unit_price?: number | null
        }
        Update: {
          colour?: string | null
          created_at?: string
          id?: string
          line_notes?: string | null
          price_source?: string | null
          product_id?: string | null
          quantity?: number
          quote_id?: string | null
          size?: string | null
          sku?: string | null
          title?: string | null
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_items_quote_id_fkey"
            columns: ["quote_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          category: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          metadata: Json | null
          organization: string | null
          phone: string
          requirements: string
          source_url: string | null
          status: string
          timeline: string
          user_agent: string | null
        }
        Insert: {
          category: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          metadata?: Json | null
          organization?: string | null
          phone: string
          requirements: string
          source_url?: string | null
          status?: string
          timeline: string
          user_agent?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          metadata?: Json | null
          organization?: string | null
          phone?: string
          requirements?: string
          source_url?: string | null
          status?: string
          timeline?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          client_name: string | null
          client_ndis_number: string | null
          clinical_context: string | null
          created_at: string
          delivery_address: string | null
          delivery_postcode: string | null
          funding_type: string | null
          id: string
          notes: string | null
          raw_form: Json | null
          ref_code: string
          requester_email: string | null
          requester_name: string | null
          requester_organisation: string | null
          requester_phone: string | null
          requester_type: string | null
          status: string
          subtotal: number | null
          total_items: number | null
          urgency: string | null
        }
        Insert: {
          client_name?: string | null
          client_ndis_number?: string | null
          clinical_context?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_postcode?: string | null
          funding_type?: string | null
          id?: string
          notes?: string | null
          raw_form?: Json | null
          ref_code?: string
          requester_email?: string | null
          requester_name?: string | null
          requester_organisation?: string | null
          requester_phone?: string | null
          requester_type?: string | null
          status?: string
          subtotal?: number | null
          total_items?: number | null
          urgency?: string | null
        }
        Update: {
          client_name?: string | null
          client_ndis_number?: string | null
          clinical_context?: string | null
          created_at?: string
          delivery_address?: string | null
          delivery_postcode?: string | null
          funding_type?: string | null
          id?: string
          notes?: string | null
          raw_form?: Json | null
          ref_code?: string
          requester_email?: string | null
          requester_name?: string | null
          requester_organisation?: string | null
          requester_phone?: string | null
          requester_type?: string | null
          status?: string
          subtotal?: number | null
          total_items?: number | null
          urgency?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          endpoint: string
          id: string
          identifier: string
          identifier_type: string
          request_count: number
          updated_at: string
          window_start: string
        }
        Insert: {
          created_at?: string
          endpoint: string
          id?: string
          identifier: string
          identifier_type: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Update: {
          created_at?: string
          endpoint?: string
          id?: string
          identifier?: string
          identifier_type?: string
          request_count?: number
          updated_at?: string
          window_start?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      products_public: {
        Row: {
          brand: string | null
          category: string | null
          created_at: string | null
          description: string | null
          featured: boolean | null
          gst_rate: number | null
          id: string | null
          name: string | null
          primary_image_url: string | null
          rrp_cents: number | null
          sales_price_cents: number | null
          sales_price_inc_gst_cents: number | null
          show_on_site: boolean | null
          sku: string | null
          tax_class: string | null
          trial_available: boolean | null
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          description?: never
          featured?: boolean | null
          gst_rate?: never
          id?: string | null
          name?: string | null
          primary_image_url?: string | null
          rrp_cents?: number | null
          sales_price_cents?: number | null
          sales_price_inc_gst_cents?: never
          show_on_site?: boolean | null
          sku?: string | null
          tax_class?: string | null
          trial_available?: boolean | null
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          category?: string | null
          created_at?: string | null
          description?: never
          featured?: boolean | null
          gst_rate?: never
          id?: string | null
          name?: string | null
          primary_image_url?: string | null
          rrp_cents?: number | null
          sales_price_cents?: number | null
          sales_price_inc_gst_cents?: never
          show_on_site?: boolean | null
          sku?: string | null
          tax_class?: string | null
          trial_available?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_quote_with_items: {
        Args: { p_payload: Json }
        Returns: {
          quote_id: string
          ref_code: string
        }[]
      }
      generate_quote_ref_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_quote_number: { Args: never; Returns: string }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "admin" | "staff" | "user"
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
    Enums: {
      app_role: ["admin", "staff", "user"],
    },
  },
} as const
