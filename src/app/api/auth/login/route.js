import { NextResponse } from "next/server";
import { query } from "../../../../lib/mysqlClient";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    // Get user by username
    const users = await query("SELECT * FROM users WHERE email = ?", [username]);

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid Email or password" }, { status: 401 });
    }

    const user = users[0];

    // Check password - plain text comparison only
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid Email or password" }, { status: 401 });
    }

    // Get approved packages from user_packages table
    const userPackages = await query(`
      SELECT p.id, p.title, p.slug, p.subtitle, p.price, p.image, up.approved_at
      FROM user_packages up
      JOIN packages p ON up.package_id = p.id
      WHERE up.user_id = ?
      ORDER BY up.approved_at DESC
    `, [user.id]);

    // Return user data (excluding password)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      phone: user.phone,
      state: user.state,
      photo: user.image, // Include profile image
      sponsor_code: user.sponsor_code,
      referral_code: user.referral_code,
      approved_packages: userPackages.map(pkg => pkg.id),
      approved_packages_details: userPackages,
      created_at: user.created_at
    };

    return NextResponse.json({ user: userData });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
