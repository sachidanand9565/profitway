import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const uri = "mongodb+srv://webdev:n1u9HQuxTh4WUtEF@linktree.vrwkp.mongodb.net/?retryWrites=true&w=majority&appName=linktree";
const client = new MongoClient(uri);
const dbName = "auth";
const collectionName = "auth01";

async function connectToDb() {
    await client.connect();
    const database = client.db(dbName);
    return database.collection(collectionName);
}

// POST: Login User
export async function POST(req) {
    try {
        const body = await req.json();
        const { email, password } = body;


        // Connect to DB
        const collection = await connectToDb();
        const user = await collection.findOne({ });

        console.log("Fetched User:", user);

        if (!user) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);


        if (!isPasswordValid) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }
        // Login success response
        return NextResponse.json(
            { message: "Login successful", user: { _id: user._id, email: user.email, userName: user.username, AuthToken: user.authToken } },
            { status: 200 }
        );
    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { message: "Something went wrong", error: error.message },
            { status: 500 }
        );
    } finally {
        await client.close(); // Close the DB connection
    }
}