import User from "@/lib/db/models/User.model";
import connectDB from "@/lib/db/mongoose";
import { adminAuth } from "@/lib/firebase/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            {
                success: false,
                error: "Unauthorized Access! Authorization header is missing or invalid.",
            },
            {
                status: 401,
            }
        )
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
        return NextResponse.json(
            {
                success: false,
                error: "Unauthorized Access! Token is missing.",
            },
            {
                status: 401,
            }
        )
    }

    try {
        const decodedToken = await adminAuth.verifyIdToken(token);

        await connectDB();

        let user = await User.findOne({
            firebaseUid: decodedToken.uid,
            isDeleted: false,
        })

        if(!user) {
            user  = await User.create(
                {
                    firebaseUid: decodedToken.uid,
                    email: decodedToken.email,
                    role: "user",
                    status: "active",
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "User synchronized successfully.",
                user,
            }
        )
    } catch (error) {
        console.error("Error synchronizing user:", error);

        return NextResponse.json(
            {
                success: false,
                error: "An error occurred while synchronizing the user.",
            },
            {
                status: 500,
            }
        );
    }
}