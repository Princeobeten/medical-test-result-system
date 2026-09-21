import { ResultAccessGate } from "@/components/results/result-access-gate";

export default async function ResultViewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ResultAccessGate token={token} />;
}
