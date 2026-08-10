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
      category_overrides: {
        Row: {
          brand: string
          created_at: string
          note: string | null
          subcategory: string
          title: string
          top_level: string
        }
        Insert: {
          brand: string
          created_at?: string
          note?: string | null
          subcategory: string
          title: string
          top_level: string
        }
        Update: {
          brand?: string
          created_at?: string
          note?: string | null
          subcategory?: string
          title?: string
          top_level?: string
        }
        Relationships: []
      }
      category_rules: {
        Row: {
          aux_re: string | null
          created_at: string
          exclude_re: string | null
          include_re: string
          is_active: boolean
          note: string | null
          priority: number
          subcategory: string
          top_level: string
        }
        Insert: {
          aux_re?: string | null
          created_at?: string
          exclude_re?: string | null
          include_re: string
          is_active?: boolean
          note?: string | null
          priority: number
          subcategory: string
          top_level: string
        }
        Update: {
          aux_re?: string | null
          created_at?: string
          exclude_re?: string | null
          include_re?: string
          is_active?: boolean
          note?: string | null
          priority?: number
          subcategory?: string
          top_level?: string
        }
        Relationships: []
      }
      microsite_products: {
        Row: {
          category: string | null
          clinical_group: string | null
          collection: string
          created_at: string
          family_slug: string | null
          id: string
          image_url: string | null
          key_specifications: string | null
          price_hire_weekly: number | null
          price_rrp: number | null
          product_code: string | null
          product_name: string
          selectable_options: string | null
          sort_order: number
          status: string
          supply_mode: string
          variant_label: string | null
        }
        Insert: {
          category?: string | null
          clinical_group?: string | null
          collection?: string
          created_at?: string
          family_slug?: string | null
          id?: string
          image_url?: string | null
          key_specifications?: string | null
          price_hire_weekly?: number | null
          price_rrp?: number | null
          product_code?: string | null
          product_name: string
          selectable_options?: string | null
          sort_order?: number
          status?: string
          supply_mode?: string
          variant_label?: string | null
        }
        Update: {
          category?: string | null
          clinical_group?: string | null
          collection?: string
          created_at?: string
          family_slug?: string | null
          id?: string
          image_url?: string | null
          key_specifications?: string | null
          price_hire_weekly?: number | null
          price_rrp?: number | null
          product_code?: string | null
          product_name?: string
          selectable_options?: string | null
          sort_order?: number
          status?: string
          supply_mode?: string
          variant_label?: string | null
        }
        Relationships: []
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
      product_families: {
        Row: {
          brand: string
          created_at: string
          display_name: string | null
          id: string
          is_active: boolean
          max_price: number | null
          min_price: number | null
          primary_image_url: string | null
          proposed_rule: number | null
          proposed_subcategory: string | null
          proposed_top_level: string | null
          representative_sku: string | null
          search_document: unknown
          search_text: string | null
          sku_blob: string | null
          slug: string
          subcategory: string | null
          taxonomy_reviewed: boolean
          title: string
          top_level_category: string | null
          updated_at: string
          variant_count: number
          variant_skus: string[]
        }
        Insert: {
          brand: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean
          max_price?: number | null
          min_price?: number | null
          primary_image_url?: string | null
          proposed_rule?: number | null
          proposed_subcategory?: string | null
          proposed_top_level?: string | null
          representative_sku?: string | null
          search_document?: unknown
          search_text?: string | null
          sku_blob?: string | null
          slug: string
          subcategory?: string | null
          taxonomy_reviewed?: boolean
          title: string
          top_level_category?: string | null
          updated_at?: string
          variant_count?: number
          variant_skus?: string[]
        }
        Update: {
          brand?: string
          created_at?: string
          display_name?: string | null
          id?: string
          is_active?: boolean
          max_price?: number | null
          min_price?: number | null
          primary_image_url?: string | null
          proposed_rule?: number | null
          proposed_subcategory?: string | null
          proposed_top_level?: string | null
          representative_sku?: string | null
          search_document?: unknown
          search_text?: string | null
          sku_blob?: string | null
          slug?: string
          subcategory?: string | null
          taxonomy_reviewed?: boolean
          title?: string
          top_level_category?: string | null
          updated_at?: string
          variant_count?: number
          variant_skus?: string[]
        }
        Relationships: []
      }
      product_image_assets: {
        Row: {
          content_type: string | null
          created_at: string
          error_message: string | null
          height: number | null
          id: number
          migrated_at: string | null
          optimized_bytes: number | null
          original_bytes: number | null
          public_url: string | null
          sha256: string | null
          source_url: string
          status: string
          storage_path: string | null
          verified_at: string | null
          width: number | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          error_message?: string | null
          height?: number | null
          id?: never
          migrated_at?: string | null
          optimized_bytes?: number | null
          original_bytes?: number | null
          public_url?: string | null
          sha256?: string | null
          source_url: string
          status?: string
          storage_path?: string | null
          verified_at?: string | null
          width?: number | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          error_message?: string | null
          height?: number | null
          id?: never
          migrated_at?: string | null
          optimized_bytes?: number | null
          original_bytes?: number | null
          public_url?: string | null
          sha256?: string | null
          source_url?: string
          status?: string
          storage_path?: string | null
          verified_at?: string | null
          width?: number | null
        }
        Relationships: []
      }
      product_image_url_history: {
        Row: {
          id: number
          migrated_at: string
          new_url: string
          old_url: string
          sku: string
          table_name: string
        }
        Insert: {
          id?: never
          migrated_at?: string
          new_url: string
          old_url: string
          sku: string
          table_name: string
        }
        Update: {
          id?: never
          migrated_at?: string
          new_url?: string
          old_url?: string
          sku?: string
          table_name?: string
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
          family_id: string | null
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
          family_id?: string | null
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
          family_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "products_categorized_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "product_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_categorized_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "taxonomy_review_queue"
            referencedColumns: ["id"]
          },
        ]
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
      search_events: {
        Row: {
          created_at: string
          id: string
          query: string
          result_count: number
          session_id: string | null
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          query: string
          result_count: number
          session_id?: string | null
          source: string
        }
        Update: {
          created_at?: string
          id?: string
          query?: string
          result_count?: number
          session_id?: string | null
          source?: string
        }
        Relationships: []
      }
      search_synonyms: {
        Row: {
          alias: string
          created_at: string
          expansion: string
          id: string
          is_active: boolean
          notes: string | null
        }
        Insert: {
          alias: string
          created_at?: string
          expansion: string
          id?: string
          is_active?: boolean
          notes?: string | null
        }
        Update: {
          alias?: string
          created_at?: string
          expansion?: string
          id?: string
          is_active?: boolean
          notes?: string | null
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
      search_gaps: {
        Row: {
          distinct_sessions: number | null
          last_searched: string | null
          query: string | null
          times_searched: number | null
        }
        Relationships: []
      }
      search_summary: {
        Row: {
          day: string | null
          searches: number | null
          sessions: number | null
          zero_result: number | null
          zero_result_pct: number | null
        }
        Relationships: []
      }
      taxonomy_review_queue: {
        Row: {
          brand: string | null
          id: string | null
          slug: string | null
          subcategory: string | null
          title: string | null
          top_level_category: string | null
          variant_count: number | null
        }
        Insert: {
          brand?: string | null
          id?: string | null
          slug?: string | null
          subcategory?: string | null
          title?: string | null
          top_level_category?: string | null
          variant_count?: number | null
        }
        Update: {
          brand?: string | null
          id?: string | null
          slug?: string | null
          subcategory?: string | null
          title?: string | null
          top_level_category?: string | null
          variant_count?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_category_overrides: { Args: never; Returns: number }
      apply_taxonomy_proposal: { Args: never; Returns: number }
      create_quote_with_items: {
        Args: { p_payload: Json }
        Returns: {
          quote_id: string
          ref_code: string
        }[]
      }
      generate_quote_ref_code: { Args: never; Returns: string }
      get_catalogue_facets: {
        Args: { p_categories?: string[] }
        Returns: {
          facet_type: string
          family_count: number
          value: string
        }[]
      }
      log_search_event: {
        Args: {
          p_query: string
          p_result_count: number
          p_session_id?: string
          p_source?: string
        }
        Returns: undefined
      }
      make_quote_number: { Args: never; Returns: string }
      normalize_product_description_text: {
        Args: { input_text: string }
        Returns: string
      }
      propose_product_taxonomy: {
        Args: never
        Returns: {
          proposed: number
          unmatched: number
        }[]
      }
      rebuild_product_families: {
        Args: never
        Returns: {
          families_deactivated: number
          families_upserted: number
          variants_linked: number
        }[]
      }
      search_product_families: {
        Args: {
          p_brands?: string[]
          p_categories?: string[]
          p_limit?: number
          p_offset?: number
          p_query?: string
          p_sort?: string
          p_subcategories?: string[]
        }
        Returns: {
          brand: string
          display_name: string
          id: string
          matched_sku: string
          max_price: number
          min_price: number
          primary_image_url: string
          representative_sku: string
          slug: string
          subcategory: string
          title: string
          top_level_category: string
          total_count: number
          variant_count: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      sm_match_text: {
        Args: { p_brand: string; p_title: string }
        Returns: string
      }
      sm_safe_numeric: { Args: { p_value: string }; Returns: number }
      sm_slugify: {
        Args: { p_brand: string; p_title: string }
        Returns: string
      }
      tmp_check_b64: { Args: { data_uri: string }; Returns: string }
      tmp_check_riff: { Args: { data_uri: string }; Returns: string }
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
