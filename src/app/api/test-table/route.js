import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";

export async function GET() {
  try {
    // First create database
    await query("CREATE DATABASE IF NOT EXISTS profitway", [], null);

    // Test table creation
    await query(`
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        description TEXT,
        price VARCHAR(50),
        originalPrice VARCHAR(50),
        image VARCHAR(255),
        features JSON,
        slug VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, [], 'profitway');

    return NextResponse.json({ message: "Table creation successful" });
  } catch (err) {
    console.error("Table creation error:", err);
    return NextResponse.json({
      error: "Table creation failed",
      details: err.message
    }, { status: 500 });
  }
}
