import { z } from "zod";

export const conductTestSchema = z.object({
  patientId: z.string().trim().min(1, "Select a patient"),
  testTypeId: z.string().trim().min(1, "Select a test type"),
  notes: z.string().trim().optional(),
});

export const resultParameterSchema = z.object({
  parameter: z.string().trim().min(1, "Required"),
  value: z.string().trim().min(1, "Required"),
  unit: z.string().trim().optional(),
  normalRange: z.string().trim().optional(),
  flag: z.enum(["normal", "low", "high", "critical"]).default("normal"),
});

export const processTestSchema = z.object({
  results: z.array(resultParameterSchema).min(1, "Add at least one result parameter"),
  notes: z.string().trim().optional(),
});

export const createTestTypeSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  description: z.string().trim().optional(),
});

export const verifyResultAccessSchema = z.object({
  lastName: z.string().trim().min(1, "Required"),
  dateOfBirth: z.string().trim().min(1, "Required"),
});
