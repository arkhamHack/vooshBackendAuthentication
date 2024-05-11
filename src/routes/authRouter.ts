import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  updateEmail,
  updatePassword,
  authCallback,
} from "../controller/authController";
import { authenticateJWT, fetchRole } from "../middleware/middleware";
import passport from "passport";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", authenticateJWT, logoutUser);

router.put("/update-email", authenticateJWT, updateEmail);

router.put("/update-password", authenticateJWT, updatePassword);
router.get(
  "/google",
  // fetchRole,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/callback", passport.authenticate("google"), authCallback);

router.get(
  "/github",
  // fetchRole,
  passport.authenticate("github", {
    scope: ["profile", "email"],
    failureRedirect: "/api-docs",
    successRedirect: "/",
  })
);

router.get("/github/callback", passport.authenticate("github"), authCallback);

export { router as authRouter };
