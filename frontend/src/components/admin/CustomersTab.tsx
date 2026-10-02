import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { apiGet, apiPatch, apiPost, apiUrl } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PortalApp, PortalDoc, PortalUser } from "@/lib/types";

interface CustomerRow extends PortalUser {
  documents: number;
  applications: number;
  documents_pending: number;
}

interface CustomerFile {
  customer: PortalUser;
  documents: PortalDoc[];
  applications: PortalApp[];
  notes: { id: string; text: string; author: string; created_at: string }[];
  enquiries: { id: string; service: string; created_at: string }[];
}

const APP_STATUSES = [
  ["submitted", "Application Submitted"], ["documents_pending", "Documents Pending"],
  ["under_review", "Documents Under Review"], ["processing", "File Under Processing"],
  ["with_institution", "Submitted to Institution"], ["assessment", "Under Assessment"],
  ["decision", "Decision / Further Requirement"], ["completed", "Completed / Closed"],
] as const;

const DOC_STATUSES = [
  ["uploaded", "Uploaded"], ["under_review", "Under Review"], ["verified", "Verified"],
  ["rejected", "Rejected"], ["replacement_required", "Replacement Required"],
] as const;

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function CustomerFileDialog({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const file = useQuery({ queryKey: ["admin-customer", id], queryFn: () => apiGet<CustomerFile>(`/admin/customers/${id}`) });
  const [note, setNote] = useState("");
  const [docNotes, setDocNotes] = useState<Record<string, string>>({});
  const [appNotes, setAppNotes] = useState<Record<string, string>>({});

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-customer", id] });
    qc.invalidateQueries({ queryKey: ["admin-customers"] });
  };

  const setDocStatus = async (docId: string, status: string) => {
    await apiPatch(`/admin/documents/${docId}`, { status, note: docNotes[docId] || undefined });
    toast.success("Document status updated — customer notified");
    refresh();
  };

  const setAppStatus = async (appId: string, status: string) => {
    await apiPatch(`/admin/applications/${appId}`, { status, note: appNotes[appId] || undefined });
    toast.success("Application status updated — customer notified");
    refresh();
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    await apiPost(`/admin/customers/${id}/notes`, { text: note });
    setNote("");
    refresh();
  };

  const c = file.data?.customer;
  const p = c?.profile ?? {};

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto" data-testid="customer-file-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {c?.name ?? "…"} <span className="font-mono text-xs font-normal text-muted-foreground">PF-{id.slice(0, 8).toUpperCase()}</span>
          </DialogTitle>
        </DialogHeader>
        {!file.data && <p className="py-10 text-center text-sm text-muted-foreground">Loading customer file…</p>}
        {file.data && c && (
          <div className="grid gap-8">
            <section>
              <p className="overline-tag">Profile & KYC</p>
              <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-muted-foreground">Email</dt><dd>{c.email}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Mobile</dt><dd>{c.mobile ?? "—"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">City / State</dt><dd>{[p.city, p.state].filter(Boolean).join(", ") || "—"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Employment</dt><dd>{p.employment_type ?? "—"}{p.company ? ` · ${p.company}` : ""}</dd></div>
                <div><dt className="text-xs text-muted-foreground">Income</dt><dd>{p.income ?? "—"}</dd></div>
                <div><dt className="text-xs text-muted-foreground">PAN</dt><dd className="font-mono">{p.pan ?? "—"}</dd></div>
                <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Address</dt><dd>{[p.address, p.city, p.state, p.pin].filter(Boolean).join(", ") || "—"}</dd></div>
              </dl>
            </section>

            <section>
              <p className="overline-tag">Documents ({file.data.documents.length})</p>
              <div className="mt-3 grid gap-2">
                {file.data.documents.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded.</p>}
                {file.data.documents.map((d) => (
                  <div key={d.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center" data-testid={`admin-doc-${d.id.slice(0, 8)}`}>
                    <div>
                      <p className="text-sm font-semibold">{d.doc_type} <span className="text-xs font-normal text-muted-foreground">· {d.category}</span></p>
                      <a href={apiUrl(`/portal/documents/${d.id}/download`)} data-testid={`admin-doc-dl-${d.id.slice(0, 8)}`} className="inline-flex items-center gap-1 text-xs text-blue-800 hover:text-blue-600">
                        <Download className="h-3 w-3" /> {d.filename}
                      </a>
                    </div>
                    <Input
                      placeholder="Note for customer (optional)"
                      value={docNotes[d.id] ?? d.note ?? ""}
                      onChange={(e) => setDocNotes({ ...docNotes, [d.id]: e.target.value })}
                      className="h-8 bg-secondary/60 text-xs"
                      data-testid={`admin-doc-note-${d.id.slice(0, 8)}`}
                    />
                    <select
                      data-testid={`admin-doc-status-${d.id.slice(0, 8)}`}
                      className="pf-select h-8 w-auto text-xs"
                      value={d.status}
                      onChange={(e) => setDocStatus(d.id, e.target.value)}
                    >
                      {DOC_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="overline-tag">Applications ({file.data.applications.length})</p>
              <div className="mt-3 grid gap-2">
                {file.data.applications.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
                {file.data.applications.map((a) => (
                  <div key={a.id} className="grid gap-2 rounded-xl border border-border p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center" data-testid={`admin-app-${a.id.slice(0, 8)}`}>
                    <div>
                      <p className="text-sm font-semibold">{a.product}</p>
                      <p className="text-xs text-muted-foreground">{[a.amount, a.tenure, a.city].filter(Boolean).join(" · ") || "—"}</p>
                    </div>
                    <Input
                      placeholder="Note (optional)"
                      value={appNotes[a.id] ?? a.note ?? ""}
                      onChange={(e) => setAppNotes({ ...appNotes, [a.id]: e.target.value })}
                      className="h-8 bg-secondary/60 text-xs"
                      data-testid={`admin-app-note-${a.id.slice(0, 8)}`}
                    />
                    <select
                      data-testid={`admin-app-status-${a.id.slice(0, 8)}`}
                      className="pf-select h-8 w-auto text-xs"
                      value={a.status}
                      onChange={(e) => setAppStatus(a.id, e.target.value)}
                    >
                      {APP_STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="overline-tag">Website Enquiries ({file.data.enquiries.length})</p>
              <div className="mt-3 grid gap-1 text-sm">
                {file.data.enquiries.length === 0 && <p className="text-sm text-muted-foreground">None.</p>}
                {file.data.enquiries.map((e) => (
                  <p key={e.id} className="text-sm text-muted-foreground">{e.service} · {fmt(e.created_at)}</p>
                ))}
              </div>
            </section>

            <section>
              <p className="overline-tag">Internal Notes (staff only)</p>
              <form onSubmit={addNote} className="mt-3 flex gap-2">
                <Input data-testid="admin-note-input" placeholder="Add an internal note…" value={note} onChange={(e) => setNote(e.target.value)} className="bg-secondary/60" />
                <Button data-testid="admin-note-add" type="submit" size="sm">Add</Button>
              </form>
              <div className="mt-3 grid gap-2">
                {file.data.notes.map((n) => (
                  <p key={n.id} className="rounded-lg bg-secondary/60 px-3 py-2 text-sm">
                    {n.text} <span className="text-xs text-muted-foreground">— {n.author}, {fmt(n.created_at)}</span>
                  </p>
                ))}
              </div>
            </section>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function CustomersTab() {
  const customers = useQuery({ queryKey: ["admin-customers"], queryFn: () => apiGet<CustomerRow[]>("/admin/customers") });
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card" data-testid="admin-customers-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Documents</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(customers.data ?? []).map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{c.name}</TableCell>
              <TableCell className="text-xs">{c.mobile}<br />{c.email}</TableCell>
              <TableCell>{c.profile?.city ?? "—"}</TableCell>
              <TableCell>{c.documents}{c.documents_pending > 0 ? ` (${c.documents_pending} pending)` : ""}</TableCell>
              <TableCell>{c.applications}</TableCell>
              <TableCell className="text-xs text-muted-foreground">{c.created_at ? fmt(c.created_at) : "—"}</TableCell>
              <TableCell>
                <Button data-testid={`customer-file-${c.id.slice(0, 8)}`} size="sm" variant="outline" onClick={() => setOpenId(c.id)}>
                  View File
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {customers.data?.length === 0 && (
            <TableRow><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No registered customers yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
      {openId && <CustomerFileDialog id={openId} onClose={() => setOpenId(null)} />}
    </div>
  );
}
