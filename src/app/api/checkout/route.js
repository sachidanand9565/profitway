import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";
import { put } from "@vercel/blob";

// Force Node.js runtime instead of Edge
export const runtime = 'nodejs';

function generateReferralCode() {
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
    const requiredFields = ["name", "email", "phone", "packageId", "packageTitle", "price", "password"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    // Validate payment details
    if (!data.paymentScreenshot) {
      return NextResponse.json({ error: "Payment screenshot is required" }, { status: 400 });
    }

    if (!data.utrNumber || data.utrNumber.trim() === "") {
      return NextResponse.json({ error: "UTR number is required" }, { status: 400 });
    }

    // Generate unique referral code
    const referralCode = generateReferralCode();

    // Handle image upload
    let imagePath = null;
    if (data.paymentScreenshot) {
      try {
        // Validate base64 format
        if (!data.paymentScreenshot.startsWith('data:image/')) {
          throw new Error('Invalid image format');
        }

        // Extract mime type and base64 data
        const [mimePart, base64Data] = data.paymentScreenshot.split(',');
        const mimeType = mimePart.split(':')[1].split(';')[0]; // e.g., image/jpeg
        if (!base64Data) {
          throw new Error('Invalid base64 data');
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(base64Data, 'base64');

        // Validate file size (max 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
          return NextResponse.json({
            error: "Compressed image is still too large. Please select a smaller image."
          }, { status: 400 });
        }

        // Create unique filename with correct extension
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substr(2, 9);
        const extension = mimeType.split('/')[1]; // e.g., jpeg, png
        const filename = `payment_${timestamp}_${randomStr}.${extension}`;

        // Upload to Vercel Blob
        const blob = await put(filename, buffer, {
          access: 'public',
          contentType: mimeType,
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        imagePath = blob.url;

      } catch (imageError) {
        console.error("Image upload error:", imageError);
        console.error("Error details:", JSON.stringify(imageError, null, 2));
        return NextResponse.json({
          error: "Failed to upload payment screenshot",
          details: imageError.message || 'Unknown error'
        }, { status: 400 });
      }
    }

    // Insert into database
    const sql = `
      INSERT INTO checkout
      (name, email, phone, address, msg, packageid, packagetitle, price, state, city, sponsorcode, referralcode, image, utr_no, password, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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
      imagePath,
      data.utrNumber,
      data.password,
    ];

    const result = await query(sql, params);

    return NextResponse.json({ 
      success: true,
      message: "Order saved successfully", 
      referralCode,
      orderId: result.insertId
    }, { status: 200 });

  } catch (err) {
    console.error("Error saving order:", err);
    
    // Better error messages
    let errorMessage = "Failed to save order";
    if (err.code === 'ER_DUP_ENTRY') {
      errorMessage = "This email or phone number is already registered";
    } else if (err.code === 'ECONNREFUSED') {
      errorMessage = "Database connection failed";
    }
    
    return NextResponse.json({ 
      error: errorMessage, 
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    }, { status: 500 });
  }
}