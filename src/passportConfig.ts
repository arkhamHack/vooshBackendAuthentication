import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github";
import User, { IUser, RoleType } from "./models/user";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Provider } from "./models/user";
import jwt from "jsonwebtoken";

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "client-secret",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ userId: profile.id });

        if (!user) {
          user = new User({
            userId: profile.id,
            username: profile.displayName,
            email: profile?.emails?.[0]?.value || "",
            password: await bcrypt.hash(
              profile?.emails?.[0]?.value || profile.id,
              10
            ),
            provider: Provider.GOOGLE,
            role: (profile as any).role || RoleType.USER,
          });
          await user.save();
        }
        const token = jwt.sign(
          { userId: user.userId },
          process.env.JWT_SECRET || "jwt-secret"
        );
        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "client-secret",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "callback-url",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ userId: profile.id });
        if (!user) {
          user = await User.create({
            userId: profile.id,
            username: profile.username,
            email: profile?.emails?.[0].value || undefined,
            password: await bcrypt.hash(
              profile?.emails?.[0]?.value || profile.id,
              10
            ),
            provider: Provider.GITHUB,
            role: (profile as any).role || RoleType.USER,
          });
        }
        const token = jwt.sign(
          { userId: user.userId },
          process.env.JWT_SECRET || "jwt-secret"
        );
        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);
