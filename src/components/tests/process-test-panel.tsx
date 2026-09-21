"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TestStatusBadge } from "./test-status-badge";
import { Plus, Trash2, Copy } from "lucide-react";
import type { TestRecordDTO } from "@/lib/types";

export function ProcessTestPanel({ initialTest }: { initialTest: TestRecordDTO }) {
  const router = useRouter();
  const [test, setTest] = useState(initialTest);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const readOnly = test.status === "sent";

  const { register, control, handleSubmit } = useForm<{
    results: TestRecordDTO["results"];
    notes: string;
  }>({
    defaultValues: {
      results: test.results.length
        ? test.results
        : [{ parameter: "", value: "", unit: "", normalRange: "", flag: "normal" }],
      notes: test.notes ?? "",
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "results" });

  async function onSave(values: { results: TestRecordDTO["results"]; notes: string }) {
    setIsSaving(true);
    const res = await fetch(`/api/tests/${test._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setIsSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to save results");
      return;
    }

    const data = await res.json();
    setTest((prev) => ({ ...prev, ...data.test }));
    toast.success("Results saved");
    router.refresh();
  }

  async function handleSend() {
    setIsSending(true);
    const res = await fetch(`/api/tests/${test._id}/send`, { method: "POST" });
    setIsSending(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to send result");
      return;
    }

    const data = await res.json();
    setTest((prev) => ({ ...prev, status: "sent", accessToken: data.test.accessToken }));
    toast.success("Result sent");
    router.refresh();
  }

  const resultLink =
    typeof window !== "undefined" && test.accessToken
      ? `${window.location.origin}/results/view/${test.accessToken}`
      : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {test.patient.fullName}{" "}
            <span className="text-base font-normal text-muted-foreground">
              ({test.patient.patientId})
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">{test.testType.name}</p>
        </div>
        <TestStatusBadge status={test.status} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Patient Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Date of Birth</p>
            <p>{new Date(test.patient.dateOfBirth).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Gender</p>
            <p className="capitalize">{test.patient.gender}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p>{test.patient.phone || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p>{test.patient.email || "—"}</p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSave)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Results</CardTitle>
            {!readOnly && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  append({ parameter: "", value: "", unit: "", normalRange: "", flag: "normal" })
                }
              >
                <Plus className="size-4" />
                Add Parameter
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 items-end gap-2">
                <div className="col-span-3 space-y-1">
                  {index === 0 && <Label className="text-xs">Parameter</Label>}
                  <Input
                    disabled={readOnly}
                    placeholder="e.g. Hemoglobin"
                    {...register(`results.${index}.parameter` as const)}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  {index === 0 && <Label className="text-xs">Value</Label>}
                  <Input disabled={readOnly} {...register(`results.${index}.value` as const)} />
                </div>
                <div className="col-span-2 space-y-1">
                  {index === 0 && <Label className="text-xs">Unit</Label>}
                  <Input disabled={readOnly} {...register(`results.${index}.unit` as const)} />
                </div>
                <div className="col-span-2 space-y-1">
                  {index === 0 && <Label className="text-xs">Normal Range</Label>}
                  <Input
                    disabled={readOnly}
                    {...register(`results.${index}.normalRange` as const)}
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  {index === 0 && <Label className="text-xs">Flag</Label>}
                  <Controller
                    control={control}
                    name={`results.${index}.flag` as const}
                    render={({ field: flagField }) => (
                      <Select
                        disabled={readOnly}
                        value={flagField.value}
                        onValueChange={flagField.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {!readOnly && (
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" disabled={readOnly} {...register("notes")} />
            </div>

            {!readOnly && (
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Results"}
              </Button>
            )}
          </CardContent>
        </Card>
      </form>

      {test.status === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Send Result</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              Sending generates a secure link the patient can use to view this result.
            </p>
            <Button onClick={handleSend} disabled={isSending}>
              {isSending ? "Sending..." : "Send Result"}
            </Button>
          </CardContent>
        </Card>
      )}

      {test.status === "sent" && resultLink && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Result Link</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <Input readOnly value={resultLink} />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                navigator.clipboard.writeText(resultLink);
                toast.success("Link copied");
              }}
            >
              <Copy className="size-4" />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
