import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET() {
  try {
    const users = await query("SELECT id, username, email, approved_packages, created_at FROM users");
    return NextResponse.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, password, email, approved_packages } = await request.json();

    const result = await query(
      "INSERT INTO users (username, password, email, approved_packages, created_at) VALUES (?, ?, ?, ?, NOW())",
      [username, password, email, JSON.stringify(approved_packages)]
    );

    return NextResponse.json({ message: "User created successfully", id: result.insertId });
  } catch (err) {
    console.error("Failed to create user:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
