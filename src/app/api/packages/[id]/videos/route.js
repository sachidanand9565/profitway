import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../../../lib/mysqlClient";

// GET /api/packages/[id]/videos - Get all videos for a package
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const videos = await query("SELECT * FROM packages_content WHERE package_id = ? ORDER BY created_at DESC", [id]);
    return NextResponse.json(videos);
  } catch (err) {
    console.error("Failed to fetch package videos:", err);
    return NextResponse.json({ error: "Failed to fetch package videos" }, { status: 500 });
  }
}

// POST /api/packages/[id]/videos - Add a new video to a package
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const { video } = await request.json();

    if (!video) {
      return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
    }

    // Check if package exists
    const packages = await query("SELECT id FROM packages WHERE id = ?", [id]);
    if (packages.length === 0) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const result = await query(
      "INSERT INTO packages_content (package_id, video) VALUES (?, ?)",
      [id, video]
    );

    return NextResponse.json({
      message: "Video added successfully",
      id: result.insertId
    });
  } catch (err) {
    console.error("Failed to add package video:", err);
    return NextResponse.json({ error: "Failed to add package video" }, { status: 500 });
  }
}

// DELETE /api/packages/[id]/videos - Delete all videos for a package (optional, for cleanup)
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await query("DELETE FROM packages_content WHERE package_id = ?", [id]);
    return NextResponse.json({ message: "All videos deleted successfully" });
  } catch (err) {
    console.error("Failed to delete package videos:", err);
    return NextResponse.json({ error: "Failed to delete package videos" }, { status: 500 });
  }
}
