import "dotenv/config";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/lib/db";
import User from "../src/models/User";
import mongoose from "mongoose";

const ADMIN_EMAIL = "admin@example.com";

async function seed() {
  await connectDB();

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin account already exists (${ADMIN_EMAIL}). Nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const password = crypto.randomBytes(6).toString("base64url");
  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    name: "System Administrator",
    email: ADMIN_EMAIL,
    passwordHash,
    role: "admin",
    isActive: true,
  });

  console.log("Bootstrap admin account created:");
  console.log(`  email:    ${ADMIN_EMAIL}`);
  console.log(`  password: ${password}`);
  console.log("Log in and change this password immediately (this is only printed once).");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
