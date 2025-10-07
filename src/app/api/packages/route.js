import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET() {
  try {
    const packages = await query("SELECT * FROM packages");
    return NextResponse.json(packages);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, title, subtitle, description, price, originalPrice, image, features, slug } = body;

    const result = await query(
      `INSERT INTO packages (name, title, subtitle, description, price, originalPrice, image, features, slug)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, title, subtitle, description, price, originalPrice, image, JSON.stringify(features), slug]
    );

    return NextResponse.json({ message: "Package created successfully", id: result.insertId });
  } catch (err) {
    console.error("Create package error:", err);
    return NextResponse.json({ error: "Failed to create package" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, name, title, subtitle, description, price, originalPrice, image, features, slug } = body;

    await query(
      `UPDATE packages SET name = ?, title = ?, subtitle = ?, description = ?, price = ?, originalPrice = ?, image = ?, features = ?, slug = ?
       WHERE id = ?`,
      [name, title, subtitle, description, price, originalPrice, image, JSON.stringify(features), slug, id]
    );

    return NextResponse.json({ message: "Package updated successfully" });
  } catch (err) {
    console.error("Update package error:", err);
    return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Package ID required" }, { status: 400 });
    }

    await query("DELETE FROM packages WHERE id = ?", [id]);

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Delete package error:", err);
    return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
  }
}
