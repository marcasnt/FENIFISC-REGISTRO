import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data: athletes, error } = await supabase
      .from("athletes")
      .select(`
        *,
        athlete_categories (
          categories (
            name
          )
        ),
        registrations (
          competitions (
            name
          )
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform data to match frontend expectations
    const transformedAthletes =
      athletes?.map((athlete) => ({
        id: athlete.id,
        first_name: athlete.first_name,
        last_name: athlete.last_name,
        name: `${athlete.first_name} ${athlete.last_name}`,
        email: athlete.email,
        phone: athlete.phone,
        cedula: athlete.cedula,
        address: athlete.address,
        cedula_front_url: athlete.cedula_front_url,
        cedula_back_url: athlete.cedula_back_url,
        status: athlete.status,
        categories: athlete.athlete_categories?.map((ac: any) => ac.categories.name) || [],
        competitions: athlete.registrations?.map((r: any) => r.competitions.name) || [],
        created_at: athlete.created_at,
        updated_at: athlete.updated_at,
      })) || []

    return NextResponse.json({ athletes: transformedAthletes })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const cedula = formData.get("cedula") as string
    const address = formData.get("address") as string
    const selectedCategories = JSON.parse((formData.get("categories") as string) || "[]")
    const selectedCompetitions = JSON.parse((formData.get("competitions") as string) || "[]")

    const cedulaFront = formData.get("cedulaFront") as File | null
    const cedulaBack = formData.get("cedulaBack") as File | null

    // Insert athlete first
    const { data: athlete, error: athleteError } = await supabase
      .from("athletes")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        cedula,
        address,
        status: "pending",
      })
      .select()
      .single()

    if (athleteError) {
      return NextResponse.json({ error: athleteError.message }, { status: 400 })
    }

    let cedulaFrontUrl = null
    let cedulaBackUrl = null

    // Upload cedula front image if provided
    if (cedulaFront && cedulaFront.size > 0) {
      const frontFileName = `cedula-front-${athlete.id}-${Date.now()}.${cedulaFront.name.split(".").pop()}`
      const frontArrayBuffer = await cedulaFront.arrayBuffer()

      const { data: frontUpload, error: frontUploadError } = await supabase.storage
        .from("athlete-documents")
        .upload(frontFileName, frontArrayBuffer, {
          contentType: cedulaFront.type,
        })

      if (frontUploadError) {
        console.error("Error uploading front cedula:", frontUploadError)
      } else {
        const { data: frontUrl } = supabase.storage.from("athlete-documents").getPublicUrl(frontFileName)
        cedulaFrontUrl = frontUrl.publicUrl
      }
    }

    // Upload cedula back image if provided
    if (cedulaBack && cedulaBack.size > 0) {
      const backFileName = `cedula-back-${athlete.id}-${Date.now()}.${cedulaBack.name.split(".").pop()}`
      const backArrayBuffer = await cedulaBack.arrayBuffer()

      const { data: backUpload, error: backUploadError } = await supabase.storage
        .from("athlete-documents")
        .upload(backFileName, backArrayBuffer, {
          contentType: cedulaBack.type,
        })

      if (backUploadError) {
        console.error("Error uploading back cedula:", backUploadError)
      } else {
        const { data: backUrl } = supabase.storage.from("athlete-documents").getPublicUrl(backFileName)
        cedulaBackUrl = backUrl.publicUrl
      }
    }

    // Update athlete with image URLs if they were uploaded
    if (cedulaFrontUrl || cedulaBackUrl) {
      const updateData: any = {}
      if (cedulaFrontUrl) updateData.cedula_front_url = cedulaFrontUrl
      if (cedulaBackUrl) updateData.cedula_back_url = cedulaBackUrl

      await supabase.from("athletes").update(updateData).eq("id", athlete.id)
    }

    // Insert athlete categories
    if (selectedCategories.length > 0) {
      // First, get or create categories
      const categoryInserts = []
      for (const categoryName of selectedCategories) {
        // Try to find existing category
        let { data: existingCategory } = await supabase
          .from("categories")
          .select("id")
          .eq("name", categoryName)
          .single()

        if (!existingCategory) {
          // Create new category if it doesn't exist
          const { data: newCategory } = await supabase
            .from("categories")
            .insert({
              name: categoryName,
              description: `Categoría ${categoryName}`,
              gender:
                categoryName.includes("Women") ||
                categoryName.includes("Bikini") ||
                categoryName.includes("Body Fitness") ||
                categoryName.includes("Wellness")
                  ? "female"
                  : "male",
            })
            .select("id")
            .single()

          if (newCategory) {
            existingCategory = newCategory
          }
        }

        if (existingCategory) {
          categoryInserts.push({
            athlete_id: athlete.id,
            category_id: existingCategory.id,
          })
        }
      }

      if (categoryInserts.length > 0) {
        await supabase.from("athlete_categories").insert(categoryInserts)
      }
    }

    // Insert registrations
    if (selectedCompetitions.length > 0) {
      const registrations = selectedCompetitions.map((competitionId: string) => ({
        athlete_id: athlete.id,
        competition_id: competitionId,
        status: "registered",
      }))

      await supabase.from("registrations").insert(registrations)
    }

    return NextResponse.json({
      message: "Athlete registered successfully",
      athlete,
    })
  } catch (error) {
    console.error("Error in POST /api/athletes:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
