import { Schema, model, models, type InferSchemaType } from "mongoose";

const PatientSchema = new Schema(
  {
    patientId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: { type: String, trim: true },
  },
  { timestamps: true }
);

PatientSchema.index({ fullName: "text" });

export type Patient = InferSchemaType<typeof PatientSchema>;

export default models.Patient ?? model("Patient", PatientSchema);
