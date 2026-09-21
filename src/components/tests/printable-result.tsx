import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TestRecordDTO } from "@/lib/types";

export function PrintableResult({ test }: { test: TestRecordDTO }) {
  return (
    <div className="mx-auto max-w-3xl space-y-6 rounded-md border bg-background p-8 print:border-none print:p-0">
      <div className="border-b pb-4 text-center">
        <h1 className="text-lg font-bold">CRUTECH (UNICROSS) MEDICAL CENTER</h1>
        <p className="text-sm text-muted-foreground">Medical Test Result Report</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Patient Name</p>
          <p className="font-medium">{test.patient.fullName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Patient ID</p>
          <p className="font-medium">{test.patient.patientId}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date of Birth</p>
          <p className="font-medium">{new Date(test.patient.dateOfBirth).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Gender</p>
          <p className="font-medium capitalize">{test.patient.gender}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Test Type</p>
          <p className="font-medium">{test.testType.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Conducted By</p>
          <p className="font-medium">{test.conductedBy?.name}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Date</p>
          <p className="font-medium">{new Date(test.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Status</p>
          <p className="font-medium capitalize">{test.status}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">Results</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parameter</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Normal Range</TableHead>
              <TableHead>Flag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {test.results.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No results recorded yet.
                </TableCell>
              </TableRow>
            )}
            {test.results.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.parameter}</TableCell>
                <TableCell>{r.value}</TableCell>
                <TableCell>{r.unit || "—"}</TableCell>
                <TableCell>{r.normalRange || "—"}</TableCell>
                <TableCell className="capitalize">{r.flag}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {test.notes && (
        <div>
          <h2 className="mb-1 text-sm font-semibold">Notes</h2>
          <p className="text-sm">{test.notes}</p>
        </div>
      )}
    </div>
  );
}
