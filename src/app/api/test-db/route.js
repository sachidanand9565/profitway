import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET() {
  try {
    // Test database creation
    await query("CREATE DATABASE IF NOT EXISTS profitway", [], null);
    return NextResponse.json({ message: "Database creation successful" });
  } catch (err) {
    console.error("Database creation error:", err);
    return NextResponse.json({
      error: "Database creation failed",
      details: err.message
    }, { status: 500 });
  }
}
