import { NextResponse } from 'next/server';
import { query } from '../../../lib/mysqlClient';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get('code') || '').trim();
    if (!code) return NextResponse.json({ name: null });

    // look up by referral_code (or username as fallback)
    const rows = await query('SELECT id, name, referral_code FROM users WHERE referral_code = ? LIMIT 1', [code]);
    if (rows && rows.length > 0) {
      return NextResponse.json({ name: rows[0].name || null });
    }

    return NextResponse.json({ name: null });
  } catch (err) {
    console.error('check-sponsor error', err);
    return NextResponse.json({ name: null, error: 'server_error' }, { status: 500 });
  }
}
