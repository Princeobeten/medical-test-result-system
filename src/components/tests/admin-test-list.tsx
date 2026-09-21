"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TestStatusBadge } from "./test-status-badge";
import { Share2, Printer } from "lucide-react";
import type { TestRecordDTO } from "@/lib/types";

export function AdminTestList() {
  const [tests, setTests] = useState<TestRecordDTO[] | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/tests")
      .then((res) => res.json())
      .then((data) => setTests(data.tests ?? []));
  }, []);

  const filtered = tests?.filter((t) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      t.patient?.fullName?.toLowerCase().includes(q) ||
      t.patient?.patientId?.toLowerCase().includes(q) ||
      t.testType?.name?.toLowerCase().includes(q)
    );
  });

  function handleShare(test: TestRecordDTO) {
    if (!test.accessToken) {
      toast.error("This result hasn't been sent yet");
      return;
    }
    const link = `${window.location.origin}/results/view/${test.accessToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Result link copied to clipboard");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tests</h1>
          <p className="text-sm text-muted-foreground">
            View, share, and print all test records across staff.
          </p>
        </div>
      </div>

      <Input
        placeholder="Search by patient, patient ID, or test type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Test Type</TableHead>
              <TableHead>Conducted By</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests === null &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {filtered?.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No test records found.
                </TableCell>
              </TableRow>
            )}
            {filtered?.map((t) => (
              <TableRow key={t._id}>
                <TableCell className="font-medium">
                  {t.patient?.fullName}{" "}
                  <span className="text-xs text-muted-foreground">({t.patient?.patientId})</span>
                </TableCell>
                <TableCell>{t.testType?.name}</TableCell>
                <TableCell>{t.conductedBy?.name}</TableCell>
                <TableCell>
                  <TestStatusBadge status={t.status} />
                </TableCell>
                <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleShare(t)} title="Share">
                    <Share2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Print"
                    render={<Link href={`/admin/tests/${t._id}`} />}
                  >
                    <Printer className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
