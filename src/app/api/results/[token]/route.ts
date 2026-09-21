import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TestRecord from "@/models/TestRecord";
import { verifyResultAccessSchema } from "@/lib/validators/test";

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await req.json();
  const parsed = verifyResultAccessSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  const test = await TestRecord.findOne({ accessToken: token, status: "sent" })
    .populate("patient")
    .populate("testType");

  if (!test) {
    return NextResponse.json({ error: "This result link is invalid or has expired" }, { status: 404 });
  }

  const patient = test.patient as unknown as {
    fullName: string;
    dateOfBirth: Date;
  };

  const lastNameMatches = patient.fullName
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .includes(parsed.data.lastName.trim().toLowerCase());

  const dobMatches =
    new Date(patient.dateOfBirth).toISOString().slice(0, 10) === parsed.data.dateOfBirth;

  if (!lastNameMatches || !dobMatches) {
    return NextResponse.json({ error: "Details do not match our records" }, { status: 403 });
  }

  return NextResponse.json({ test });
}
