import { Schema, model, models, type InferSchemaType } from "mongoose";

const ResultParameterSchema = new Schema(
  {
    parameter: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    unit: { type: String, trim: true },
    normalRange: { type: String, trim: true },
    flag: {
      type: String,
      enum: ["normal", "low", "high", "critical"],
      default: "normal",
    },
  },
  { _id: false }
);

const TestRecordSchema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "Patient", required: true },
    testType: { type: Schema.Types.ObjectId, ref: "TestType", required: true },
    conductedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "sent"],
      default: "pending",
    },
    results: { type: [ResultParameterSchema], default: [] },
    notes: { type: String, trim: true },
    accessToken: { type: String, unique: true, sparse: true },
    sentAt: { type: Date },
  },
  { timestamps: true }
);

export type TestRecord = InferSchemaType<typeof TestRecordSchema>;

export default models.TestRecord ?? model("TestRecord", TestRecordSchema);
