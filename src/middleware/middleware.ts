import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { RoleType } from "../models/user";

const blacklistedTokens: String[] = [];

interface CustomRequest extends Request {
  role?: string;
  email?: string;
}

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  if (checkBlacklist(token)) {
    return res.status(401).json({ message: "Invalid token" });
  }
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};
const fetchRole = (req: CustomRequest, res: Response, next: NextFunction) => {
  const role: string = (req.query.role as RoleType) || "user";
  const email: string = (req.query.email as string) || "dummy123@gmail.com";
  req.role = role;
  req.email = email;

  next();
};

const validateQuery = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const checkBlacklist = (token: string) => {
  if (blacklistedTokens.includes(token)) {
    return true;
  } else {
    return false;
  }
};

export {
  authenticateJWT,
  validateQuery,
  checkBlacklist,
  blacklistedTokens,
  fetchRole,
};
