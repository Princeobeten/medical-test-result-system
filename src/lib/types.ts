export type ResultParameter = {
  parameter: string;
  value: string;
  unit?: string;
  normalRange?: string;
  flag: "normal" | "low" | "high" | "critical";
};

export type PatientDTO = {
  _id: string;
  patientId: string;
  fullName: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone?: string;
  email?: string;
  address?: string;
};

export type TestTypeDTO = {
  _id: string;
  name: string;
  description?: string;
};

export type TestRecordDTO = {
  _id: string;
  patient: PatientDTO;
  testType: TestTypeDTO;
  conductedBy: { _id: string; name: string };
  processedBy?: { _id: string; name: string };
  status: "pending" | "processing" | "completed" | "sent";
  results: ResultParameter[];
  notes?: string;
  accessToken?: string;
  sentAt?: string;
  createdAt: string;
};
