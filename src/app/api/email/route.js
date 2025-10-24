import { NextResponse } from "next/server";

// Simple email service - replace with your preferred email service (SendGrid, Mailgun, etc.)
export async function POST(request) {
  try {
    const { to, subject, html } = await request.json();

    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields: to, subject, html" }, { status: 400 });
    }

    // For now, just log the email (replace with actual email service)
    console.log("📧 Email to be sent:");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${html}`);

    // TODO: Integrate with email service like:
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.sendMail({ from, to, subject, html });

    return NextResponse.json({ message: "Email logged successfully (integrate with email service)" });
  } catch (err) {
    console.error("Email error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
