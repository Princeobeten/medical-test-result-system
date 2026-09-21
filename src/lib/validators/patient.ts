import { z } from "zod";

export const createPatientSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  dateOfBirth: z.string().trim().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"]),
  phone: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().optional(),
});
