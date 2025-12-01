import { NextRequest, NextResponse } from 'next/server';
import { query, getConnection } from '../../../../lib/mysqlClient';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    const withdrawals = await query(`
      SELECT
        wr.*,
        u.username,
        u.email,
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

      // Get user details for email
      const [userDetails] = await connection.execute(
        'SELECT username, email FROM users WHERE id = ?',
        [requestData.user_id]
      );

      if (userDetails.length > 0) {
        const user = userDetails[0];

        // Send congratulatory email using SMTP
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          });
      const formattedDate = new Date().toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});
          const mailOptions = {
            from: process.env.FROM_EMAIL || process.env.SMTP_USER,
            to: user.email,
            subject: '🎉 Congratulations! Your Withdrawal Request Has Been Approved',
            html: `
             <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Congratulations - Payment Transferred</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f2f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #e8f4ff 0%, #f0e8ff 50%, #ffe8f0 100%); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.15); position: relative;">
                    
                    <!-- Decorative circles -->
                    <tr>
                        <td style="height: 0; position: relative;">
                            <div style="position: absolute; top: -40px; right: -40px; width: 120px; height: 120px; background: radial-gradient(circle, #ffd700, #ffed4e); border-radius: 50%; opacity: 0.4;"></div>
                            <div style="position: absolute; top: 100px; left: -30px; width: 80px; height: 80px; background: radial-gradient(circle, #ff6b9d, #ff8fab); border-radius: 50%; opacity: 0.3;"></div>
                            <div style="position: absolute; bottom: -50px; right: 50px; width: 100px; height: 100px; background: radial-gradient(circle, #a78bfa, #c4b5fd); border-radius: 50%; opacity: 0.3;"></div>
                        </td>
                    </tr>
                    
                    <!-- Logo Section -->
                    <tr>
                        <td align="center" style="padding: 40px 20px 20px 20px;">
                            <img src="https://profitway.vercel.app/logo.png" alt="ProfitWay Logo" style="max-width: 180px; height: auto; display: block; margin: 0 auto;">
                        </td>
                    </tr>
                    
                    <!-- Congratulations Text -->
                    <tr>
                        <td align="center" style="padding: 25px 40px 15px 40px;">
                            <h2 style="color: #1e293b; margin: 0; font-size: 36px; font-weight: 700; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">🎉 Congratulations!</h2>
                        </td>
                    </tr>
                    
                    <!-- User Name -->
                    <tr>
                        <td align="center" style="padding: 10px 40px 5px 40px;">
                            <h3 style="color: #334155; margin: 0; font-size: 26px; font-weight: 600;">${user.name}</h3>
                        </td>
                    </tr>
                    
                    <!-- You Have Earned Text -->
                    <tr>
                        <td align="center" style="padding: 25px 40px 15px 40px;">
                            <p style="color: #dc2626; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">You Have Earned</p>
                        </td>
                    </tr>
                    
                    <!-- Amount Box -->
                    <tr>
                        <td align="center" style="padding: 15px 40px 25px 40px;">
                            <div style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border: 5px solid #3b82f6; border-radius: 20px; padding: 25px 50px; display: inline-block; box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3); position: relative; overflow: hidden;">
                                <!-- Shine effect -->
                                <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent); transform: rotate(45deg);"></div>
                                <p style="color: #1e40af; margin: 0; font-size: 42px; font-weight: 800; letter-spacing: 1px; position: relative; z-index: 1;">₹${requestData.amount} INR</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Success Icon -->
                    <tr>
                        <td align="center" style="padding: 10px;">
                            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
                                <span style="color: white; font-size: 32px; line-height: 60px;">✓</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Message Text -->
                    <tr>
                        <td align="center" style="padding: 25px 50px 30px 50px;">
                            <p style="color: #475569; margin: 0; font-size: 17px; line-height: 1.7; font-weight: 500;">
                                We Are Happy To Inform You<br>
                                That We Have Transferred Your<br>
                                Payment Into Your Bank Account.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Transaction Details Box -->
                    <tr>
                        <td style="padding: 0 40px 30px 40px;">
                            <div style="background-color: rgba(255,255,255,0.7); border-radius: 15px; padding: 20px; backdrop-filter: blur(10px);">
                                <table width="100%" cellpadding="8" cellspacing="0">
                                   
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px; font-weight: 500;">Amount:</td>
                                        <td align="right" style="color: #334155; font-size: 14px; font-weight: 600;">₹${requestData.amount}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; font-size: 14px; font-weight: 500;">Status:</td>
                                        <td align="right" style="color: #10b981; font-size: 14px; font-weight: 700;">✓ Completed</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Date -->
                    <tr>
                        <td align="center" style="padding: 10px 40px 35px 40px;">
                            <p style="color: #1e293b; margin: 0; font-size: 18px; font-weight: 700;">(${formattedDate})</p>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td align="center" style="padding: 0 40px 40px 40px;">
                            <a href="https://profitway.vercel.app/" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 15px 45px; border-radius: 30px; font-size: 16px; font-weight: 700; box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4); transition: all 0.3s;">
                                View Dashboard →
                            </a>
                        </td>
                    </tr>
                    
                </table>
                
                <!-- Footer Section -->
                <table width="600" cellpadding="0" cellspacing="0" style="margin-top: 25px;">
                    <tr>
                        <td style="background-color: #ffffff; border-radius: 15px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
                            <p style="color: #64748b; font-size: 13px; margin: 0 0 8px 0; text-align: center; line-height: 1.6;">
                                💡 <strong>Tip:</strong> The amount will reflect in your bank account within 2-5 business days.
                            </p>
                            <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0; text-align: center;">
                                Need help? Contact us at <a href="mailto:support@profitway.com" style="color: #3b82f6; text-decoration: none; font-weight: 600;">support@profitway.com</a>
                            </p>
                            <p style="color: #cbd5e1; font-size: 11px; margin: 10px 0 0 0; text-align: center;">
                                © 2024 ProfitWay. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
</body>
</html>
            `,
            text: `Congratulations ${user.username}! Your withdrawal request for ₹${requestData.amount} has been approved. Your funds will be transferred within 1-3 business days.`
          };

          await transporter.sendMail(mailOptions);
          console.log('📧 Withdrawal approval email sent successfully');
        } catch (emailError) {
          console.error('Error sending congratulatory email:', emailError);
          // Don't fail the withdrawal approval if email fails
        }
      }
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
