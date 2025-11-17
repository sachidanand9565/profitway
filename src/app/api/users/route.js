import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const code = searchParams.get('code');

  // Check if email exists
  if (email) {
    try {
      const users = await query("SELECT id FROM users WHERE email = ?", [email]);
      return NextResponse.json({ exists: users.length > 0 });
    } catch (err) {
      console.error("Failed to check email:", err);
      return NextResponse.json({ error: "Failed to check email" }, { status: 500 });
    }
  }

  // Get sponsor name by referral code
  if (code) {
    try {
      const users = await query("SELECT name FROM users WHERE referral_code = ?", [code]);
      if (users.length > 0) {
        return NextResponse.json({ name: users[0].name });
      } else {
        return NextResponse.json({ name: null });
      }
    } catch (err) {
      console.error("Failed to get sponsor name:", err);
      return NextResponse.json({ error: "Failed to get sponsor name" }, { status: 500 });
    }
  }

  // Default: fetch all users
  try {
    const users = await query(`
      SELECT u.id, u.username, u.email, u.password, u.name, u.phone, u.status, u.created_at,
             GROUP_CONCAT(up.package_id) as approved_packages
      FROM users u
      LEFT JOIN user_packages up ON u.id = up.user_id
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);

    // Process the results to format approved_packages as array
    const processedUsers = users.map(user => ({
      ...user,
      approved_packages: user.approved_packages ? user.approved_packages.split(',').map(id => parseInt(id)) : []
    }));

    return NextResponse.json(processedUsers || []);
  } catch (err) {
    console.error("Failed to fetch users:", err);
    // If status column doesn't exist, try without it
    if (err.code === 'ER_BAD_FIELD_ERROR' && err.sqlMessage.includes('status')) {
      try {
        const users = await query(`
          SELECT u.id, u.username, u.email, u.password, u.name, u.phone, u.created_at,
                 GROUP_CONCAT(up.package_id) as approved_packages
          FROM users u
          LEFT JOIN user_packages up ON u.id = up.user_id
          GROUP BY u.id
          ORDER BY u.created_at DESC
        `);
        // Add default status to each user
        const processedUsers = users.map(user => ({
          ...user,
          status: 'active',
          approved_packages: user.approved_packages ? user.approved_packages.split(',').map(id => parseInt(id)) : []
        }));
        return NextResponse.json(processedUsers || []);
      } catch (fallbackErr) {
        console.error("Fallback query also failed:", fallbackErr);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
      }
    }
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

    // First check if status column exists
    let hasStatusColumn = true;
    try {
      await query("SELECT status FROM users LIMIT 1");
    } catch (err) {
      if (err.code === 'ER_BAD_FIELD_ERROR' && err.sqlMessage.includes('status')) {
        hasStatusColumn = false;
      }
    }

    let queryStr = "UPDATE users SET username = ?, email = ?, approved_packages = ?";
    let params = [username, email, JSON.stringify(approved_packages)];

    if (hasStatusColumn) {
      queryStr += ", status = ?";
      params.push(status);
    }

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
