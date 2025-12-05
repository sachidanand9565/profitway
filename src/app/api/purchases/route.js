import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const purchases = await query(`
      SELECT id, name, email, phone, packageid, packagetitle, price, state, city, sponsorcode, referralcode, image, utr_no, status, created_at
      FROM checkout
      ORDER BY created_at DESC
    `);
    return NextResponse.json(purchases || []);
  } catch (err) {
    console.error("Failed to fetch purchases:", err);
    // If column doesn't exist, try without it
    if (err.code === 'ER_BAD_FIELD_ERROR' && err.sqlMessage.includes('packageid')) {
      try {
        const purchases = await query(`
          SELECT id, name, email, phone, packagetitle, price, state, city, sponsorcode, referralcode, image, utr_no, status, created_at
          FROM checkout
          ORDER BY created_at DESC
        `);
        return NextResponse.json(purchases || []);
      } catch (fallbackErr) {
        console.error("Fallback query also failed:", fallbackErr);
        return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
      }
    }
    return NextResponse.json({ error: "Failed to fetch purchases" }, { status: 500 });
  }
}

export async function POST(request) {
  const { getConnection } = await import("../../../lib/mysqlClient");
  let connection;
  try {
    const { id, action } = await request.json();

    if (!id || !action) {
      return NextResponse.json({ error: "Purchase ID and action required" }, { status: 400 });
    }

    if (action === 'approve') {
      // Get purchase details
      const purchases = await query("SELECT * FROM checkout WHERE id = ?", [id]);
      if (purchases.length === 0) {
        return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
      }
      const purchase = purchases[0];
      console.log("Purchase details:", purchase);
      console.log("Package ID:", purchase.packageid, "Type:", typeof purchase.packageid);

      // Get the actual package ID (handle if packageid is slug or ID)
      let packageId = purchase.packageid;
      if (typeof packageId === 'string' && packageId !== 'unknown') {
        // If it's a string (slug), fetch the numeric ID from packages table
        const packages = await query("SELECT id FROM packages WHERE id = ?", [packageId]);
        if (packages.length > 0) {
          packageId = packages[0].id;
        } else {
          console.warn("Package slug not found:", packageId);
          packageId = null;
        }
      } else if (packageId === 'unknown' || packageId === 0) {
        packageId = null;
      }

      // Start transaction
      connection = await getConnection();
      await connection.beginTransaction();

      // Update purchase status
      await connection.execute("UPDATE checkout SET status = 'approved' WHERE id = ?", [id]);

      // COMMISSION CALCULATION AND DISTRIBUTION
      // Get package details for commission calculation
      const packageDetails = await connection.execute("SELECT name, price FROM packages WHERE id = ?", [packageId]);
      if (packageDetails[0].length === 0) {
        throw new Error("Package not found for commission calculation");
      }
      const pkg = packageDetails[0][0];
      const packagePrice = parseFloat(pkg.price.replace(/[₹,]/g, ''));

      // Determine commission rates based on package type
      const isPremiumPackage = ['Royal Package', 'Crown Package'].includes(pkg.name);
      const activeCommissionRate = isPremiumPackage ? 0.75 : 0.70; // 75% for Royal/Crown, 70% for others
      const passiveCommissionRate = 0.10; // 10% for passive

      // Find the direct referrer (active income earner)
      let directReferrerId = null;
      if (purchase.sponsorcode) {
        const referrerResult = await connection.execute("SELECT id FROM users WHERE referral_code = ?", [purchase.sponsorcode]);
        if (referrerResult[0].length > 0) {
          directReferrerId = referrerResult[0][0].id;
        }
      }

      // Calculate and distribute commissions
      if (directReferrerId) {
        // Get referrer's maximum package price for commission adjustment
        const referrerPackageResult = await connection.execute(
          "SELECT MAX(CAST(REPLACE(REPLACE(p.price, '₹', ''), ',', '') AS DECIMAL(10,2))) as maxPrice FROM user_packages up JOIN packages p ON up.package_id = p.id WHERE up.user_id = ? AND up.approved_at IS NOT NULL",
          [directReferrerId]
        );
        const referrerMaxPrice = referrerPackageResult[0][0].maxPrice ? parseFloat(referrerPackageResult[0][0].maxPrice) : 0;

        // Adjust commission base: use referrer's price if purchased package is more expensive
        const commissionBase = packagePrice > referrerMaxPrice ? referrerMaxPrice : packagePrice;

        // Active commission for direct referrer
        const activeCommission = commissionBase * activeCommissionRate;

        // Insert active commission record
        await connection.execute(
          "INSERT INTO commissions (purchase_id, earner_user_id, referrer_user_id, package_name, package_price, commission_type, commission_percentage, commission_amount, status) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, 'credited')",
          [id, directReferrerId, directReferrerId, pkg.name, packagePrice, activeCommissionRate * 100, activeCommission]
        );

        // Update wallet for active commission
        await connection.execute(
          "UPDATE user_wallets SET balance = balance + ?, total_earned = total_earned + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
          [activeCommission, activeCommission, directReferrerId]
        );

        // Check for passive commission (referrer's referrer)
        const referrerDetails = await connection.execute("SELECT sponsor_code FROM users WHERE id = ?", [directReferrerId]);
        if (referrerDetails[0].length > 0 && referrerDetails[0][0].sponsor_code) {
          const grandReferrerResult = await connection.execute("SELECT id FROM users WHERE referral_code = ?", [referrerDetails[0][0].sponsor_code]);
          if (grandReferrerResult[0].length > 0) {
            const grandReferrerId = grandReferrerResult[0][0].id;

            // Passive commission for grand referrer
            const passiveCommission = commissionBase * passiveCommissionRate;

            // Insert passive commission record
            await connection.execute(
              "INSERT INTO commissions (purchase_id, earner_user_id, referrer_user_id, package_name, package_price, commission_type, commission_percentage, commission_amount, status) VALUES (?, ?, ?, ?, ?, 'passive', ?, ?, 'credited')",
              [id, grandReferrerId, directReferrerId, pkg.name, packagePrice, passiveCommissionRate * 100, passiveCommission]
            );

            // Update wallet for passive commission
            await connection.execute(
              "UPDATE user_wallets SET balance = balance + ?, total_earned = total_earned + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
              [passiveCommission, passiveCommission, grandReferrerId]
            );
          }
        }
      }

      // Check if user already exists
      const [existingUsersRows] = await connection.execute("SELECT id FROM users WHERE email = ?", [purchase.email]);
      let isNewUser = false;
      let username, password; // Define here to be accessible for email

      if (existingUsersRows.length > 0) {
        // User exists, add package to user_packages table
        const user = existingUsersRows[0];
        console.log("Existing user found:", user.id, "Package ID:", packageId);
        if (packageId) {
          const result = await connection.execute(
            "INSERT INTO user_packages (user_id, package_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE approved_at = CURRENT_TIMESTAMP",
            [user.id, packageId]
          );
          console.log("Inserted package for existing user, result:", result);
        } else {
          console.log("No packageId to insert for existing user");
        }
      } else {
        // Create new user account
        isNewUser = true;
        const initialPackages = packageId ? [packageId] : [];

        // SERVER-SIDE CREDENTIAL GENERATION
        username = purchase.email;
        password = purchase.password || Math.random().toString(36).slice(-8);
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Generate referral code: "PW" + 8 random alphanumeric characters
        const generateReferralCode = () => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          let result = 'PW';
          for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          return result;
        };

        let referralCode;
        let isUnique = false;
        let attempts = 0;
        const maxAttempts = 10;

        // Ensure referral code is unique
        while (!isUnique && attempts < maxAttempts) {
          referralCode = generateReferralCode();
          const [existingCodesRows] = await connection.execute("SELECT id FROM users WHERE referral_code = ?", [referralCode]);
          if (existingCodesRows.length === 0) {
            isUnique = true;
          }
          attempts++;
        }

        if (!isUnique) {
          throw new Error("Failed to generate unique referral code");
        }

        await connection.execute(
          "INSERT INTO users (username, password, email, name, phone, sponsor_code, referral_code, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [username, password, purchase.email, purchase.name, purchase.phone, purchase.sponsorcode || null, referralCode, purchase.created_at]
        );

        // Add initial package to user_packages table
        if (packageId) {
          const [userResult] = await connection.execute("SELECT LAST_INSERT_ID() as userId");
          const userId = userResult[0].userId;
          await connection.execute(
            "INSERT INTO user_packages (user_id, package_id) VALUES (?, ?)",
            [userId, packageId]
          );
        }
      }

      // Commit transaction
      await connection.commit();
      connection.release();
      connection = null;

      // Send email with credentials only for new users
      if (isNewUser) {
        try {
          const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Welcome to ProfitWay!</h2>
              <p>Your package purchase has been approved. Here are your login credentials:</p>
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Username:</strong> ${username}</p>
                <p><strong>Password:</strong> ${password}</p>
              </div>
              <p>You can now login at: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login">${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/login</a></p>
              <p>Please change your password after first login for security.</p>
              <br>
              <p>Best regards,<br>ProfitWay Team</p>
            </div>
          `;

          await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/api/email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: purchase.email,
              subject: 'Your ProfitWay Account Credentials',
              html: emailHtml
            })
          });
        } catch (emailErr) {
          console.error('Failed to send email:', emailErr);
          // Don't fail the approval if email fails
        }
      }

      return NextResponse.json({ message: isNewUser ? "Purchase approved and user account created" : "Purchase approved and user packages updated" });

    } else if (action === 'reject') {
      await query("UPDATE checkout SET status = 'rejected' WHERE id = ?", [id]);
      return NextResponse.json({ message: "Purchase rejected" });

    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

  } catch (err) {
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.error("Failed to process purchase action:", err);
    return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
  }
}
