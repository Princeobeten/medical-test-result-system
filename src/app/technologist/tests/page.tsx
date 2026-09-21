import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TestList } from "@/components/tests/test-list";
import { PlusCircle } from "lucide-react";

export default function TechnologistTestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Tests</h1>
          <p className="text-sm text-muted-foreground">Tests you have conducted.</p>
        </div>
        <Button className="gap-2" render={<Link href="/technologist/tests/new" />}>
          <PlusCircle className="size-4" />
          Conduct Test
        </Button>
      </div>
      <TestList basePath="/technologist/tests" />
    </div>
  );
}
