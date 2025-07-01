import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { first_name, last_name, email, cedula, categories, created_at } = await req.json()
    if (!first_name || !last_name || !email || !cedula) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    const subject = "Nuevo atleta inscrito en FENIFISC"
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
        <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 24px;">
          <div style="text-align: center; margin-bottom: 16px;">
            <img src='https://fenifisc.com/wp-content/uploads/2024/12/FENIFISC-OFICIAL.webp' alt='FENIFISC Logo' width='80' style='margin-bottom: 8px;' />
            <h2 style="color: #1e3a8a; margin: 0;">Nuevo atleta inscrito</h2>
          </div>
          <p style="font-size: 16px; color: #222;">Se ha registrado un nuevo atleta en FENIFISC:</p>
          <ul style="font-size: 15px; color: #222;">
            <li><b>Nombre:</b> ${first_name} ${last_name}</li>
            <li><b>Email:</b> ${email}</li>
            <li><b>Cédula:</b> ${cedula}</li>
            <li><b>Categorías:</b> ${(categories || []).join(", ")}</li>
            <li><b>Fecha de registro:</b> ${created_at ? new Date(created_at).toLocaleString("es-NI") : ""}</li>
          </ul>
          <div style="margin: 24px 0; text-align: center;">
            <a href="https://fenifisc-registro.vercel.app/admin" style="background: #1e3a8a; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ir al Panel Admin</a>
          </div>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
          <footer style="font-size: 12px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} FENIFISC
          </footer>
        </div>
      </div>
    `

    const { error } = await resend.emails.send({
      from: "info@fenifisc.com",
      to: ["info@fenifisc.com", "marcasnt@gmail.com"],
      subject,
      html
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
} 