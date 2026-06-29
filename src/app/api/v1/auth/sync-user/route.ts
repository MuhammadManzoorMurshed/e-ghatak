import connectDB from "@/lib/db/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        return NextResponse.json({
            success: true,
            message: "MongoDB is connected!",
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "MongoDB connection is failed!",
            error: String(error),
        })
    }
}