import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');

    if (moduleId) {
      // Fetch videos for a specific module
      const videos = await query(
        "SELECT * FROM videos WHERE module_id = ? ORDER BY order_index ASC, created_at ASC",
        [moduleId]
      );
      return NextResponse.json(videos);
    } else {
      // Fetch all videos
      const videos = await query("SELECT * FROM videos ORDER BY module_id, order_index ASC");
      return NextResponse.json(videos);
    }
  } catch (err) {
    console.error("Fetch videos error:", err);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { moduleId, title, videoUrl, image, description, orderIndex = 0 } = body;

    if (!moduleId || !title || !videoUrl) {
      return NextResponse.json({ error: "Module ID, title, and video URL are required" }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO videos (module_id, title, video_url, image, description, order_index)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [moduleId, title, videoUrl, image, description, orderIndex]
    );

    return NextResponse.json({ message: "Video created successfully", id: result.insertId });
  } catch (err) {
    console.error("Create video error:", err);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, title, videoUrl, image, description, orderIndex } = body;

    if (!id) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 });
    }

    await query(
      `UPDATE videos SET title = ?, video_url = ?, image = ?, description = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [title, videoUrl, image, description, orderIndex, id]
    );

    return NextResponse.json({ message: "Video updated successfully" });
  } catch (err) {
    console.error("Update video error:", err);
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    await query("DELETE FROM videos WHERE id = ?", [id]);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Delete video error:", err);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}