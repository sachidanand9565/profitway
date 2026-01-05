
import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '@/lib/mysqlClient';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const { amount, method, upiId, accountNumber, bankName, ifscCode } = await request.json();

  // Validate required fields
  if (!amount || !method) {
    return NextResponse.json({ error: 'Amount and method are required' }, { status: 400 });
  }

  // Validate method-specific fields
  if (method === 'UPI' && !upiId) {
    return NextResponse.json({ error: 'UPI ID is required for UPI withdrawals' }, { status: 400 });
  }

  if (method === 'Bank' && (!accountNumber || !bankName || !ifscCode)) {
    return NextResponse.json({ error: 'Account number, bank name, and IFSC code are required for bank transfers' }, { status: 400 });
  }

  let connection;
  try {
    // Get user wallet balance
    const walletRows = await query(
      'SELECT balance FROM user_wallets WHERE user_id = ?',
      [userId]
    );

    if (walletRows.length === 0) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
    }

    const currentBalance = parseFloat(walletRows[0].balance);

    if (currentBalance < amount) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 });
    }

    // Start transaction
    connection = await getConnection();
    await connection.beginTransaction();

    // Create withdrawal request
    const [result] = await connection.execute(
      `INSERT INTO withdrawal_requests
       (user_id, amount, method, upi_id, account_number, bank_name, ifsc_code, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [userId, amount, method, upiId || null, accountNumber || null, bankName || null, ifscCode || null]
    );

    // Update wallet balance (deduct the amount)
    await connection.execute(
      'UPDATE user_wallets SET balance = balance - ?, total_withdrawn = total_withdrawn + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
      [amount, amount, userId]
    );

    // Commit transaction
    await connection.commit();

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      requestId: result.insertId
    });

  } catch (error) {
    // Rollback transaction on error
    if (connection) {
      await connection.rollback();
    }
    console.error('Withdrawal request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    // Release connection
    if (connection) {
      connection.release();
    }
  }
}
