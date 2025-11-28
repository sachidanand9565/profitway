import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '../../../../lib/mysqlClient';

export async function GET() {
  try {
    const withdrawals = await query(`
      SELECT
        wr.*,
        u.username,
        u.email,
        u.phone,
        u.state,
        u.photo,
        u.referral_code,
        u.sponsor_code,
        uw.balance,
        uw.total_earned,
        uw.total_withdrawn
      FROM withdrawal_requests wr
      JOIN users u ON wr.user_id = u.id
      LEFT JOIN user_wallets uw ON wr.user_id = uw.user_id
      ORDER BY wr.created_at DESC
    `);

    return NextResponse.json(withdrawals);
  } catch (error) {
    console.error('Failed to fetch withdrawals:', error);
    return NextResponse.json({ error: 'Failed to fetch withdrawals' }, { status: 500 });
  }
}

export async function POST(request) {
  const { id, action } = await request.json();

  if (!id || !action) {
    return NextResponse.json({ error: 'ID and action are required' }, { status: 400 });
  }

  if (!['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();

    // Get withdrawal request details
    const [withdrawal] = await connection.execute(
      'SELECT * FROM withdrawal_requests WHERE id = ?',
      [id]
    );

    if (withdrawal.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: 'Withdrawal request not found' }, { status: 404 });
    }

    const requestData = withdrawal[0];

    if (requestData.status !== 'pending') {
      await connection.rollback();
      return NextResponse.json({ error: 'Request already processed' }, { status: 400 });
    }

    if (action === 'approve') {
      // For approval, we don't need to do anything special since the amount was already deducted
      // when the request was created. We just update the status.
      await connection.execute(
        'UPDATE withdrawal_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['approved', id]
      );
    } else if (action === 'reject') {
      // For rejection, we need to refund the amount back to the user's wallet
      await connection.execute(
        'UPDATE user_wallets SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        [requestData.amount, requestData.user_id]
      );

      await connection.execute(
        'UPDATE withdrawal_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        ['rejected', id]
      );
    }

    await connection.commit();

    return NextResponse.json({
      success: true,
      message: `Withdrawal request ${action}d successfully`
    });

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Failed to process withdrawal:', error);
    return NextResponse.json({ error: 'Failed to process withdrawal' }, { status: 500 });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
