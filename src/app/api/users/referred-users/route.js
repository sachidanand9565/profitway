import { NextResponse } from 'next/server';
import { query } from '../../../../lib/mysqlClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // First get the user's referral code
    const userResult = await query('SELECT referral_code FROM users WHERE id = ?', [userId]);
    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const referralCode = userResult[0].referral_code;

    // Get all users who have this referral code as their sponsor_code
    const referredUsers = await query(`
      SELECT
        id,
        name,
        email,
        phone,
        state,
        created_at
      FROM users
      WHERE sponsor_code = ?
      ORDER BY created_at DESC
    `, [referralCode]);

    // Process the packages field - get packages separately
    const processedUsers = await Promise.all(referredUsers.map(async (user) => {
      try {
        const packages = await query(`
          SELECT p.title
          FROM user_packages up
          JOIN packages p ON up.package_id = p.id
          WHERE up.user_id = ? AND up.approved_at IS NOT NULL
        `, [user.id]);

        return {
          ...user,
          packages: packages.map(pkg => pkg.title)
        };
      } catch (pkgError) {
        console.error('Error fetching packages for user', user.id, pkgError);
        return {
          ...user,
          packages: []
        };
      }
    }));

    return NextResponse.json(processedUsers);
  } catch (err) {
    console.error('Error fetching referred users:', err);
    return NextResponse.json({ error: 'Failed to fetch referred users' }, { status: 500 });
  }
}