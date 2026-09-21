import { requireRole } from "@/lib/session";
import { connectDB } from "@/lib/db";
import TestRecord from "@/models/TestRecord";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TechnologistDashboard() {
  const session = await requireRole("technologist");

  await connectDB();
  const [pending, processing, completed, sent] = await Promise.all([
    TestRecord.countDocuments({ conductedBy: session.user.id, status: "pending" }),
    TestRecord.countDocuments({ conductedBy: session.user.id, status: "processing" }),
    TestRecord.countDocuments({ conductedBy: session.user.id, status: "completed" }),
    TestRecord.countDocuments({ conductedBy: session.user.id, status: "sent" }),
  ]);

  const stats = [
    { label: "Pending", value: pending },
    { label: "Processing", value: processing },
    { label: "Awaiting Send", value: completed },
    { label: "Sent", value: sent },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {session.user.name}</h1>
        <p className="text-sm text-muted-foreground">Here&apos;s a summary of your test activity.</p>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
