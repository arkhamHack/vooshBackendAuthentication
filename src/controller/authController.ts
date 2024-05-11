import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { Provider } from "../models/user";
import { checkBlacklist, blacklistedTokens } from "../middleware/middleware";
import dotenv from "dotenv";
dotenv.config();

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const newUser = await User.create({ ...req.body });
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.provider !== Provider.NATIVE)
      return res.status(400).json({
        message: `Wrong Provider, user logged in using ${user.provider}`,
      });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: user.userId,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }
};

const updateEmail = async (req: Request, res: Response) => {
  try {
    const { userId, username, password, newEmail } = req.body;

    const user = await User.findOne({ $or: [{ username }, { userId }] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.email = newEmail;
    await user.save();

    res.json({ message: "Email updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update email" });
  }
};

const updatePassword = async (req: Request, res: Response) => {
  try {
    const { username, currentPassword, newPassword, userId } = req.body;
    const user = await User.findOne({
      $or: [{ username }, { userId }],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.provider !== Provider.NATIVE)
      return res.status(400).json({
        message: `Wrong Provider, user logged in using ${user.provider} . Password Update Not Allowed.`,
      });
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ username }, { $set: { password: hashedPassword } });
    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update password" });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization;
    if (token && !checkBlacklist(token)) {
      blacklistedTokens.push(token);
    } else {
      throw res.status(500).json({ message: "Failed to log out" });
    }
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to log out" });
  }
};

const authCallback = (req: Request, res: Response) => {
  if (req.user) {
    const user: any = req.user;
    const userId = user.user.userId;
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string
    );

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>JWT Token</title>
      </head>
      <body>
        <p>JWT Token: ${token}</p>
        <P>User Id: ${userId}</p>
      </body>
      </html>
    `;

    res.send(html);
  } else {
    res.status(401).json({ message: "Authentication failed" });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  updateEmail,
  updatePassword,
  authCallback,
};
