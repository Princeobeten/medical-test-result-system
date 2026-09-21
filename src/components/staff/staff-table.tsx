"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddStaffDialog } from "./add-staff-dialog";
import { EditStaffDialog } from "./edit-staff-dialog";

export type StaffRow = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "technologist";
  phone?: string;
  isActive: boolean;
};

export function StaffTable() {
  const [staff, setStaff] = useState<StaffRow[] | null>(null);
  const [editing, setEditing] = useState<StaffRow | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetch("/api/staff")
      .then((res) => res.json())
      .then((data) => setStaff(data.staff ?? []));
  }, [refreshKey]);

  const reload = () => setRefreshKey((key) => key + 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Staff</h1>
          <p className="text-sm text-muted-foreground">Manage admin and technologist accounts.</p>
        </div>
        <AddStaffDialog onCreated={reload} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff === null &&
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}
            {staff?.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No staff accounts yet.
                </TableCell>
              </TableRow>
            )}
            {staff?.map((s) => (
              <TableRow key={s._id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{s.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {s.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={s.isActive ? "default" : "secondary"}>
                    {s.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => setEditing(s)}>
                    Modify
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editing && (
        <EditStaffDialog
          staff={editing}
          open={!!editing}
          onOpenChange={(open) => !open && setEditing(null)}
          onUpdated={reload}
        />
      )}
    </div>
  );
}
