import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Rate } from "@/lib/types";

const CATEGORIES = [
  ["home-loan", "Home Loan"], ["lap", "Loan Against Property"], ["personal-loan", "Personal Loan"],
  ["business-loan", "Business & MSME"], ["vehicle-loan", "Vehicle Loan"], ["education-loan", "Education Loan"],
] as const;

const EMPTY = {
  institution: "", category: "home-loan", product: "", rate_text: "",
  amount_text: "", tenure_text: "", fee_text: "", eligibility_text: "", notes: "", source: "", published: true,
};

type RateForm = typeof EMPTY;

function RateDialog({ rate, onClose }: { rate: Rate | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<RateForm>(
    rate
      ? {
          institution: rate.institution, category: rate.category, product: rate.product, rate_text: rate.rate_text,
          amount_text: rate.amount_text ?? "", tenure_text: rate.tenure_text ?? "", fee_text: rate.fee_text ?? "",
          eligibility_text: rate.eligibility_text ?? "", notes: rate.notes ?? "", source: rate.source ?? "", published: rate.published,
        }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = {
      ...form,
      amount_text: form.amount_text || undefined,
      tenure_text: form.tenure_text || undefined,
      fee_text: form.fee_text || undefined,
      eligibility_text: form.eligibility_text || undefined,
      notes: form.notes || undefined,
      source: form.source || undefined,
    };
    try {
      if (rate) {
        await apiPatch(`/admin/rates/${rate.id}`, body);
      } else {
        await apiPost("/admin/rates", body);
      }
      qc.invalidateQueries({ queryKey: ["admin-rates"] });
      toast.success(rate ? "Rate updated" : "Rate added");
      onClose();
    } catch {
      toast.error("Could not save rate");
    } finally {
      setSaving(false);
    }
  };

  const set = (k: keyof RateForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto" data-testid="rate-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{rate ? "Edit Rate" : "Add Rate"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4" data-testid="rate-form">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input data-testid="rate-institution" required placeholder="Institution (e.g. HDFC Bank)" value={form.institution} onChange={set("institution")} className="bg-secondary/60" />
            <select data-testid="rate-category" className="pf-select" value={form.category} onChange={set("category")}>
              {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <Input data-testid="rate-product" required placeholder="Product (e.g. Home Loan)" value={form.product} onChange={set("product")} className="bg-secondary/60" />
            <Input data-testid="rate-value" required placeholder="Rate (e.g. 8.40% – 9.40%)" value={form.rate_text} onChange={set("rate_text")} className="bg-secondary/60" />
            <Input data-testid="rate-amount" placeholder="Loan amount range" value={form.amount_text} onChange={set("amount_text")} className="bg-secondary/60" />
            <Input data-testid="rate-tenure" placeholder="Tenure" value={form.tenure_text} onChange={set("tenure_text")} className="bg-secondary/60" />
            <Input data-testid="rate-fee" placeholder="Processing fee" value={form.fee_text} onChange={set("fee_text")} className="bg-secondary/60" />
            <Input data-testid="rate-eligibility" placeholder="Eligibility note" value={form.eligibility_text} onChange={set("eligibility_text")} className="bg-secondary/60" />
            <Input data-testid="rate-source" placeholder="Source / reference" value={form.source} onChange={set("source")} className="bg-secondary/60 sm:col-span-2" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox data-testid="rate-published" checked={form.published} onCheckedChange={(v) => setForm((f) => ({ ...f, published: v === true }))} />
            Published (visible on website)
          </label>
          <Button data-testid="rate-save" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Rate"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function RatesTab() {
  const qc = useQueryClient();
  const rates = useQuery({ queryKey: ["admin-rates"], queryFn: () => apiGet<Rate[]>("/admin/rates") });
  const [editing, setEditing] = useState<Rate | null>(null);
  const [adding, setAdding] = useState(false);

  const remove = async (id: string) => {
    await apiDelete(`/admin/rates/${id}`);
    qc.invalidateQueries({ queryKey: ["admin-rates"] });
    toast.success("Rate removed");
  };

  const catLabel = (c: string) => CATEGORIES.find(([v]) => v === c)?.[1] ?? c;

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button data-testid="rate-add" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Add Rate
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border bg-card" data-testid="admin-rates-table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(rates.data ?? []).map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.institution}</TableCell>
                <TableCell>{catLabel(r.category)}</TableCell>
                <TableCell>{r.product}</TableCell>
                <TableCell className="font-mono text-xs">{r.rate_text}</TableCell>
                <TableCell>{r.published ? "Yes" : "Hidden"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{new Date(r.updated_at).toLocaleDateString("en-IN")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button data-testid={`rate-edit-${r.id.slice(0, 8)}`} size="icon-sm" variant="ghost" onClick={() => setEditing(r)} aria-label="Edit rate"><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button data-testid={`rate-delete-${r.id.slice(0, 8)}`} size="icon-sm" variant="ghost" onClick={() => remove(r.id)} aria-label="Delete rate"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {adding && <RateDialog rate={null} onClose={() => setAdding(false)} />}
      {editing && <RateDialog rate={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
