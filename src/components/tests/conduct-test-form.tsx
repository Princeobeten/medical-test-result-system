"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddPatientDialog } from "@/components/patients/add-patient-dialog";
import { AddTestTypeDialog } from "@/components/test-types/add-test-type-dialog";
import type { PatientDTO, TestTypeDTO } from "@/lib/types";

export function ConductTestForm() {
  const router = useRouter();
  const [patients, setPatients] = useState<PatientDTO[]>([]);
  const [testTypes, setTestTypes] = useState<TestTypeDTO[]>([]);
  const [search, setSearch] = useState("");
  const [patientId, setPatientId] = useState("");
  const [testTypeId, setTestTypeId] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/test-types")
      .then((res) => res.json())
      .then((data) => setTestTypes(data.testTypes ?? []));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetch(`/api/patients?q=${encodeURIComponent(search)}`)
        .then((res) => res.json())
        .then((data) => setPatients(data.patients ?? []));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!patientId || !testTypeId) {
      toast.error("Select a patient and a test type");
      return;
    }

    setIsSubmitting(true);
    const res = await fetch("/api/tests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, testTypeId, notes }),
    });
    setIsSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "Failed to create test record");
      return;
    }

    const data = await res.json();
    toast.success("Test record created");
    router.push(`/technologist/tests/${data.test._id}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Conduct Test</h1>
        <p className="text-sm text-muted-foreground">
          Select a patient and test type to open a new test record.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Patient</CardTitle>
            <AddPatientDialog
              onCreated={(patient) => {
                setPatients((prev) => [patient, ...prev]);
                setPatientId(patient._id);
              }}
            />
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Search patients by name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="max-h-64 space-y-1 overflow-y-auto rounded-md border p-1">
              {patients.length === 0 && (
                <p className="p-2 text-sm text-muted-foreground">No patients found.</p>
              )}
              {patients.map((p) => (
                <button
                  type="button"
                  key={p._id}
                  onClick={() => setPatientId(p._id)}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    patientId === p._id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  }`}
                >
                  <span className="font-medium">{p.fullName}</span>{" "}
                  <span className="text-xs opacity-70">({p.patientId})</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Test Details</CardTitle>
            <AddTestTypeDialog
              onCreated={(testType) => {
                setTestTypes((prev) => [...prev, testType]);
                setTestTypeId(testType._id);
              }}
            />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select
                items={Object.fromEntries(testTypes.map((t) => [t._id, t.name]))}
                value={testTypeId}
                onValueChange={(v) => setTestTypeId(v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a test type" />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((t) => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Creating..." : "Start Test Record"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
