import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import TestRecord from "@/models/TestRecord";
import { PrintableResult } from "@/components/tests/printable-result";
import { PrintButton } from "@/components/tests/print-button";
import type { TestRecordDTO } from "@/lib/types";

export default async function AdminTestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await connectDB();
  const test = await TestRecord.findById(id)
    .populate("patient")
    .populate("testType")
    .populate("conductedBy", "name")
    .populate("processedBy", "name")
    .lean();

  if (!test) notFound();

  const serialized: TestRecordDTO = JSON.parse(JSON.stringify(test));

  return (
    <div className="space-y-4">
      <div className="flex justify-end print:hidden">
        <PrintButton />
      </div>
      <PrintableResult test={serialized} />
    </div>
  );
}
