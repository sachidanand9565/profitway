import { NextResponse } from 'next/server';
import { query } from '../../../../lib/mysqlClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Check if token exists and is not expired
    const users = await query(
      'SELECT id, username FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()',
      [token]
    );

    if (users.length === 0) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired token' });
    }

    return NextResponse.json({ valid: true, username: users[0].username });
  } catch (error) {
    console.error('Validate token error:', error);
    return NextResponse.json({ error: 'Failed to validate token' }, { status: 500 });
  }
}
