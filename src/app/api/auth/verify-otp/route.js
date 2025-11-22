export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "../../../../lib/mysqlClient";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const otp = (body.otp || "").trim();
    const newPassword = body.newPassword;

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ success: false, error: "email, otp and newPassword required" }, { status: 400 });
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const users = await query("SELECT id, otp, otp_expires FROM users WHERE email = ?", [email]);
    if (users.length === 0) {
      return NextResponse.json({ success: false, error: "Invalid OTP or email" }, { status: 400 });
    }

    const user = users[0];
    if (!user.otp || user.otp !== otp) {
      return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    }

    const now = new Date();
    const expires = new Date(user.otp_expires);
    if (!user.otp_expires || expires < now) {
      return NextResponse.json({ success: false, error: "OTP expired" }, { status: 400 });
    }

    // const hashed = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password = ?, otp = NULL, otp_expires = NULL WHERE id = ?", [newPassword, user.id]);

    return NextResponse.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("[verify-otp] Error:", err);
    return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 });
  }
}