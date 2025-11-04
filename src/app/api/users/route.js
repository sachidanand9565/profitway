import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET() {
  try {
    const users = await query("SELECT id, username, email, approved_packages, status, created_at FROM users ORDER BY created_at DESC");
    return NextResponse.json(users);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { username, password, email, approved_packages, status } = await request.json();

    const result = await query(
      "INSERT INTO users (username, password, email, approved_packages, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [username, password, email, JSON.stringify(approved_packages), status || 'active']
    );

    return NextResponse.json({ message: "User created successfully", id: result.insertId });
  } catch (err) {
    console.error("Failed to create user:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, username, password, email, approved_packages, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let queryStr = "UPDATE users SET username = ?, email = ?, approved_packages = ?, status = ?";
    let params = [username, email, JSON.stringify(approved_packages), status];

    if (password) {
      queryStr += ", password = ?";
      params.push(password);
    }

    queryStr += " WHERE id = ?";
    params.push(id);

    await query(queryStr, params);

    return NextResponse.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Failed to update user:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await query("DELETE FROM users WHERE id = ?", [id]);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Failed to delete user:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
