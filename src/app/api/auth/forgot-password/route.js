export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { query } from "../../../../lib/mysqlClient";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body.email || "");
    //  return NextResponse.json({ success: true, message: email });
    if (!email) {
      return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });
    }

    // find user
    const users = await query("SELECT id, name FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      // Security: respond success but do not reveal existence
      return NextResponse.json({ success: true, message: "OTP sent if email exists" });
    }

    const user = users[0];
    
    const otp = generateOtp();
    const minutes = parseInt(process.env.OTP_EXP_MIN || "15", 10);
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);

    // store otp and expiry
    await query("UPDATE users SET otp = ?, otp_expires = ? WHERE id = ?", [otp, expiresAt, user.id]);

    // prepare transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });


    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for password reset",
      text: `Hello ${user.name || ""}\n\nYour OTP for password reset is: ${otp}\nIt expires in ${minutes} minutes.\n\nIf you didn't request this, ignore this email.`,
      html: `<p>Hello ${user.name || ""},</p>
             <p>Your OTP for password reset is: <strong>${otp}</strong></p>
             <p>It will expire in ${minutes} minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "OTP sent (if email exists)" });
  } catch (err) {
  console.error("[forgot-password] Error:", err);
  return NextResponse.json({
    success: false,
    error: err.message || "Failed to send OTP",
    detail: err,  // full raw error
  }, { status: 500 });
}
}
