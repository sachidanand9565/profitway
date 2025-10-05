import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET() {
  try {
    // Test basic connection
    const result = await query("SELECT 1 as test");
    return NextResponse.json({ message: "MySQL connection successful", result });
  } catch (err) {
    console.error("MySQL connection error:", err);
    return NextResponse.json({
      error: "MySQL connection failed",
      details: err.message
    }, { status: 500 });
  }
}
