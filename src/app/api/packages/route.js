import { NextResponse, NextRequest } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      // Fetch single package by slug
      const packages = await query("SELECT * FROM packages WHERE slug = ?", [slug]);
      if (packages.length === 0) {
        return NextResponse.json({ error: "Package not found" }, { status: 404 });
      }
      const pkg = packages[0];
      // Fetch modules for the package
      const modules = await query("SELECT * FROM modules WHERE package_id = ? ORDER BY order_index ASC, created_at ASC", [pkg.id]);
      // Fetch videos for each module
      for (let module of modules) {
        const videos = await query("SELECT * FROM videos WHERE module_id = ? ORDER BY order_index ASC, created_at ASC", [module.id]);
        module.videos = videos;
      }
      pkg.modules = modules;
      return NextResponse.json(pkg);
    } else {
      // Fetch all packages
      const packages = await query("SELECT * FROM packages");
      // Fetch modules for each package
      for (let pkg of packages) {
        const modules = await query("SELECT * FROM modules WHERE package_id = ? ORDER BY order_index ASC, created_at ASC", [pkg.id]);
        // Fetch videos for each module
        for (let module of modules) {
          const videos = await query("SELECT * FROM videos WHERE module_id = ? ORDER BY order_index ASC, created_at ASC", [module.id]);
          module.videos = videos;
        }
        pkg.modules = modules;
      }
      return NextResponse.json(packages);
    }
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
