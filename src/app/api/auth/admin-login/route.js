import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/mysqlClient';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const rows = await query(
      'SELECT id, email, password FROM admin WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Invalid Email admin credentials' },
        { status: 401 }
      );
    }

    const admin = rows[0];

    // PLAIN TEXT PASSWORD CHECK
    const isValidPassword = password === admin.password;

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid Password admin credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin.id,
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
