import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('packageId');

    if (packageId) {
      // Fetch modules for a specific package
      const modules = await query(
        "SELECT * FROM modules WHERE package_id = ? ORDER BY order_index ASC, created_at ASC",
        [packageId]
      );

      // Fetch videos for each module
      for (let module of modules) {
        const videos = await query(
          "SELECT * FROM videos WHERE module_id = ? ORDER BY order_index ASC, created_at ASC",
          [module.id]
        );
        module.videos = videos;
      }

      return NextResponse.json(modules);
    } else {
      // Fetch all modules
      const modules = await query("SELECT * FROM modules ORDER BY package_id, order_index ASC");
      return NextResponse.json(modules);
    }
  } catch (err) {
    console.error("Fetch modules error:", err);
    return NextResponse.json({ error: "Failed to fetch modules" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { packageId, title, description, orderIndex = 0 } = body;

    if (!packageId || !title) {
      return NextResponse.json({ error: "Package ID and title are required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO modules (package_id, title, description, order_index)
       VALUES (?, ?, ?, ?)`,
      [packageId, title, description, orderIndex]
    );

    return NextResponse.json({ message: "Module created successfully", id: result.insertId });
  } catch (err) {
    console.error("Create module error:", err);
    return NextResponse.json({ error: "Failed to create module" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, description, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: "Module ID is required" }, { status: 400 });
    }

    await query(
      `UPDATE modules SET title = ?, description = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, description, orderIndex, id]
    );

    return NextResponse.json({ message: "Module updated successfully" });
  } catch (err) {
    console.error("Update module error:", err);
    return NextResponse.json({ error: "Failed to update module" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Module ID required" }, { status: 400 });
    }

    await query("DELETE FROM modules WHERE id = ?", [id]);

    return NextResponse.json({ message: "Module deleted successfully" });
  } catch (err) {
    console.error("Delete module error:", err);
    return NextResponse.json({ error: "Failed to delete module" }, { status: 500 });
  }
}