import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysqlClient';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = (searchParams.get('email') || '').trim();
    if (!email) return NextResponse.json({ exists: false });

    const rows = await query('SELECT id, username, email FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows && rows.length > 0) {
      const u = rows[0];
      return NextResponse.json({ exists: true, user: { id: u.id, username: u.username, email: u.email } });
    }
    return NextResponse.json({ exists: false });
  } catch (err) {
    console.error('check-email error', err);
    return NextResponse.json({ exists: false, error: 'server_error' }, { status: 500 });
  }
}
