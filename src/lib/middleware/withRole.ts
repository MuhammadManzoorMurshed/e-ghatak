import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedHandler } from "./withAuth";
import { IUser } from "../db/models/User.model";


type Role = "admin" | "moderator" | "user";

export function withRole(...allowedRoles: Role[]) {
    return function (handler: AuthenticatedHandler): AuthenticatedHandler {
        return async (req: NextRequest, user: IUser): Promise<NextResponse> => {
            if (!allowedRoles.includes(user.role as Role)) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "You are unauthorized!"
                    },
                    {
                        status: 403
                    }
                )
            }

            return handler(req, user);
        }
    }
}