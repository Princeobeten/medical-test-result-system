import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Patient from "@/models/Patient";
import TestRecord from "@/models/TestRecord";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboard() {
  await connectDB();

  const [staffCount, patientCount, pendingCount, completedCount, sentCount] = await Promise.all([
    User.countDocuments(),
    Patient.countDocuments(),
    TestRecord.countDocuments({ status: { $in: ["pending", "processing"] } }),
    TestRecord.countDocuments({ status: "completed" }),
    TestRecord.countDocuments({ status: "sent" }),
  ]);

  const stats = [
    { label: "Staff Accounts", value: staffCount },
    { label: "Patients", value: patientCount },
    { label: "Tests In Progress", value: pendingCount },
    { label: "Awaiting Send", value: completedCount },
    { label: "Results Sent", value: sentCount },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of staff, patients, and test activity.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
