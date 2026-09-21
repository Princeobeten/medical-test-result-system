"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { TestStatusBadge } from "./test-status-badge";
import type { TestRecordDTO } from "@/lib/types";

export function TestList({ basePath, showConductedBy }: { basePath: string; showConductedBy?: boolean }) {
  const [tests, setTests] = useState<TestRecordDTO[] | null>(null);

  useEffect(() => {
    fetch("/api/tests")
      .then((res) => res.json())
      .then((data) => setTests(data.tests ?? []));
  }, []);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Test Type</TableHead>
            {showConductedBy && <TableHead>Conducted By</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tests === null &&
            Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={showConductedBy ? 6 : 5}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              </TableRow>
            ))}
          {tests?.length === 0 && (
            <TableRow>
              <TableCell colSpan={showConductedBy ? 6 : 5} className="text-center text-muted-foreground">
                No test records yet.
              </TableCell>
            </TableRow>
          )}
          {tests?.map((t) => (
            <TableRow key={t._id}>
              <TableCell className="font-medium">
                {t.patient?.fullName}{" "}
                <span className="text-xs text-muted-foreground">({t.patient?.patientId})</span>
              </TableCell>
              <TableCell>{t.testType?.name}</TableCell>
              {showConductedBy && <TableCell>{t.conductedBy?.name}</TableCell>}
              <TableCell>
                <TestStatusBadge status={t.status} />
              </TableCell>
              <TableCell>{new Date(t.createdAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" render={<Link href={`${basePath}/${t._id}`} />}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
