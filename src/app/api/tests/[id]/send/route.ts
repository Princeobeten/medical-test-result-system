import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import TestRecord from "@/models/TestRecord";
import { generateAccessToken } from "@/lib/ids";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.user.role !== "technologist") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();

  const test = await TestRecord.findById(id);
  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (test.conductedBy.toString() !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (test.status !== "completed") {
    return NextResponse.json({ error: "Only completed tests can be sent" }, { status: 400 });
  }

  test.accessToken = generateAccessToken();
  test.status = "sent";
  test.sentAt = new Date();
  await test.save();

  return NextResponse.json({ test, link: `/results/view/${test.accessToken}` });
}
