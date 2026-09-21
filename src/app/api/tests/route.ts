import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import TestRecord from "@/models/TestRecord";
import { conductTestSchema } from "@/lib/validators/test";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = req.nextUrl.searchParams.get("status");

  await connectDB();

  const filter: Record<string, unknown> = {};
  if (session.user.role === "technologist") {
    filter.conductedBy = session.user.id;
  }
  if (status) filter.status = status;

  const tests = await TestRecord.find(filter)
    .populate("patient")
    .populate("testType")
    .populate("conductedBy", "name")
    .populate("processedBy", "name")
    .sort({ createdAt: -1 });

  return NextResponse.json({ tests });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session?.user.role !== "technologist") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = conductTestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  const test = await TestRecord.create({
    patient: parsed.data.patientId,
    testType: parsed.data.testTypeId,
    conductedBy: session.user.id,
    notes: parsed.data.notes,
    status: "pending",
  });

  return NextResponse.json({ test }, { status: 201 });
}
