import { NextRequest, NextResponse } from "next/server";
import User, { IUser } from "../db/models/User.model";
import { adminAuth } from "../firebase/admin";
import connectDB from "../db/mongoose";

export type AuthenticatedHandler = (
    req: NextRequest,
    user: IUser
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedHandler) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const authHeader = req.headers.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized! Authorization header is missing or invalid.",
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
                    error: "Unauthorized! Token is missing.",
                },
                {
                    status: 401,
                }
            )
        }

        try {
            const decodedToken = await adminAuth.verifyIdToken(token);

            try {
                await connectDB();

                try {
                    const user = await User.findOne({
                        firebaseUid: decodedToken.uid,
                        isDeleted: false,
                    });

                    if (!user) {
                        return NextResponse.json(
                            {
                                success: false,
                                error: "Unauthorized! User not found.",
                            },
                            {
                                status: 404,
                            });
                    }

                    if(user.status !== "active") {
                        return NextResponse.json(
                            {
                                success: false,
                                error: "The user account is suspended or banned. Please, contact the support team for more information.",
                            },
                            {
                                status: 403,
                            }
                        )
                    }

                    return handler(req, user);
                } catch (error) {
                    return NextResponse.json(
                        {
                            success: false,
                            error: "Internal Server Error! Failed to fetch user from the database.",
                            errorDetails: error instanceof Error ? error.message : String(error),
                        },
                        {
                            status: 500,
                        }
                    )
                }
            } catch (error) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Internal Server Error! Failed to connect to the database.",
                        errorDetails: error instanceof Error ? error.message : String(error),
                    },
                    {
                        status: 500,
                    }
                )
            }
        } catch (error) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Unauthorized! Invalid or expired token.",
                    errorDetails: error instanceof Error ? error.message : String(error),
                },
                {
                    status: 401,
                }
            )
        }
    }
}