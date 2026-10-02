import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";

export function OverviewTab() {
  const q = useQuery({ queryKey: ["admin-overview"], queryFn: () => apiGet<Record<string, number>>("/admin/overview") });

  const cards = [
    { label: "Registered Customers", value: q.data?.customers, sub: `+${q.data?.customers_new ?? 0} this week`, testid: "ov-customers" },
    { label: "Portal Applications", value: q.data?.portal_applications, sub: `${q.data?.portal_applications_open ?? 0} open`, testid: "ov-apps" },
    { label: "Documents in Vaults", value: q.data?.documents, sub: `${q.data?.documents_pending ?? 0} pending review`, testid: "ov-docs" },
    { label: "Partners", value: q.data?.partners, sub: `${q.data?.partners_pending ?? 0} awaiting approval`, testid: "ov-partners" },
    { label: "Website Enquiries", value: q.data?.enquiries, sub: `${q.data?.callbacks ?? 0} callback requests`, testid: "ov-enquiries" },
    { label: "Job Applications", value: q.data?.job_applications, testid: "ov-jobs" },
    { label: "Published Rates", value: q.data?.rates, testid: "ov-rates" },
    { label: "Finance Updates", value: q.data?.updates, testid: "ov-updates" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="admin-overview">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border bg-card p-6" data-testid={c.testid}>
          <p className="font-heading text-3xl font-bold tracking-tight text-blue-800">{c.value ?? "—"}</p>
          <p className="mt-1.5 text-sm font-medium">{c.label}</p>
          {c.sub && <p className="mt-0.5 text-xs text-muted-foreground">{c.sub}</p>}
        </div>
      ))}
    </div>
  );
}
