import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";

function generateReferralCode() {
  // Simple referral code generator: 8 alphanumeric characters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "packageId", "packageTitle", "price"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Generate unique referral code (simple approach, could be improved)
    const referralCode = generateReferralCode();

    // Insert into database
    const sql = `
      INSERT INTO checkout
      (name, email, phone, address, msg, packageid, packagetitle, price, state, city, sponsorcode, referralcode, image, utr_no, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [
      data.name,
      data.email,
      data.phone,
      data.address || null,
      data.message || null,
      data.packageId,
      data.packageTitle,
      data.price,
      data.state || null,
      data.city || null,
      data.sponsorCode || null,
      referralCode,
      data.paymentScreenshot || null,
      data.utrNumber || null,
    ];

    await query(sql, params);

    return NextResponse.json({ message: "Order saved successfully", referralCode });
  } catch (err) {
    console.error("Error saving order:", err);
    return NextResponse.json({ error: "Failed to save order", details: err.message }, { status: 500 });
  }
}
