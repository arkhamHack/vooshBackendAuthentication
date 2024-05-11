import { Request, Response } from "express";
import Profile, { ProfileType } from "../models/profile";
import User, { RoleType, IUser } from "../models/user";
import { validationResult } from "express-validator";

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, email, username } = req.query;
    let user: any;
    if (userId || email || username) {
      user = await User.findOne({ $or: [{ email }, { username }, { userId }] });
    } else {
      return res.status(400).json({ message: "Inproper input" });
    }
    if (user && user.userId) {
      const userProfile = await Profile.findOne({ userId: userId });

      if (!userProfile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      if (
        user.role != RoleType.ADMIN &&
        userProfile.userId !== user.userId &&
        userProfile.visibility !== ProfileType.PUBLIC
      ) {
        return res
          .status(403)
          .json({ message: "Unauthorized to view profile" });
      }

      res.json(userProfile);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};

const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip =
      (parseInt(page as string, 10) - 1) * parseInt(limit as string, 10);
    let user: any;
    if (req.query.userId || req.query.email || req.query.username) {
      const { userId, email, username } = req.query;
      user = await User.findOne({
        $or: [{ email }, { username }, { userId }],
      });
    } else {
      return res.status(400).json({ message: "Inproper input" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let query: any = {};

    if (user.role === RoleType.ADMIN) {
      query = {};
    } else {
      query = {
        $or: [{ visibility: ProfileType.PUBLIC }, { userId: user.userId }],
      };
    }

    const profiles = await Profile.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string, 10));

    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch profiles" });
  }
};

const updateOrCreateUserProfile = async (req: Request, res: Response) => {
  try {
    let existingProfile: any;
    const { userId, profileId } = req.query;
    if (!profileId) existingProfile = await Profile.findOne({ userId: userId });

    if (!existingProfile) {
      const userExists = await User.findOne({ userId: userId });
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      existingProfile = await Profile.create({
        userId,
        ...req.body,
      });
    }
    if (existingProfile.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update profile" });
    }

    const updateFields: any = {};
    for (const key in req.body) {
      if (key in existingProfile.schema.paths) {
        updateFields[key] = req.body[key];
      }
    }
    const userProfile = await Profile.updateOne(
      { _id: existingProfile._id },
      { $set: updateFields },
      { new: true }
    );

    res.json(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user profile" });
  }
};

export { getUserProfile, updateOrCreateUserProfile, getAllProfiles };
