import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    const { data: athlete, error } = await supabaseAdmin
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

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    const body = await request.json();
    console.log('PUT /api/athletes/[id] BODY:', body);
    const { status, firstName, lastName, email, phone, cedula, address } = body;

    if (!status && !firstName && !lastName && !email && !phone && !cedula && !address) {
      return NextResponse.json({ error: "No se proporcionaron campos para actualizar" }, { status: 400 });
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Add fields that are provided
    if (status) updateData.status = status;
    if (firstName) updateData.first_name = firstName;
    if (lastName) updateData.last_name = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (cedula) updateData.cedula = cedula;
    if (address) updateData.address = address;

    const { data, error } = await supabaseAdmin
      .from("athletes")
      .update(updateData)
      .eq("id", params.id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "No se encontró el atleta para actualizar" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Athlete updated successfully",
      athlete: data[0],
    });
  } catch (error) {
    console.error('PUT /api/athletes/[id] ERROR:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  const params = await context.params;
  try {
    // Get athlete data first to delete associated files
    const { data: athlete } = await supabaseAdmin
      .from("athletes")
      .select("cedula_front_url, cedula_back_url")
      .eq("id", params.id)
      .single()

    // Delete files from storage if they exist
    if (athlete?.cedula_front_url) {
      const frontFileName = athlete.cedula_front_url.split("/").pop()
      if (frontFileName) {
        await supabaseAdmin.storage.from("athlete-documents").remove([frontFileName])
      }
    }

    if (athlete?.cedula_back_url) {
      const backFileName = athlete.cedula_back_url.split("/").pop()
      if (backFileName) {
        await supabaseAdmin.storage.from("athlete-documents").remove([backFileName])
      }
    }

    // Delete related records first
    await supabaseAdmin.from("athlete_categories").delete().eq("athlete_id", params.id)
    await supabaseAdmin.from("registrations").delete().eq("athlete_id", params.id)

    // Then delete the athlete
    const { error } = await supabaseAdmin.from("athletes").delete().eq("id", params.id)

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
