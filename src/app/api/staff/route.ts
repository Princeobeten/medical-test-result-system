import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/session";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createStaffSchema } from "@/lib/validators/staff";

export async function GET() {
  const session = await getSession();
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await connectDB();
  const staff = await User.find().select("-passwordHash").sort({ createdAt: -1 });
  return NextResponse.json({ staff });
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session?.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createStaffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await connectDB();

  const existing = await User.findOne({ email: parsed.data.email.toLowerCase().trim() });
  if (existing) {
    return NextResponse.json({ error: "A staff account with this email already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await User.create({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase().trim(),
    passwordHash,
    role: parsed.data.role,
    phone: parsed.data.phone,
  });

  return NextResponse.json(
    { staff: { id: user._id, name: user.name, email: user.email, role: user.role } },
    { status: 201 }
  );
}
