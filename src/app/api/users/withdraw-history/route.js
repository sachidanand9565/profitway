import { NextResponse } from 'next/server';
import { query } from '../../../../lib/mysqlClient';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Fetch withdrawal history for the user
    const withdrawalHistory = await query(
      `SELECT
        id,
        amount,
        method,
        upi_id,
        account_number,
        bank_name,
        ifsc_code,
        status,
        created_at,
        updated_at
      FROM withdrawal_requests
      WHERE user_id = ?
      ORDER BY created_at DESC`,
      [userId]
    );

    // Format the response
    const formattedHistory = withdrawalHistory.map(withdrawal => ({
      id: withdrawal.id,
      amount: parseFloat(withdrawal.amount),
      method: withdrawal.method,
      paymentDetails: withdrawal.method === 'UPI'
        ? { upiId: withdrawal.upi_id }
        : {
            accountNumber: withdrawal.account_number,
            bankName: withdrawal.bank_name,
            ifscCode: withdrawal.ifsc_code
          },
      status: withdrawal.status,
      createdAt: withdrawal.created_at,
      updatedAt: withdrawal.updated_at
    }));

    return NextResponse.json({
      success: true,
      history: formattedHistory
    });

  } catch (error) {
    console.error('Withdrawal history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
