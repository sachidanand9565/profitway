import { NextResponse } from "next/server";
import { query } from "@/lib/mysqlClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    /* =========================
       WALLET DETAILS
    ========================== */
    const walletResult = await query(
      `SELECT balance, total_earned, total_withdrawn 
       FROM user_wallets 
       WHERE user_id = ?`,
      [userId]
    );

    const wallet = walletResult[0] || {
      balance: 0,
      total_earned: 0,
      total_withdrawn: 0
    };

    /* =========================
       COMMISSION SUMMARY
    ========================== */
    const commissionSummary = await query(
      `
      SELECT
        commission_type,
        SUM(commission_amount) AS total_amount
      FROM commissions
      WHERE earner_user_id = ?
        AND status = 'credited'
      GROUP BY commission_type
      `,
      [userId]
    );

    let activeIncome = 0;
    let passiveIncome = 0;

    commissionSummary.forEach(row => {
      if (row.commission_type === "active") {
        activeIncome = parseFloat(row.total_amount || 0);
      }
      if (row.commission_type === "passive") {
        passiveIncome = parseFloat(row.total_amount || 0);
      }
    });

    /* =========================
       DATE CALCULATIONS
    ========================== */
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // today + last 6 days

    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29); // today + last 29 days

    /* =========================
       TODAY EARNING
    ========================== */
    const todayEarnings = await query(
      `
      SELECT SUM(commission_amount) AS total
      FROM commissions
      WHERE earner_user_id = ?
        AND created_at >= ?
        AND status = 'credited'
      `,
      [userId, todayStart]
    );

    /* =========================
       LAST 7 DAYS (INCLUDING TODAY)
    ========================== */
    const last7DaysEarnings = await query(
      `
      SELECT SUM(commission_amount) AS total
      FROM commissions
      WHERE earner_user_id = ?
        AND created_at >= ?
        AND status = 'credited'
      `,
      [userId, sevenDaysAgo]
    );

    /* =========================
       LAST 30 DAYS (INCLUDING TODAY)
    ========================== */
    const last30DaysEarnings = await query(
      `
      SELECT SUM(commission_amount) AS total
      FROM commissions
      WHERE earner_user_id = ?
        AND created_at >= ?
        AND status = 'credited'
      `,
      [userId, thirtyDaysAgo]
    );

    /* =========================
       RECENT COMMISSIONS
    ========================== */
    const recentCommissions = await query(
      `
      SELECT
        c.commission_amount,
        c.commission_type,
        c.commission_percentage,
        c.created_at,
        p.name AS package_name,
        u.username AS referrer_name
      FROM commissions c
      LEFT JOIN packages p ON c.package_name = p.name
      LEFT JOIN users u ON c.referrer_user_id = u.id
      WHERE c.earner_user_id = ?
      ORDER BY c.created_at DESC
      LIMIT 10
      `,
      [userId]
    );

    /* =========================
       RESPONSE
    ========================== */
    return NextResponse.json({
      wallet: {
        balance: parseFloat(wallet.balance || 0),
        totalEarned: parseFloat(wallet.total_earned || 0),
        totalWithdrawn: parseFloat(wallet.total_withdrawn || 0)
      },
      commissions: {
        activeIncome,
        passiveIncome,
        totalIncome: activeIncome + passiveIncome,
        todayEarning: parseFloat(todayEarnings[0]?.total || 0),
        last7DaysEarning: parseFloat(last7DaysEarnings[0]?.total || 0),
        last30DaysEarning: parseFloat(last30DaysEarnings[0]?.total || 0)
      },
      recentCommissions: recentCommissions.map(c => ({
        amount: parseFloat(c.commission_amount),
        type: c.commission_type,
        percentage: parseFloat(c.commission_percentage),
        date: c.created_at,
        packageName: c.package_name,
        referrerName: c.referrer_name
      }))
    });

  } catch (err) {
    console.error("Failed to fetch wallet data:", err);
    return NextResponse.json(
      { error: "Failed to fetch wallet data" },
      { status: 500 }
    );
  }
}
