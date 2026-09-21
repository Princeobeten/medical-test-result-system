import { z } from "zod";

export const createStaffSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "technologist"]),
  phone: z.string().trim().optional(),
});

export const updateStaffSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

export const updateOwnAccountSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional(),
  password: z.string().min(6).optional(),
});
