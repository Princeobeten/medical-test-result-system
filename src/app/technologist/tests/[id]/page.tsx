import { notFound } from "next/navigation";
import { requireRole } from "@/lib/session";
import { connectDB } from "@/lib/db";
import TestRecord from "@/models/TestRecord";
import { ProcessTestPanel } from "@/components/tests/process-test-panel";
import type { TestRecordDTO } from "@/lib/types";

export default async function TechnologistTestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireRole("technologist");
  const { id } = await params;

  await connectDB();
  const test = await TestRecord.findById(id)
    .populate("patient")
    .populate("testType")
    .populate("conductedBy", "name")
    .populate("processedBy", "name")
    .lean();

  if (!test || test.conductedBy?._id.toString() !== session.user.id) {
    notFound();
  }

  const serialized: TestRecordDTO = JSON.parse(JSON.stringify(test));

  return <ProcessTestPanel initialTest={serialized} />;
}
