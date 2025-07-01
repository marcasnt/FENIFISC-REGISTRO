import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Buscar admin por email
    const { data: admin, error } = await supabase
      .from("admins")
      .select("id, email, password_hash")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    // Comparar password
    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
    }

    // Aquí deberías generar un JWT/cookie de sesión, pero por ahora solo responde OK
    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email } });
  } catch (e) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
} 