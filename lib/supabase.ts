import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Athlete {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  cedula: string
  address?: string
  cedula_front_url?: string
  cedula_back_url?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
}

export interface Competition {
  id: string
  name: string
  description?: string
  date: string
  location: string
  registration_deadline: string
  max_registrations: number
  status: "active" | "inactive" | "completed"
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description?: string
  gender: "male" | "female" | "both"
  created_at: string
}

export interface Registration {
  id: string
  athlete_id: string
  competition_id: string
  status: "registered" | "confirmed" | "cancelled"
  registration_date: string
  notes?: string
}
