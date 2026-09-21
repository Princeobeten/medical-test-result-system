import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import User from "../src/models/User";
import Patient from "../src/models/Patient";
import TestType from "../src/models/TestType";
import TestRecord from "../src/models/TestRecord";

const DEMO_PASSWORD = "Demo@12345";

async function upsertUser(email: string, name: string, role: "admin" | "technologist") {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const user = await User.findOneAndUpdate(
    { email },
    { name, email, passwordHash, role, isActive: true },
    { upsert: true, new: true }
  );
  return user;
}

async function main() {
  await connectDB();

  const admin = await upsertUser("demo.admin@example.com", "Demo Admin", "admin");
  const tech = await upsertUser("demo.tech@example.com", "Demo Technologist", "technologist");
  console.log("Demo admin:", admin.email, DEMO_PASSWORD);
  console.log("Demo technologist:", tech.email, DEMO_PASSWORD);

  const testType = await TestType.findOneAndUpdate(
    { name: "Full Blood Count" },
    { name: "Full Blood Count", description: "Complete blood count panel" },
    { upsert: true, new: true }
  );

  let patient = await Patient.findOne({ fullName: "John Adewale" });
  if (!patient) {
    const count = await Patient.countDocuments();
    patient = await Patient.create({
      patientId: `PT-${String(count + 1).padStart(5, "0")}`,
      fullName: "John Adewale",
      dateOfBirth: new Date("1998-03-12"),
      gender: "male",
      phone: "08012345678",
      email: "john.adewale@example.test",
      address: "12 Eta Agbor Road, Calabar",
    });
  }
  console.log("Demo patient:", patient.patientId, patient.fullName);

  // Sent test record (full flow demo)
  let sentTest = await TestRecord.findOne({ patient: patient._id, testType: testType._id, status: "sent" });
  if (!sentTest) {
    sentTest = await TestRecord.create({
      patient: patient._id,
      testType: testType._id,
      conductedBy: tech._id,
      processedBy: tech._id,
      status: "sent",
      notes: "Routine annual checkup",
      results: [
        { parameter: "Hemoglobin", value: "14.2", unit: "g/dL", normalRange: "13-17", flag: "normal" },
        { parameter: "White Blood Cell Count", value: "11.8", unit: "x10^9/L", normalRange: "4-11", flag: "high" },
        { parameter: "Platelet Count", value: "250", unit: "x10^9/L", normalRange: "150-400", flag: "normal" },
      ],
      accessToken: "demo1234567890abcdef1234567890abcdef12345678",
      sentAt: new Date(),
    });
  }
  console.log("Demo sent test id:", sentTest._id.toString());
  console.log("Demo result link token:", sentTest.accessToken);

  // Pending test record (to show conduct/process flow)
  let pendingPatient = await Patient.findOne({ fullName: "Grace Bassey" });
  if (!pendingPatient) {
    const count = await Patient.countDocuments();
    pendingPatient = await Patient.create({
      patientId: `PT-${String(count + 1).padStart(5, "0")}`,
      fullName: "Grace Bassey",
      dateOfBirth: new Date("2001-11-02"),
      gender: "female",
      phone: "08087654321",
      email: "grace.bassey@example.test",
      address: "5 Marian Road, Calabar",
    });
  }
  let pendingTest = await TestRecord.findOne({ patient: pendingPatient._id, status: "pending" });
  if (!pendingTest) {
    pendingTest = await TestRecord.create({
      patient: pendingPatient._id,
      testType: testType._id,
      conductedBy: tech._id,
      status: "pending",
      notes: "Follow-up test",
    });
  }
  console.log("Demo pending test id:", pendingTest._id.toString());

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
