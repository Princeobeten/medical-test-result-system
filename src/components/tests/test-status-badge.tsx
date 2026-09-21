import { Badge } from "@/components/ui/badge";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  completed: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  sent: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  completed: "Completed",
  sent: "Sent",
};

export function TestStatusBadge({ status }: { status: string }) {
  return (
    <Badge className={STATUS_STYLES[status] ?? ""} variant="outline">
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
