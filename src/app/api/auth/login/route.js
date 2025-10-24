import { NextResponse } from "next/server";
import { query } from "../../../../lib/mysqlClient";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    // Check user credentials
    const users = await query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = users[0];

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      approved_packages: JSON.parse(user.approved_packages || '[]'),
      created_at: user.created_at
    };

    return NextResponse.json({ user: userData });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
