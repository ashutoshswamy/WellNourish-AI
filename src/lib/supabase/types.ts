export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          age: number;
          gender: "male" | "female" | "other" | "prefer_not_to_say";
          height_cm: number;
          height_ft: number | null;
          height_inches: number | null;
          weight_kg: number;
          weight_lbs: number | null;
          activity_level:
            | "sedentary"
            | "lightlyActive"
            | "moderatelyActive"
            | "veryActive"
            | "extraActive";
          dietary_preferences: string[] | null;
          preferred_cuisine: string[] | null;
          allergies: string[] | null;
          goal: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          age: number;
          gender: "male" | "female" | "other" | "prefer_not_to_say";
          height_cm: number;
          height_ft?: number | null;
          height_inches?: number | null;
          weight_kg: number;
          weight_lbs?: number | null;
          activity_level:
            | "sedentary"
            | "lightlyActive"
            | "moderatelyActive"
            | "veryActive"
            | "extraActive";
          dietary_preferences?: string[] | null;
          preferred_cuisine?: string[] | null;
          allergies?: string[] | null;
          goal: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          age?: number;
          gender?: "male" | "female" | "other" | "prefer_not_to_say";
          height_cm?: number;
          height_ft?: number | null;
          height_inches?: number | null;
          weight_kg?: number;
          weight_lbs?: number | null;
          activity_level?:
            | "sedentary"
            | "lightlyActive"
            | "moderatelyActive"
            | "veryActive"
            | "extraActive";
          dietary_preferences?: string[] | null;
          preferred_cuisine?: string[] | null;
          allergies?: string[] | null;
          goal?: string;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          created_at: string;
          user_id: string;
          profile_id: string;
          diet_plan: string;
          workout_regimen: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          user_id: string;
          profile_id: string;
          diet_plan: string;
          workout_regimen: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          user_id?: string;
          profile_id?: string;
          diet_plan?: string;
          workout_regimen?: string;
          title?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
