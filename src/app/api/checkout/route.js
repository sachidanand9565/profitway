import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

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

        // Extract base64 data
        const base64Data = data.paymentScreenshot.split(',')[1];
        if (!base64Data) {
          throw new Error('Invalid base64 data');
        }

        // Create unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substr(2, 9);
        const filename = `payment_${timestamp}_${randomStr}.jpg`;
        
        // Setup paths
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'payments');
        const filePath = path.join(uploadDir, filename);

        // Ensure directory exists
        try {
          await mkdir(uploadDir, { recursive: true });
        } catch (err) {
          if (err.code !== 'EEXIST') throw err;
        }

        // Convert base64 to buffer and save
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Validate file size (max 5MB for the final saved file)
        if (buffer.length > 5 * 1024 * 1024) {
          return NextResponse.json({ 
            error: "Compressed image is still too large. Please select a smaller image." 
          }, { status: 400 });
        }

        await writeFile(filePath, buffer);
        imagePath = `/uploads/payments/${filename}`;

      } catch (imageError) {
        console.error("Image upload error:", imageError);
        return NextResponse.json({ 
          error: "Failed to upload payment screenshot", 
          details: imageError.message 
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