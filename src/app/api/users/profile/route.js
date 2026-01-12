import { NextResponse } from "next/server";
import { query } from "../../../../lib/mysqlClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const users = await query("SELECT id, username, email, name, phone, state, image FROM users WHERE id = ?", [userId]);

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];

    return NextResponse.json({
      name: user.name,
      phone: user.phone,
      state: user.state,
      email: user.email,
      photo: user.image
    });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}