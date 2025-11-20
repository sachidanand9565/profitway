import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";

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
    console.log('[checkout-api] POST received');
    const data = await request.json();
    console.log('[checkout-api] Data received:', { email: data.email, name: data.name });

    // Validate required fields
    const requiredFields = ["name", "email", "phone", "packageId", "packageTitle", "price", "password"];
    for (const field of requiredFields) {
      if (!data[field]) {
        console.log('[checkout-api] Missing field:', field);
        return NextResponse.json({ 
          success: false,
          error: `${field} is required` 
        }, { status: 400 });
      }
    }

    // Validate payment details
    if (!data.paymentScreenshot) {
      console.log('[checkout-api] Missing payment screenshot');
      return NextResponse.json({ 
        success: false,
        error: "कृपया payment screenshot upload करें" 
      }, { status: 400 });
    }

    if (!data.utrNumber || data.utrNumber.trim() === "") {
      console.log('[checkout-api] Missing UTR number');
      return NextResponse.json({ 
        success: false,
        error: "कृपया UTR number enter करें" 
      }, { status: 400 });
    }

    // Validate base64 image format (same as admin panel)
    if (!data.paymentScreenshot.startsWith('data:image/')) {
      console.log('[checkout-api] Invalid image format');
      return NextResponse.json({ 
        success: false,
        error: "Invalid image format. Please upload a valid image." 
      }, { status: 400 });
    }

    // Check if email already exists in users table
    console.log('[checkout-api] Checking if email exists');
    const existingUser = await query('SELECT id FROM users WHERE email = ?', [data.email]);
    if (existingUser.length > 0) {
      console.log('[checkout-api] Email already exists');
      return NextResponse.json({ 
        success: false,
        error: "यह email पहले से registered है। कृपया दूसरा email use करें।" 
      }, { status: 400 });
    }

    // Generate unique referral code
    const referralCode = generateReferralCode();
    console.log('[checkout-api] Generated referral code:', referralCode);

    // Store base64 image directly in database (same as admin panel approach)
    // This works perfectly on Vercel without file system operations
    const imagePath = data.paymentScreenshot;
    console.log('[checkout-api] Storing base64 image in database');

    // 1. Insert into users table (for login)
    console.log('[checkout-api] Creating user');
    const userSql = `
      INSERT INTO users 
      (username, name, email, phone, password, referral_code, state, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const userParams = [
      data.email.split('@')[0], // username from email
      data.name,
      data.email,
      data.phone,
      data.password,
      referralCode,
      data.state || null
    ];

    const userResult = await query(userSql, userParams);
    const userId = userResult.insertId;
    console.log('[checkout-api] User created with ID:', userId);

    // 2. Insert into checkout table
    console.log('[checkout-api] Creating checkout entry');
    const checkoutSql = `
      INSERT INTO checkout
      (name, email, phone, address, msg, packageid, packagetitle, price, state, city, sponsorcode, referralcode, image, utr_no, password, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    
    const checkoutParams = [
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
      imagePath, // Base64 image stored directly in DB
      data.utrNumber,
      data.password,
    ];

    await query(checkoutSql, checkoutParams);
    console.log('[checkout-api] Checkout entry created successfully');

    return NextResponse.json({ 
      success: true,
      message: "आपका order successfully submit हो गया है!", 
      referralCode,
      userId
    }, { status: 200 });

  } catch (err) {
    console.error('[checkout-api] Error:', err);
    console.error('[checkout-api] Error stack:', err.stack);
    
    // Better error messages
    let errorMessage = "Order submit करने में error हुआ";
    
    if (err.code === 'ER_DUP_ENTRY') {
      errorMessage = "यह email या phone number पहले से registered है";
    } else if (err.code === 'ECONNREFUSED') {
      errorMessage = "Database connection failed";
    } else if (err.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = "Database table नहीं मिली";
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined 
    }, { status: 500 });
  }
}


