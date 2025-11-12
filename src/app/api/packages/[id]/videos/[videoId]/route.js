import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../../../../lib/mysqlClient";

// DELETE /api/packages/[id]/videos/[videoId] - Delete a specific video
export async function DELETE(request, { params }) {
  try {
    const { id, videoId } = await params;

    // Verify the video belongs to the package
    const videos = await query(
      "SELECT id FROM packages_content WHERE id = ? AND package_id = ?",
      [videoId, id]
    );

    if (videos.length === 0) {
      return NextResponse.json({ error: "Video not found or doesn't belong to this package" }, { status: 404 });
    }

    await query("DELETE FROM packages_content WHERE id = ?", [videoId]);

    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Failed to delete package video:", err);
    return NextResponse.json({ error: "Failed to delete package video" }, { status: 500 });
  }
}
