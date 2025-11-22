import { NextResponse } from "next/server";
import { Resend } from 'resend';

// Initialize Resend with API key only if available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(request) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return NextResponse.json({ error: "Missing required fields: to, subject, and html or text" }, { status: 400 });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'ProfitWay <noreply@yourdomain.com>', // Use your verified domain
      to: [to],
      subject: subject,
      html: html,
      text: text,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    console.log('📧 Email sent successfully:', data?.id);

    return NextResponse.json({
      message: "Email sent successfully",
      messageId: data?.id
    });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
