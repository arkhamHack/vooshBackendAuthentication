import mongoose, { Schema, Document } from "mongoose";

export enum ProfileType {
  PUBLIC = "public",
  PRIVATE = "private",
}

export interface Profile extends Document {
  userId: string;
  photo?: string;
  name?: string;
  bio?: string;
  phone?: string;
  password: string;
  visibility: ProfileType;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema({
  userId: { type: String, ref: "users", required: true },
  photo: String,
  name: String,
  bio: String,
  phone: String,
  visibility: {
    type: String,
    enum: ProfileType,
    default: ProfileType.PUBLIC,
  },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<Profile>("profiles", ProfileSchema);
