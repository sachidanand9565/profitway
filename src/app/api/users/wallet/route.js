import { NextResponse } from "next/server";
import { query } from "../../../../lib/mysqlClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Get wallet balance
    const walletResult = await query(
      "SELECT balance, total_earned, total_withdrawn FROM user_wallets WHERE user_id = ?",
      [userId]
    );

    const wallet = walletResult[0] || { balance: 0, total_earned: 0, total_withdrawn: 0 };

    // Get commission summary (active vs passive) - only credited commissions
    const commissionSummary = await query(`
      SELECT
        commission_type,
        SUM(commission_amount) as total_amount,
        COUNT(*) as count
      FROM commissions
      WHERE earner_user_id = ? AND status = 'credited'
      GROUP BY commission_type
    `, [userId]);

    // Calculate active and passive income
    let activeIncome = 0;
    let passiveIncome = 0;

    commissionSummary.forEach(commission => {
      if (commission.commission_type === 'active') {
        activeIncome = parseFloat(commission.total_amount);
      } else if (commission.commission_type === 'passive') {
        passiveIncome = parseFloat(commission.total_amount);
      }
    });

    // Get time-based earnings
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const sevenDaysAgo = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(todayStart.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Today's earnings (only credited commissions)
    const todayEarnings = await query(`
      SELECT SUM(commission_amount) as total
      FROM commissions
      WHERE earner_user_id = ? AND created_at >= ? AND status = 'credited'
    `, [userId, todayStart]);

    // Last 7 days earnings (only credited commissions)
    const last7DaysEarnings = await query(`
      SELECT SUM(commission_amount) as total
      FROM commissions
      WHERE earner_user_id = ? AND created_at >= ? AND status = 'credited'
    `, [userId, sevenDaysAgo]);

    // Last 30 days earnings (only credited commissions)
    const last30DaysEarnings = await query(`
      SELECT SUM(commission_amount) as total
      FROM commissions
      WHERE earner_user_id = ? AND created_at >= ? AND status = 'credited'
    `, [userId, thirtyDaysAgo]);

    // Get recent commissions (last 10)
    const recentCommissions = await query(`
      SELECT
        c.commission_amount,
        c.commission_type,
        c.commission_percentage,
        c.created_at,
        p.name as package_name,
        u.username as referrer_name
      FROM commissions c
      LEFT JOIN packages p ON c.package_name = p.name
      LEFT JOIN users u ON c.referrer_user_id = u.id
      WHERE c.earner_user_id = ?
      ORDER BY c.created_at DESC
      LIMIT 10
    `, [userId]);

    return NextResponse.json({
      wallet: {
        balance: parseFloat(wallet.balance),
        totalEarned: parseFloat(wallet.total_earned),
        totalWithdrawn: parseFloat(wallet.total_withdrawn)
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
    return NextResponse.json({ error: "Failed to fetch wallet data" }, { status: 500 });
  }
}
