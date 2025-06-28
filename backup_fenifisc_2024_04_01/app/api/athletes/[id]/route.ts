import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data: athlete, error } = await supabase
      .from("athletes")
      .select(`
        *,
        athlete_categories (
          categories (
            id,
            name
          )
        ),
        registrations (
          competitions (
            id,
            name,
            date
          )
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    // Transform data
    const athleteWithDetails = {
      ...athlete,
      categories: athlete.athlete_categories?.map((ac: any) => ac.categories.name) || [],
      competitions: athlete.registrations?.map((r: any) => r.competitions) || [],
    }

    return NextResponse.json({ athlete: athleteWithDetails })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, firstName, lastName, email, phone, cedula, address } = body

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // Add fields that are provided
    if (status) updateData.status = status
    if (firstName) updateData.first_name = firstName
    if (lastName) updateData.last_name = lastName
    if (email) updateData.email = email
    if (phone) updateData.phone = phone
    if (cedula) updateData.cedula = cedula
    if (address) updateData.address = address

    const { data: athlete, error } = await supabase
      .from("athletes")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Athlete updated successfully",
      athlete,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get athlete data first to delete associated files
    const { data: athlete } = await supabase
      .from("athletes")
      .select("cedula_front_url, cedula_back_url")
      .eq("id", params.id)
      .single()

    // Delete files from storage if they exist
    if (athlete?.cedula_front_url) {
      const frontFileName = athlete.cedula_front_url.split("/").pop()
      if (frontFileName) {
        await supabase.storage.from("athlete-documents").remove([frontFileName])
      }
    }

    if (athlete?.cedula_back_url) {
      const backFileName = athlete.cedula_back_url.split("/").pop()
      if (backFileName) {
        await supabase.storage.from("athlete-documents").remove([backFileName])
      }
    }

    // Delete related records first
    await supabase.from("athlete_categories").delete().eq("athlete_id", params.id)
    await supabase.from("registrations").delete().eq("athlete_id", params.id)

    // Then delete the athlete
    const { error } = await supabase.from("athletes").delete().eq("id", params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({
      message: "Athlete deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
