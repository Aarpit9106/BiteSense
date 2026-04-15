export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          goal: string | null
          diet: string | null
          preferences: string[] | null
          age: number | null
          gender: string | null
          weight: number | null
          height: number | null
          activity_level: string | null
          created_at: string
          updated_at: string
        }
        Insert: Record<string, never>
        Update: Record<string, never>
      }
      scans: {
        Row: {
          id: string
          user_id: string
          restaurant_name: string | null
          menu_image_url: string | null
          extracted_text: string | null
          restaurant_health_score: number | null
          created_at: string
        }
      }
      recommendations: {
        Row: {
          id: string
          scan_id: string
          dish_name: string
          category: string | null
          reasoning: string | null
          estimated_calories: number | null
          protein_g: number | null
          carbs_g: number | null
          fat_g: number | null
          confidence_score: number | null
          created_at: string
        }
      }
    }
  }
}
