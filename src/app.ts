import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { authRouter } from "./routes/authRouter";
import { profileRouter } from "./routes/profileRouter";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./public/swagger/swagger";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import "./passportConfig";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_KEY || "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/auth");

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on("error", (error) => {
  console.error("Server error:", error);
});
