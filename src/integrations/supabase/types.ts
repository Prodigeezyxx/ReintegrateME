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
      ai_tool_proficiencies: {
        Row: {
          created_at: string | null
          id: string
          proficiency_level: string
          tool_name: string
          user_id: string | null
          verification_date: string | null
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          proficiency_level: string
          tool_name: string
          user_id?: string | null
          verification_date?: string | null
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          proficiency_level?: string
          tool_name?: string
          user_id?: string | null
          verification_date?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tool_proficiencies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_profiles: {
        Row: {
          company_name: string
          company_size: string | null
          created_at: string | null
          description: string | null
          id: string
          industry: string | null
          location_city: string | null
          location_country: string | null
          logo_url: string | null
          profile_completion_percentage: number | null
          updated_at: string | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location_city?: string | null
          location_country?: string | null
          logo_url?: string | null
          profile_completion_percentage?: number | null
          updated_at?: string | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          company_size?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          industry?: string | null
          location_city?: string | null
          location_country?: string | null
          logo_url?: string | null
          profile_completion_percentage?: number | null
          updated_at?: string | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          category: string
          company_id: string
          created_at: string | null
          description: string
          employment_type: string
          experience_level: string | null
          hirer_id: string
          id: string
          location_city: string | null
          location_country: string | null
          required_skills: string[] | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          salary_period: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          company_id: string
          created_at?: string | null
          description: string
          employment_type: string
          experience_level?: string | null
          hirer_id: string
          id?: string
          location_city?: string | null
          location_country?: string | null
          required_skills?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          company_id?: string
          created_at?: string | null
          description?: string
          employment_type?: string
          experience_level?: string | null
          hirer_id?: string
          id?: string
          location_city?: string | null
          location_country?: string | null
          required_skills?: string[] | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_period?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_hirer_id_fkey"
            columns: ["hirer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          chat_thread_id: string | null
          context_job_id: string | null
          created_at: string | null
          hirer_id: string
          id: string
          seeker_id: string
        }
        Insert: {
          chat_thread_id?: string | null
          context_job_id?: string | null
          created_at?: string | null
          hirer_id: string
          id?: string
          seeker_id: string
        }
        Update: {
          chat_thread_id?: string | null
          context_job_id?: string | null
          created_at?: string | null
          hirer_id?: string
          id?: string
          seeker_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_context_job_id_fkey"
            columns: ["context_job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_hirer_id_fkey"
            columns: ["hirer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_seeker_id_fkey"
            columns: ["seeker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          current_step: number | null
          experience_level: string | null
          goals: string[] | null
          id: string
          selected_tools: string[] | null
          updated_at: string | null
          user_id: string | null
          user_type: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          experience_level?: string | null
          goals?: string[] | null
          id?: string
          selected_tools?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          current_step?: number | null
          experience_level?: string | null
          goals?: string[] | null
          id?: string
          selected_tools?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          user_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_pieces: {
        Row: {
          after_code: string | null
          ai_tools_used: string[] | null
          before_code: string | null
          client_testimonial: string | null
          completion_time_hours: number | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          developer_id: string | null
          github_url: string | null
          id: string
          image_url: string | null
          project_url: string | null
          title: string
        }
        Insert: {
          after_code?: string | null
          ai_tools_used?: string[] | null
          before_code?: string | null
          client_testimonial?: string | null
          completion_time_hours?: number | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          developer_id?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          title: string
        }
        Update: {
          after_code?: string | null
          ai_tools_used?: string[] | null
          before_code?: string | null
          client_testimonial?: string | null
          completion_time_hours?: number | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          developer_id?: string | null
          github_url?: string | null
          id?: string
          image_url?: string | null
          project_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_pieces_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          ai_tools: string[] | null
          availability_status: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email: string
          experience_level: string | null
          first_name: string | null
          github_url: string | null
          goals: string[] | null
          hourly_rate: number | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          portfolio_url: string | null
          provider: string | null
          role: string
          skills: string[] | null
          success_rate: number | null
          total_earnings: number | null
          total_projects: number | null
          updated_at: string
        }
        Insert: {
          ai_tools?: string[] | null
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          experience_level?: string | null
          first_name?: string | null
          github_url?: string | null
          goals?: string[] | null
          hourly_rate?: number | null
          id: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          portfolio_url?: string | null
          provider?: string | null
          role: string
          skills?: string[] | null
          success_rate?: number | null
          total_earnings?: number | null
          total_projects?: number | null
          updated_at?: string
        }
        Update: {
          ai_tools?: string[] | null
          availability_status?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          experience_level?: string | null
          first_name?: string | null
          github_url?: string | null
          goals?: string[] | null
          hourly_rate?: number | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          portfolio_url?: string | null
          provider?: string | null
          role?: string
          skills?: string[] | null
          success_rate?: number | null
          total_earnings?: number | null
          total_projects?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          budget_max: number
          budget_min: number
          client_id: string | null
          created_at: string | null
          description: string
          duration_weeks: number
          experience_level: string
          id: string
          preferred_ai_tools: string[] | null
          project_type: string
          proposals_count: number | null
          required_ai_tools: string[] | null
          required_skills: string[]
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          budget_max: number
          budget_min: number
          client_id?: string | null
          created_at?: string | null
          description: string
          duration_weeks: number
          experience_level: string
          id?: string
          preferred_ai_tools?: string[] | null
          project_type: string
          proposals_count?: number | null
          required_ai_tools?: string[] | null
          required_skills: string[]
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          budget_max?: number
          budget_min?: number
          client_id?: string | null
          created_at?: string | null
          description?: string
          duration_weeks?: number
          experience_level?: string
          id?: string
          preferred_ai_tools?: string[] | null
          project_type?: string
          proposals_count?: number | null
          required_ai_tools?: string[] | null
          required_skills?: string[]
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      proposals: {
        Row: {
          ai_tools_to_use: string[] | null
          cover_letter: string
          created_at: string | null
          developer_id: string | null
          estimated_duration_weeks: number
          id: string
          project_id: string | null
          proposed_budget: number
          status: string | null
        }
        Insert: {
          ai_tools_to_use?: string[] | null
          cover_letter: string
          created_at?: string | null
          developer_id?: string | null
          estimated_duration_weeks: number
          id?: string
          project_id?: string | null
          proposed_budget: number
          status?: string | null
        }
        Update: {
          ai_tools_to_use?: string[] | null
          cover_letter?: string
          created_at?: string | null
          developer_id?: string | null
          estimated_duration_weeks?: number
          id?: string
          project_id?: string | null
          proposed_budget?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_developer_id_fkey"
            columns: ["developer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      seeker_profiles: {
        Row: {
          availability_status: string | null
          barred_from_regulated_work: boolean | null
          bio: string | null
          conviction_other_details: string | null
          conviction_status:
            | Database["public"]["Enums"]["conviction_status"]
            | null
          conviction_types:
            | Database["public"]["Enums"]["conviction_type"][]
            | null
          created_at: string | null
          current_legal_supervision:
            | Database["public"]["Enums"]["legal_supervision_type"]
            | null
          disability_other_details: string | null
          disability_types:
            | Database["public"]["Enums"]["disability_type"][]
            | null
          email: string | null
          first_name: string | null
          has_disability: boolean | null
          has_driving_licence: boolean | null
          headline: string | null
          id: string
          job_title: string | null
          key_skills: string[] | null
          last_name: string | null
          location_city: string | null
          location_country: string | null
          mappa_level: Database["public"]["Enums"]["mappa_level"] | null
          on_dbs_barring_list: boolean | null
          open_to_relocation: boolean | null
          phone_number: string | null
          preferred_employment_types: string[] | null
          preferred_job_categories: string[] | null
          profile_completion_percentage: number | null
          profile_image_url: string | null
          relevant_for_safeguarding_checks: boolean | null
          sentence_completed: boolean | null
          updated_at: string | null
          user_id: string
          work_preferences:
            | Database["public"]["Enums"]["work_preference"][]
            | null
          workplace_adjustments:
            | Database["public"]["Enums"]["workplace_adjustment"][]
            | null
          workplace_adjustments_other: string | null
        }
        Insert: {
          availability_status?: string | null
          barred_from_regulated_work?: boolean | null
          bio?: string | null
          conviction_other_details?: string | null
          conviction_status?:
            | Database["public"]["Enums"]["conviction_status"]
            | null
          conviction_types?:
            | Database["public"]["Enums"]["conviction_type"][]
            | null
          created_at?: string | null
          current_legal_supervision?:
            | Database["public"]["Enums"]["legal_supervision_type"]
            | null
          disability_other_details?: string | null
          disability_types?:
            | Database["public"]["Enums"]["disability_type"][]
            | null
          email?: string | null
          first_name?: string | null
          has_disability?: boolean | null
          has_driving_licence?: boolean | null
          headline?: string | null
          id?: string
          job_title?: string | null
          key_skills?: string[] | null
          last_name?: string | null
          location_city?: string | null
          location_country?: string | null
          mappa_level?: Database["public"]["Enums"]["mappa_level"] | null
          on_dbs_barring_list?: boolean | null
          open_to_relocation?: boolean | null
          phone_number?: string | null
          preferred_employment_types?: string[] | null
          preferred_job_categories?: string[] | null
          profile_completion_percentage?: number | null
          profile_image_url?: string | null
          relevant_for_safeguarding_checks?: boolean | null
          sentence_completed?: boolean | null
          updated_at?: string | null
          user_id: string
          work_preferences?:
            | Database["public"]["Enums"]["work_preference"][]
            | null
          workplace_adjustments?:
            | Database["public"]["Enums"]["workplace_adjustment"][]
            | null
          workplace_adjustments_other?: string | null
        }
        Update: {
          availability_status?: string | null
          barred_from_regulated_work?: boolean | null
          bio?: string | null
          conviction_other_details?: string | null
          conviction_status?:
            | Database["public"]["Enums"]["conviction_status"]
            | null
          conviction_types?:
            | Database["public"]["Enums"]["conviction_type"][]
            | null
          created_at?: string | null
          current_legal_supervision?:
            | Database["public"]["Enums"]["legal_supervision_type"]
            | null
          disability_other_details?: string | null
          disability_types?:
            | Database["public"]["Enums"]["disability_type"][]
            | null
          email?: string | null
          first_name?: string | null
          has_disability?: boolean | null
          has_driving_licence?: boolean | null
          headline?: string | null
          id?: string
          job_title?: string | null
          key_skills?: string[] | null
          last_name?: string | null
          location_city?: string | null
          location_country?: string | null
          mappa_level?: Database["public"]["Enums"]["mappa_level"] | null
          on_dbs_barring_list?: boolean | null
          open_to_relocation?: boolean | null
          phone_number?: string | null
          preferred_employment_types?: string[] | null
          preferred_job_categories?: string[] | null
          profile_completion_percentage?: number | null
          profile_image_url?: string | null
          relevant_for_safeguarding_checks?: boolean | null
          sentence_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
          work_preferences?:
            | Database["public"]["Enums"]["work_preference"][]
            | null
          workplace_adjustments?:
            | Database["public"]["Enums"]["workplace_adjustment"][]
            | null
          workplace_adjustments_other?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seeker_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      swipe_records: {
        Row: {
          context_job_id: string | null
          created_at: string | null
          hirer_company_id: string | null
          id: string
          swipe_type: string
          swiped_entity_id: string
          swiped_entity_type: string
          swiper_id: string
        }
        Insert: {
          context_job_id?: string | null
          created_at?: string | null
          hirer_company_id?: string | null
          id?: string
          swipe_type: string
          swiped_entity_id: string
          swiped_entity_type: string
          swiper_id: string
        }
        Update: {
          context_job_id?: string | null
          created_at?: string | null
          hirer_company_id?: string | null
          id?: string
          swipe_type?: string
          swiped_entity_id?: string
          swiped_entity_type?: string
          swiper_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "swipe_records_swiper_id_fkey"
            columns: ["swiper_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      conviction_status: "spent" | "unspent" | "pending"
      conviction_type:
        | "theft_burglary_robbery"
        | "fraud_financial"
        | "drug_possession"
        | "drug_supply_production"
        | "driving_offences"
        | "assault_violent"
        | "sexual_offences"
        | "public_order"
        | "domestic_abuse"
        | "terrorism_related"
        | "weapons_offences"
        | "harassment_stalking"
        | "arson"
        | "breach_court_orders"
        | "other"
      disability_type:
        | "mobility_physical"
        | "sensory_hearing_vision"
        | "long_term_medical"
        | "neurodivergence"
        | "learning_difficulty"
        | "mental_health"
        | "communication_needs"
        | "cognitive_memory"
        | "other"
        | "prefer_not_to_specify"
      legal_supervision_type:
        | "probation"
        | "parole"
        | "community_sentence"
        | "licence"
        | "mappa_oversight"
        | "none"
      mappa_level: "level_1" | "level_2" | "level_3" | "not_applicable"
      work_preference:
        | "full_time"
        | "part_time"
        | "zero_hours"
        | "weekends"
        | "nights"
      workplace_adjustment:
        | "flexible_hours"
        | "remote_work"
        | "training_support"
        | "assistive_technology"
        | "modified_environment"
        | "communication_support"
        | "none"
        | "other"
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
    Enums: {
      conviction_status: ["spent", "unspent", "pending"],
      conviction_type: [
        "theft_burglary_robbery",
        "fraud_financial",
        "drug_possession",
        "drug_supply_production",
        "driving_offences",
        "assault_violent",
        "sexual_offences",
        "public_order",
        "domestic_abuse",
        "terrorism_related",
        "weapons_offences",
        "harassment_stalking",
        "arson",
        "breach_court_orders",
        "other",
      ],
      disability_type: [
        "mobility_physical",
        "sensory_hearing_vision",
        "long_term_medical",
        "neurodivergence",
        "learning_difficulty",
        "mental_health",
        "communication_needs",
        "cognitive_memory",
        "other",
        "prefer_not_to_specify",
      ],
      legal_supervision_type: [
        "probation",
        "parole",
        "community_sentence",
        "licence",
        "mappa_oversight",
        "none",
      ],
      mappa_level: ["level_1", "level_2", "level_3", "not_applicable"],
      work_preference: [
        "full_time",
        "part_time",
        "zero_hours",
        "weekends",
        "nights",
      ],
      workplace_adjustment: [
        "flexible_hours",
        "remote_work",
        "training_support",
        "assistive_technology",
        "modified_environment",
        "communication_support",
        "none",
        "other",
      ],
    },
  },
} as const
