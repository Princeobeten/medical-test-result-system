import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import Patient from "@/models/Patient";
import { createPatientSchema } from "@/lib/validators/patient";
import { generatePatientId } from "@/lib/ids";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim();

  await connectDB();
  const filter = q
    ? { $or: [{ fullName: { $regex: q, $options: "i" } }, { patientId: { $regex: q, $options: "i" } }] }
    : {};

  const patients = await Patient.find(filter).sort({ createdAt: -1 }).limit(50);
  return NextResponse.json({ patients });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createPatientSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const patientId = await generatePatientId();
      const patient = await Patient.create({
        ...parsed.data,
        email: parsed.data.email || undefined,
        patientId,
      });
      return NextResponse.json({ patient }, { status: 201 });
    } catch (err: unknown) {
      const isDuplicateKey = (err as { code?: number })?.code === 11000;
      if (isDuplicateKey && attempt < 2) continue;
      return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Failed to create patient" }, { status: 500 });
}
