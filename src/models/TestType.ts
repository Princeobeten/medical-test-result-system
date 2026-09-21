import { Schema, model, models, type InferSchemaType } from "mongoose";

const TestTypeSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export type TestType = InferSchemaType<typeof TestTypeSchema>;

export default models.TestType ?? model("TestType", TestTypeSchema);
