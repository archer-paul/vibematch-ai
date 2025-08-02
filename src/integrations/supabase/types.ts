export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_data: Json | null
          achievement_type: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_data?: Json | null
          achievement_type: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_data?: Json | null
          achievement_type?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ai_analysis: {
        Row: {
          analysis_data: Json
          analysis_type: string
          cerebras_score: number | null
          created_at: string
          id: string
          profile_id: string
        }
        Insert: {
          analysis_data?: Json
          analysis_type?: string
          cerebras_score?: number | null
          created_at?: string
          id?: string
          profile_id: string
        }
        Update: {
          analysis_data?: Json
          analysis_type?: string
          cerebras_score?: number | null
          created_at?: string
          id?: string
          profile_id?: string
        }
        Relationships: []
      }
      campaign_analytics: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          metric_data: Json | null
          metric_name: string
          metric_value: number | null
          recorded_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_name: string
          metric_value?: number | null
          recorded_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          metric_data?: Json | null
          metric_name?: string
          metric_value?: number | null
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_creators: {
        Row: {
          campaign_id: string
          created_at: string
          creator_id: string
          deliverables: Json | null
          id: string
          rate_agreed: number | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          creator_id: string
          deliverables?: Json | null
          id?: string
          rate_agreed?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          creator_id?: string
          deliverables?: Json | null
          id?: string
          rate_agreed?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget_remaining: number | null
          budget_total: number | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          kpis: Json | null
          name: string
          objectives: Json | null
          requirements: Json | null
          sponsor_id: string
          start_date: string | null
          status: string
          target_audience: Json | null
          updated_at: string
        }
        Insert: {
          budget_remaining?: number | null
          budget_total?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          kpis?: Json | null
          name: string
          objectives?: Json | null
          requirements?: Json | null
          sponsor_id: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Update: {
          budget_remaining?: number | null
          budget_total?: number | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          kpis?: Json | null
          name?: string
          objectives?: Json | null
          requirements?: Json | null
          sponsor_id?: string
          start_date?: string | null
          status?: string
          target_audience?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          creator_id: string | null
          id: string
          sponsor_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id?: string | null
          id?: string
          sponsor_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string | null
          id?: string
          sponsor_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      creator_analytics: {
        Row: {
          audience_demographics: Json | null
          created_at: string
          creator_id: string
          engagement_data: Json | null
          id: string
          metrics: Json
          platform: string
          recorded_at: string
        }
        Insert: {
          audience_demographics?: Json | null
          created_at?: string
          creator_id: string
          engagement_data?: Json | null
          id?: string
          metrics?: Json
          platform: string
          recorded_at?: string
        }
        Update: {
          audience_demographics?: Json | null
          created_at?: string
          creator_id?: string
          engagement_data?: Json | null
          id?: string
          metrics?: Json
          platform?: string
          recorded_at?: string
        }
        Relationships: []
      }
      ghost_profiles: {
        Row: {
          compatibility_scores: Json | null
          created_at: string
          discovered_data: Json
          id: string
          invited_at: string | null
          invited_by: string | null
          status: string | null
        }
        Insert: {
          compatibility_scores?: Json | null
          created_at?: string
          discovered_data?: Json
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          status?: string | null
        }
        Update: {
          compatibility_scores?: Json | null
          created_at?: string
          discovered_data?: Json
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          status?: string | null
        }
        Relationships: []
      }
      matchings: {
        Row: {
          compatibility_score: number
          created_at: string
          creator_id: string
          id: string
          match_factors: Json | null
          sponsor_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          compatibility_score: number
          created_at?: string
          creator_id: string
          id?: string
          match_factors?: Json | null
          sponsor_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          compatibility_score?: number
          created_at?: string
          creator_id?: string
          id?: string
          match_factors?: Json | null
          sponsor_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          message_type: string | null
          read_at: string | null
          sender_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability_hours: string | null
          avatar_url: string | null
          avoided_sectors: string[] | null
          bio: string | null
          budget_range: string | null
          campaign_objectives: string[] | null
          collaboration_types: string[] | null
          company_name: string | null
          content_categories: string[] | null
          content_examples: string[] | null
          content_styles: string[] | null
          created_at: string
          display_name: string | null
          email: string
          engagement_rate: number | null
          follower_counts: Json | null
          full_name: string
          geographic_scope: string | null
          id: string
          industry: string | null
          is_admin: boolean | null
          location: Json | null
          niches: string[] | null
          onboarding_completed: boolean | null
          preferred_sectors: string[] | null
          professional_level: number | null
          rate_range: Json | null
          social_handles: Json | null
          social_platforms: Json | null
          tagline: string | null
          updated_at: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          availability_hours?: string | null
          avatar_url?: string | null
          avoided_sectors?: string[] | null
          bio?: string | null
          budget_range?: string | null
          campaign_objectives?: string[] | null
          collaboration_types?: string[] | null
          company_name?: string | null
          content_categories?: string[] | null
          content_examples?: string[] | null
          content_styles?: string[] | null
          created_at?: string
          display_name?: string | null
          email: string
          engagement_rate?: number | null
          follower_counts?: Json | null
          full_name: string
          geographic_scope?: string | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          location?: Json | null
          niches?: string[] | null
          onboarding_completed?: boolean | null
          preferred_sectors?: string[] | null
          professional_level?: number | null
          rate_range?: Json | null
          social_handles?: Json | null
          social_platforms?: Json | null
          tagline?: string | null
          updated_at?: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          availability_hours?: string | null
          avatar_url?: string | null
          avoided_sectors?: string[] | null
          bio?: string | null
          budget_range?: string | null
          campaign_objectives?: string[] | null
          collaboration_types?: string[] | null
          company_name?: string | null
          content_categories?: string[] | null
          content_examples?: string[] | null
          content_styles?: string[] | null
          created_at?: string
          display_name?: string | null
          email?: string
          engagement_rate?: number | null
          follower_counts?: Json | null
          full_name?: string
          geographic_scope?: string | null
          id?: string
          industry?: string | null
          is_admin?: boolean | null
          location?: Json | null
          niches?: string[] | null
          onboarding_completed?: boolean | null
          preferred_sectors?: string[] | null
          professional_level?: number | null
          rate_range?: Json | null
          social_handles?: Json | null
          social_platforms?: Json | null
          tagline?: string | null
          updated_at?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type"]
        }
        Relationships: []
      }
      swipe_actions: {
        Row: {
          action: string
          created_at: string
          id: string
          target_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          target_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          target_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_quotas: {
        Row: {
          created_at: string
          id: string
          last_login: string | null
          matches_this_month: number | null
          streak_days: number | null
          super_likes_today: number | null
          super_likes_used_today: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_login?: string | null
          matches_this_month?: number | null
          streak_days?: number | null
          super_likes_today?: number | null
          super_likes_used_today?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_login?: string | null
          matches_this_month?: number | null
          streak_days?: number | null
          super_likes_today?: number | null
          super_likes_used_today?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_type: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_type: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_type?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_daily_quotas: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      user_type: "creator" | "sponsor"
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
      user_type: ["creator", "sponsor"],
    },
  },
} as const
