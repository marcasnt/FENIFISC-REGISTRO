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
      html = `
        <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 24px;">
            <div style="text-align: center; margin-bottom: 16px;">
              <img src='https://fenifisc-registro.vercel.app/images/fenifisc-logo.webp' alt='FENIFISC Logo' width='80' style='margin-bottom: 8px;' />
              <h2 style="color: #1e3a8a; margin: 0;">¡Hola, ${name}!</h2>
            </div>
            <p style="font-size: 16px; color: #222;">Tu registro como atleta ha sido <b style='color: #16a34a;'>aprobado</b> en el sistema FENIFISC.</p>
            <p style="font-size: 15px; color: #222;">Ya puedes participar en las competencias y gestionar tu información.</p>
            <div style="margin: 24px 0; text-align: center;">
              <a href="https://fenifisc.com" style="background: #1e3a8a; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Ir a FENIFISC</a>
            </div>
            <p style="font-size: 14px; color: #555;">¡Bienvenido a la Federación Nicaragüense de Físico Culturismo!</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
            <footer style="font-size: 12px; color: #888; text-align: center;">
              Si tienes dudas, contáctanos a <a href='mailto:info@fenifisc.com'>info@fenifisc.com</a>.<br />
              © ${new Date().getFullYear()} FENIFISC
            </footer>
          </div>
        </div>
      `
    } else if (status === "rejected") {
      subject = "Tu registro como atleta en FENIFISC ha sido rechazado"
      html = `
        <div style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
          <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 24px;">
            <div style="text-align: center; margin-bottom: 16px;">
              <img src='https://fenifisc.com/images/fenifisc-logo.webp' alt='FENIFISC Logo' width='80' style='margin-bottom: 8px;' />
              <h2 style="color: #1e3a8a; margin: 0;">Hola, ${name}</h2>
            </div>
            <p style="font-size: 16px; color: #222;">Lamentamos informarte que tu registro como atleta en FENIFISC ha sido <b style='color: #dc2626;'>rechazado</b>.</p>
            <p style="font-size: 15px; color: #222;">Si tienes dudas o deseas más información, puedes contactarnos.</p>
            <div style="margin: 24px 0; text-align: center;">
              <a href="mailto:info@fenifisc.com" style="background: #dc2626; color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Contactar a FENIFISC</a>
            </div>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
            <footer style="font-size: 12px; color: #888; text-align: center;">
              Federación Nicaragüense de Físico Culturismo<br />
              <a href='mailto:info@fenifisc.com'>info@fenifisc.com</a><br />
              © ${new Date().getFullYear()} FENIFISC
            </footer>
          </div>
        </div>
      `
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