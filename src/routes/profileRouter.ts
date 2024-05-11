import express from "express";
import {
  getUserProfile,
  updateOrCreateUserProfile,
  getAllProfiles,
} from "../controller/profileController";
import { authenticateJWT, validateQuery } from "../middleware/middleware";
import { check } from "express-validator";

const router = express.Router();

const validateGetUserProfile = [
  check("id").optional().isMongoId(),
  check("email").optional().isEmail(),
  check("username").optional().isAlphanumeric(),
  validateQuery,
];

router.get("/user-profile", authenticateJWT, validateQuery, getUserProfile);
router.get(
  "/all-user-profiles",
  authenticateJWT,
  validateQuery,
  getAllProfiles
);
router.put(
  "/user-profile",
  authenticateJWT,
  validateQuery,
  authenticateJWT,
  updateOrCreateUserProfile
);

export { router as profileRouter };
