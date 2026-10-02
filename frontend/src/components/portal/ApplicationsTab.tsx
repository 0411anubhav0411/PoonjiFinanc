import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_OPTIONS } from "@/data/content";
import type { PortalApp } from "@/lib/types";

const APP_STEPS = [
  { id: "submitted", label: "Application Submitted" },
  { id: "documents_pending", label: "Documents Pending" },
  { id: "under_review", label: "Documents Under Review" },
  { id: "processing", label: "File Under Processing" },
  { id: "with_institution", label: "Submitted to Institution" },
  { id: "assessment", label: "Under Assessment" },
  { id: "decision", label: "Decision / Further Requirement" },
  { id: "completed", label: "Completed / Closed" },
];

function Stepper({ status }: { status: string }) {
  const idx = Math.max(0, APP_STEPS.findIndex((s) => s.id === status));
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1" data-testid="app-stepper">
      {APP_STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center gap-1">
          <span className={`h-2 w-2 rounded-full ${i <= idx ? "bg-blue-700" : "bg-slate-300"}`} title={s.label} />
          {i < APP_STEPS.length - 1 && <span className={`h-px w-3 ${i < idx ? "bg-blue-700" : "bg-slate-300"}`} />}
        </div>
      ))}
      <span className="ml-2 text-xs font-semibold text-blue-800">{APP_STEPS[idx]?.label ?? status}</span>
    </div>
  );
}

export function ApplicationsTab() {
  const qc = useQueryClient();
  const apps = useQuery({ queryKey: ["portal-apps"], queryFn: () => apiGet<PortalApp[]>("/portal/applications") });
  const [form, setForm] = useState({ product: SERVICE_OPTIONS[0], amount: "", tenure: "", employment: "Salaried", income: "", city: "", notes: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/portal/applications", {
        ...form,
        amount: form.amount || undefined,
        tenure: form.tenure || undefined,
        income: form.income || undefined,
        city: form.city || undefined,
        notes: form.notes || undefined,
      });
      toast.success("Application submitted", { description: "Our team will review and update the status here." });
      setForm({ product: SERVICE_OPTIONS[0], amount: "", tenure: "", employment: "Salaried", income: "", city: "", notes: "" });
      qc.invalidateQueries({ queryKey: ["portal-apps"] });
    } catch {
      toast.error("Could not submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={submit} className="glass-card grid content-start gap-4 rounded-3xl p-6" data-testid="app-create-form">
        <h2 className="font-heading text-lg font-bold">Start a New Application</h2>
        <div className="grid gap-1.5">
          <label htmlFor="app-product" className="text-xs font-medium text-muted-foreground">Product</label>
          <select id="app-product" data-testid="app-product" className="pf-select" value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
            {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input data-testid="app-amount" placeholder="Amount (e.g. ₹25,00,000)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-secondary/60" />
          <Input data-testid="app-tenure" placeholder="Preferred tenure (e.g. 15 yrs)" value={form.tenure} onChange={(e) => setForm({ ...form, tenure: e.target.value })} className="bg-secondary/60" />
          <select data-testid="app-employment" className="pf-select" value={form.employment} onChange={(e) => setForm({ ...form, employment: e.target.value })}>
            <option>Salaried</option>
            <option>Self-Employed / Business</option>
            <option>Professional</option>
          </select>
          <Input data-testid="app-income" placeholder="Monthly income" value={form.income} onChange={(e) => setForm({ ...form, income: e.target.value })} className="bg-secondary/60" />
        </div>
        <Input data-testid="app-city" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-secondary/60" />
        <Textarea data-testid="app-notes" placeholder="Anything we should know? (optional)" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-secondary/60" />
        <Button data-testid="app-submit" type="submit" disabled={loading}>{loading ? "Submitting…" : "Submit Application"}</Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your document vault is automatically linked — no need to re-upload documents already verified. Approval, pricing and final terms are decided by the respective financial institution.
        </p>
      </form>

      <div data-testid="app-list">
        <h2 className="font-heading text-lg font-bold">Your Applications ({apps.data?.length ?? 0})</h2>
        {apps.data?.length === 0 && (
          <p className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground" data-testid="app-empty">
            No applications yet. Start one on the left.
          </p>
        )}
        <div className="mt-4 grid gap-3">
          {(apps.data ?? []).map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5" data-testid={`app-row-${a.id.slice(0, 8)}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-heading text-base font-bold">{a.product}</p>
                <span className="font-mono text-xs text-muted-foreground">PF-{a.id.slice(0, 8).toUpperCase()}</span>
              </div>
              {a.amount && <p className="mt-1 text-sm text-muted-foreground">{a.amount}{a.tenure ? ` · ${a.tenure}` : ""}{a.city ? ` · ${a.city}` : ""}</p>}
              <Stepper status={a.status} />
              {a.note && <p className="mt-2 text-xs text-amber-700">Note from Poonji: {a.note}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
