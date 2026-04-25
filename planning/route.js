import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, topic, message } = body;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate required fields on the server
    if (!name || typeof name !== "string" || !name.trim()) {
      return new Response(
        JSON.stringify({ error: "Name is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!email || typeof email !== "string" || !emailPattern.test(email)) {
      return new Response(
        JSON.stringify({ error: "Valid email is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return new Response(
        JSON.stringify({ error: "Topic is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return new Response(
        JSON.stringify({ error: "Message is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Configure SMTP transporter with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== "false",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.FROM_NAME || "Website Contact"}" <${process.env.FROM_EMAIL}>`,
      to: process.env.SUPPORT_TO,
      subject: `New contact form submission: ${topic.trim()} from ${name.trim()} <${email.trim()}>`,
      replyTo: email.trim(),
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\nTopic: ${topic.trim()}\n\nMessage:\n${message.trim()}`,
      html: `<p><strong>Name:</strong> ${name.trim()}</p>
             <p><strong>Email:</strong> ${email.trim()}</p>
             <p><strong>Topic:</strong> ${topic.trim()}</p>
             <p><strong>Message:</strong></p>
             <p>${message.trim().replace(/\n/g, "<br>")}</p>`,
    });

    return new Response(
      JSON.stringify({ ok: true, message: "Email sent" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
