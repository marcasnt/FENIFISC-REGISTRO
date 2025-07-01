import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    const { data: competition, error } = await supabase
      .from("competitions")
      .select(`
        *,
        registrations (
          id,
          athlete_id,
          status,
          athletes (
            id,
            first_name,
            last_name,
            email,
            status,
            cedula,
            categories:athlete_categories (
              categories (
                name
              )
            )
          )
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Transform data
    const competitionWithDetails = {
      ...competition,
      registrations_count: competition.registrations?.length || 0,
      registered_athletes: competition.registrations?.map((r: any) => ({
        id: r.athletes?.id,
        first_name: r.athletes?.first_name,
        last_name: r.athletes?.last_name,
        email: r.athletes?.email,
        status: r.athletes?.status,
        cedula: r.athletes?.cedula,
        categories: r.athletes?.categories?.map((c: any) => c.categories.name) || [],
        registration_status: r.status,
        registration_id: r.id,
        athlete_id: r.athlete_id,
      })) || [],
    }

    return NextResponse.json({ competition: competitionWithDetails })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    const body = await request.json()
    const { name, description, date, location, registration_deadline, max_registrations } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Add fields that are provided
    if (name) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (date) updateData.date = date
    if (location) updateData.location = location
    if (registration_deadline) updateData.registration_deadline = registration_deadline
    if (max_registrations) updateData.max_registrations = max_registrations

    const { data: competition, error } = await supabase
      .from("competitions")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Competition updated successfully",
      competition,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    // Delete related registrations first
    await supabase.from("registrations").delete().eq("competition_id", params.id)

    // Then delete the competition
    const { error } = await supabase.from("competitions").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Competition deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
