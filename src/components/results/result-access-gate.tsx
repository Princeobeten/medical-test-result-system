"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifyResultAccessSchema } from "@/lib/validators/test";
import { z } from "zod";
import { PrintableResult } from "@/components/tests/printable-result";
import { PrintButton } from "@/components/tests/print-button";
import type { TestRecordDTO } from "@/lib/types";

type FormValues = z.infer<typeof verifyResultAccessSchema>;

export function ResultAccessGate({ token }: { token: string }) {
  const [test, setTest] = useState<TestRecordDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(verifyResultAccessSchema) });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    const res = await fetch(`/api/results/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Unable to verify your details");
      return;
    }

    const data = await res.json();
    setTest(data.test);
  }

  if (test) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="flex justify-end print:hidden">
          <PrintButton />
        </div>
        <PrintableResult test={test} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>View Your Test Result</CardTitle>
          <CardDescription>
            Confirm your details to access this result securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
              {errors.dateOfBirth && (
                <p className="text-sm text-destructive">{errors.dateOfBirth.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "View Result"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
