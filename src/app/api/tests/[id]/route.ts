import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import TestRecord from "@/models/TestRecord";
import { processTestSchema } from "@/lib/validators/test";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();

  const test = await TestRecord.findById(id)
    .populate("patient")
    .populate("testType")
    .populate("conductedBy", "name")
    .populate("processedBy", "name");

  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (session.user.role === "technologist" && test.conductedBy?._id.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ test });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.user.role !== "technologist") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = processTestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  const existing = await TestRecord.findById(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.conductedBy.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  existing.results = parsed.data.results;
  if (parsed.data.notes !== undefined) existing.notes = parsed.data.notes;
  existing.processedBy = session.user.id as unknown as typeof existing.processedBy;
  existing.status = "completed";
  await existing.save();

  return NextResponse.json({ test: existing });
}
