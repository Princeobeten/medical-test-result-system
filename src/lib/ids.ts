import crypto from "crypto";
import Patient from "@/models/Patient";

export async function generatePatientId() {
  const count = await Patient.countDocuments();
  const next = count + 1;
  return `PT-${String(next).padStart(5, "0")}`;
}

export function generateAccessToken() {
  return crypto.randomBytes(24).toString("hex");
}
