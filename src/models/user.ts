import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export enum RoleType {
  USER = "user",
  ADMIN = "admin",
}

export enum Provider {
  NATIVE = "native",
  GOOGLE = "google",
  GITHUB = "github",
}

export interface IUser extends Document {
  userId: string;
  username?: string;
  email: string;
  password: string;
  role: RoleType;
  updatedAt: Date;
  provider: string;
}

const UserSchema: Schema = new Schema({
  userId: { type: String, required: false, default: uuidv4(), unique: true },
  provider: { type: String, default: Provider.NATIVE },
  username: { type: String, required: false, unique: true },
  email: { type: String, required: false, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: RoleType, default: RoleType.USER },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("users", UserSchema);
