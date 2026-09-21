import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import TestType from "@/models/TestType";
import { createTestTypeSchema } from "@/lib/validators/test";

export async function GET() {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const testTypes = await TestType.find().sort({ name: 1 });
  return NextResponse.json({ testTypes });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createTestTypeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  const existing = await TestType.findOne({ name: parsed.data.name });
  if (existing) {
    return NextResponse.json({ error: "This test type already exists" }, { status: 409 });
  }

  const testType = await TestType.create(parsed.data);
  return NextResponse.json({ testType }, { status: 201 });
}
