import { NextResponse } from "next/server"
import { Resend } from "resend"

console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)


export async function POST(req: Request) {
  try {
    const { email, name, status } = await req.json()
    if (!email || !name || !status) {
      return NextResponse.json({ error: "Faltan datos" }, { status: 400 })
    }

    let subject = ""
    let html = ""
    if (status === "approved") {
      subject = "¡Fuiste aprobado como atleta en FENIFISC!"
      html = `<h2>¡Hola, ${name}!</h2><p>Tu registro como atleta ha sido <b>aprobado</b> en el sistema FENIFISC.</p><p>Ya puedes participar en las competencias y gestionar tu información.</p><br><p>¡Bienvenido a la Federación Nicaragüense de Físico Culturismo!</p>`
    } else if (status === "rejected") {
      subject = "Tu registro como atleta en FENIFISC ha sido rechazado"
      html = `<h2>Hola, ${name}</h2><p>Lamentamos informarte que tu registro como atleta en FENIFISC ha sido <b>rechazado</b>.</p><p>Si tienes dudas o deseas más información, puedes contactarnos a <a href='mailto:info@fenifisc.com'>info@fenifisc.com</a>.</p><br><p>Saludos,<br>Federación Nicaragüense de Físico Culturismo</p>`
    } else {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: "info@fenifisc.com",
      to: email,
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