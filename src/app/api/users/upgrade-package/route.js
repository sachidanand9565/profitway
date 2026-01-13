import { NextResponse } from "next/server";
import { query } from "../../../../lib/mysqlClient";

export async function POST(request) {
  try {
    const { userId, currentPackageId, upgradePackageId, upgradeCost } = await request.json();

    const numericUserId = parseInt(userId, 10);
    const cost = Number(upgradeCost);

    if (!numericUserId || !upgradePackageId || isNaN(cost) || cost <= 0) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // Get wallet
    const walletResult = await query(
      "SELECT balance FROM user_wallets WHERE user_id = ?",
      [numericUserId]
    );

    if (walletResult.length === 0) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 400 });
    }

    const balance = Number(walletResult[0].balance);

    if (balance < cost) {
      return NextResponse.json(
        { error: `Insufficient balance. Wallet ₹${balance}` },
        { status: 400 }
      );
    }

    // Start transaction
    await query("START TRANSACTION");

    try {
      // 1️⃣ Deduct wallet
      await query(
        "UPDATE user_wallets SET balance = balance - ? WHERE user_id = ?",
        [cost, numericUserId]
      );

      // 2️⃣ Update package (SINGLE ROW UPDATE)
      const pkgUpdate = await query(
        "UPDATE user_packages SET package_id = ?, approved_at = NOW() WHERE user_id = ?",
        [upgradePackageId, numericUserId]
      );

      if (pkgUpdate.affectedRows === 0) {
        throw new Error("Package row not found for user");
      }

      await query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Package upgraded successfully",
        newBalance: balance - cost
      });

    } catch (err) {
      await query("ROLLBACK");
      throw err;
    }

  } catch (error) {
    console.error("Upgrade error:", error.message);
    return NextResponse.json({ error: "Failed to upgrade package" }, { status: 500 });
  }
}
