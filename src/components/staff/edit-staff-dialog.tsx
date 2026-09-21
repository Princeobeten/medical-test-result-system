"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { updateStaffSchema } from "@/lib/validators/staff";
import { z } from "zod";
import type { StaffRow } from "./staff-table";

type FormValues = z.infer<typeof updateStaffSchema>;

export function EditStaffDialog({
  staff,
  open,
  onOpenChange,
  onUpdated,
}: {
  staff: StaffRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(updateStaffSchema),
    values: { name: staff.name, phone: staff.phone ?? "", isActive: staff.isActive },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const payload = { ...values };
    if (!payload.password) delete payload.password;

    const res = await fetch(`/api/staff/${staff._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to update staff account");
      return;
    }

    toast.success("Staff account updated");
    reset();
    onOpenChange(false);
    onUpdated();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Staff — {staff.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Full Name</Label>
            <Input id="edit-name" {...register("name")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-phone">Phone</Label>
            <Input id="edit-phone" {...register("phone")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-password">New Password (optional)</Label>
            <Input id="edit-password" type="password" {...register("password")} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} className="size-4" />
            Account active
          </label>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
