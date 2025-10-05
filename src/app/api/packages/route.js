import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET() {
  try {
    const packages = await query("SELECT * FROM packages");
    return NextResponse.json(packages);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
  }
}
