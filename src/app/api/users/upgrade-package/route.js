import { NextResponse } from "next/server";
import { query } from "../../../../lib/mysqlClient";

export async function POST(request) {
  try {
    const { userId, currentPackageId, upgradePackageId, upgradeCost } = await request.json();

    // Convert userId to number if it's a string
    const numericUserId = parseInt(userId, 10);
    if (isNaN(numericUserId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    if (!numericUserId || !currentPackageId || !upgradePackageId || upgradeCost === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get user wallet balance (create if doesn't exist)
    let walletResult = await query(
      "SELECT balance FROM user_wallets WHERE user_id = ?",
      [numericUserId]
    );

    // If wallet doesn't exist, create one
    if (walletResult.length === 0) {
      await query(
        "INSERT INTO user_wallets (user_id, balance, total_earned, total_withdrawn) VALUES (?, 0, 0, 0)",
        [numericUserId]
      );
      walletResult = [{ balance: 0 }];
    }

    const currentBalance = walletResult[0].balance || 0;

    if (currentBalance < upgradeCost) {
      return NextResponse.json({ 
        error: `Insufficient balance. You have ₹${currentBalance} but need ₹${upgradeCost} for this upgrade.` 
      }, { status: 400 });
    }

    // Start transaction
    await query("START TRANSACTION");

    try {
      // Deduct from wallet
      await query(
        "UPDATE user_wallets SET balance = balance - ? WHERE user_id = ?",
        [upgradeCost, numericUserId]
      );

      // Update user's approved_packages array
      const userResult = await query(
        "SELECT approved_packages FROM users WHERE id = ?",
        [numericUserId]
      );

      if (userResult.length > 0) {
        let approvedPackages = [];
        if (userResult[0].approved_packages) {
          try {
            approvedPackages = JSON.parse(userResult[0].approved_packages);
          } catch (e) {
            approvedPackages = [];
          }
        }

        // Remove old package ID and add new one
        approvedPackages = approvedPackages.filter(id => id != currentPackageId);
        approvedPackages.push(upgradePackageId);

        await query(
          "UPDATE users SET approved_packages = ? WHERE id = ?",
          [JSON.stringify(approvedPackages), numericUserId]
        );
      }

      await query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Package upgraded successfully",
        newBalance: currentBalance - upgradeCost
      });

    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }

  } catch (error) {
    console.error("Upgrade error:", error);
    return NextResponse.json({ error: "Failed to upgrade package" }, { status: 500 });
  }
}