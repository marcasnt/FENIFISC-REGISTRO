import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: competitions, error } = await supabase
      .from("competitions")
      .select(`
        *,
        registrations (
          id
        )
      `)
      .order("date", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data to include registration count
    const transformedCompetitions =
      competitions?.map((competition) => ({
        ...competition,
        registrations_count: competition.registrations?.length || 0,
      })) || []

    return NextResponse.json({ competitions: transformedCompetitions })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, date, location, registration_deadline, max_registrations } = body

    const { data: competition, error } = await supabase
      .from("competitions")
      .insert({
        name,
        description,
        date,
        location,
        registration_deadline,
        max_registrations,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Competition created successfully",
      competition,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
