import { query } from '@/lib/mysqlClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'today'; // today, yesterday, 7days, thisMonth, lastMonth
    const limit = parseInt(searchParams.get('limit')) || 5;

    // Calculate date ranges based on filter
    let startDate, endDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch (filter) {
      case 'today':
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'yesterday':
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      
      case '7days':
        startDate = new Date(today);
        startDate.setDate(today.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'thisMonth':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      
      default:
        startDate = new Date(today);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(today);
        endDate.setHours(23, 59, 59, 999);
    }

    // Format dates for MySQL
    const startDateStr = startDate.toISOString().slice(0, 19).replace('T', ' ');
    const endDateStr = endDate.toISOString().slice(0, 19).replace('T', ' ');

    // Query to get top earners with their total earnings
    const topEarners = await query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.image,
        u.referral_code,
        SUM(CAST(c.commission_amount AS DECIMAL(10,2))) as total_earnings,
        COUNT(DISTINCT c.id) as referral_count
      FROM commissions c
      INNER JOIN users u ON c.referrer_user_id = u.id
      WHERE c.created_at >= ? AND c.created_at <= ?
      AND c.status = 'credited'
      GROUP BY c.referrer_user_id, u.id, u.name, u.email, u.image, u.referral_code
      ORDER BY total_earnings DESC
      LIMIT ?
      `,
      [startDateStr, endDateStr, limit]
    );

    // Format the response
    const formattedEarners = topEarners.map((earner, index) => ({
      rank: index + 1,
      id: earner.id,
      name: earner.name || 'Unknown',
      email: earner.email,
      image: earner.image || null,
      referralCode: earner.referral_code,
      totalEarnings: parseFloat(earner.total_earnings) || 0,
      referralCount: earner.referral_count || 0
    }));

    return Response.json({
      success: true,
      data: formattedEarners,
      filter,
      dateRange: {
        start: startDateStr,
        end: endDateStr
      }
    });
  } catch (error) {
    console.error('Error fetching top earners:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch top earners' },
      { status: 500 }
    );
  }
}
