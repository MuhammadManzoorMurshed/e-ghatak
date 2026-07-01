import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
    firebaseUid: string;
    email: string;
    role: "user" | "moderator" | "admin";
    status: "active" | "suspended" | "banned";
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>(
    {
        firebaseUid: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        role: { type: String, enum: ["user", "moderator", "admin"], default: "user" },
        status: { type: String, enum: ["active", "suspended", "banned"], default: "active" },
        isDeleted: { type: Boolean, default: false },

    },
    {
        timestamps: true,
    }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;