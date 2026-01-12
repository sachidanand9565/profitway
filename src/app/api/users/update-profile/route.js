import { NextResponse } from "next/server";
import { query } from "../../../../lib/mysqlClient";

export async function POST(request) {
  try {
    const { userId, name, phone, state,email, photo } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const updateFields = [];
    const values = [];

    if (name !== undefined) {
      updateFields.push("name = ?");
      values.push(name);
    }

    if (phone !== undefined) {
      updateFields.push("phone = ?");
      values.push(phone);
    }
if (email !== undefined) {
      updateFields.push("email = ?");
      values.push(email);
    }
    if (state !== undefined) {
      updateFields.push("state = ?");
      values.push(state);
    }

    if (photo !== undefined) {
      updateFields.push("image = ?");
      values.push(photo);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    values.push(userId);

    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

    await query(sql, values);

    // Fetch updated user data
    const updatedUser = await query("SELECT id, username, email, phone, state, image FROM users WHERE id = ?", [userId]);

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      photo: updatedUser[0].image
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
