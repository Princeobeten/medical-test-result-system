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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createTestTypeSchema } from "@/lib/validators/test";
import { z } from "zod";
import { Plus } from "lucide-react";
import type { TestTypeDTO } from "@/lib/types";

type FormValues = z.infer<typeof createTestTypeSchema>;

export function AddTestTypeDialog({ onCreated }: { onCreated: (testType: TestTypeDTO) => void }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(createTestTypeSchema) });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const res = await fetch("/api/test-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to add test type");
      return;
    }

    const data = await res.json();
    toast.success("Test type added");
    reset();
    setOpen(false);
    onCreated(data.testType);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button type="button" variant="outline" size="sm" className="gap-2" />}>
        <Plus className="size-4" />
        New Test Type
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Test Type</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tt-name">Name</Label>
            <Input id="tt-name" placeholder="e.g. Full Blood Count" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tt-description">Description (optional)</Label>
            <Input id="tt-description" {...register("description")} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Test Type"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
