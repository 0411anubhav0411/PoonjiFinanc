import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Upload } from "lucide-react";
import { apiGet, apiUrl } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { PortalDoc } from "@/lib/types";

const DOC_CATEGORIES: Record<string, string[]> = {
  "Identity Proof": ["PAN Card", "Aadhaar Card", "Passport", "Voter ID", "Driving Licence"],
  "Address Proof": ["Aadhaar Card", "Passport", "Utility Bill", "Rent Agreement", "Driving Licence"],
  "Income Proof — Salaried": ["Salary Slips", "Form 16", "Salary Certificate", "Bank Statement"],
  "Income Proof — Self-Employed": ["Income Tax Return", "GST Returns", "Balance Sheet", "Profit & Loss Statement", "Bank Statement"],
  "Property & Existing Loans": ["Sale Deed", "Title Document", "Existing Loan Statement", "Sanction Letter", "Repayment Statement"],
  "Other Financial": ["Investment Statement", "Bank Statement", "Other Document"],
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  uploaded: { label: "Uploaded", cls: "border-blue-500/40 bg-blue-500/10 text-blue-700" },
  under_review: { label: "Under Review", cls: "border-amber-500/40 bg-amber-500/10 text-amber-700" },
  verified: { label: "Verified", cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700" },
  rejected: { label: "Rejected", cls: "border-red-500/40 bg-red-500/10 text-red-600" },
  replacement_required: { label: "Replacement Required", cls: "border-orange-500/40 bg-orange-500/10 text-orange-700" },
};

export function DocumentsTab() {
  const qc = useQueryClient();
  const docs = useQuery({ queryKey: ["portal-docs"], queryFn: () => apiGet<PortalDoc[]>("/portal/documents") });
  const [category, setCategory] = useState(Object.keys(DOC_CATEGORIES)[0]);
  const [docType, setDocType] = useState(DOC_CATEGORIES[Object.keys(DOC_CATEGORIES)[0]][0]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const upload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Choose a file first");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("category", category);
      fd.append("doc_type", docType);
      const res = await fetch(apiUrl("/portal/documents"), { method: "POST", body: fd, credentials: "include" });
      if (!res.ok) throw new Error(String(res.status));
      toast.success(`${docType} uploaded`);
      setFile(null);
      qc.invalidateQueries({ queryKey: ["portal-docs"] });
    } catch {
      toast.error("Upload failed — PDF, JPG or PNG up to 10 MB");
    } finally {
      setUploading(false);
    }
  };

  const grouped = (docs.data ?? []).reduce<Record<string, PortalDoc[]>>((acc, d) => {
    (acc[d.category] = acc[d.category] ?? []).push(d);
    return acc;
  }, {});

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
      <form onSubmit={upload} className="glass-card grid content-start gap-4 rounded-3xl p-6" data-testid="doc-upload-form">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-gold" />
          <h2 className="font-heading text-lg font-bold">Upload a Document</h2>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="doc-category" className="text-xs font-medium text-muted-foreground">Document Category</label>
          <select
            id="doc-category"
            data-testid="doc-category"
            className="pf-select"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setDocType(DOC_CATEGORIES[e.target.value][0]);
            }}
          >
            {Object.keys(DOC_CATEGORIES).map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="doc-type" className="text-xs font-medium text-muted-foreground">Document Type</label>
          <select id="doc-type" data-testid="doc-type" className="pf-select" value={docType} onChange={(e) => setDocType(e.target.value)}>
            {DOC_CATEGORIES[category].map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="doc-file" className="text-xs font-medium text-muted-foreground">File (PDF, JPG, PNG — max 10 MB)</label>
          <input
            id="doc-file"
            data-testid="doc-file"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full rounded-md border border-input bg-secondary/60 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-700 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white"
          />
        </div>
        <Button data-testid="doc-upload-submit" type="submit" disabled={uploading}>
          {uploading ? "Uploading…" : "Upload Document"}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Your documents are stored securely and are visible only to you and the Poonji Finance team handling your file. Upload once — reuse across applications.
        </p>
      </form>

      <div data-testid="doc-vault">
        <h2 className="font-heading text-lg font-bold">Your Vault ({docs.data?.length ?? 0})</h2>
        {docs.data?.length === 0 && (
          <p className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground" data-testid="doc-empty">
            No documents yet. Upload your PAN and Aadhaar to get started.
          </p>
        )}
        <div className="mt-4 grid gap-6">
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <p className="overline-tag">{cat}</p>
              <div className="mt-2 grid gap-2">
                {items.map((d) => {
                  const meta = STATUS_META[d.status] ?? STATUS_META.uploaded;
                  return (
                    <div key={d.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4" data-testid={`doc-row-${d.id.slice(0, 8)}`}>
                      <FileText className="h-5 w-5 shrink-0 text-blue-800" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{d.doc_type}</p>
                        <p className="truncate text-xs text-muted-foreground">{d.filename}</p>
                        {d.note && <p className="mt-1 text-xs text-amber-700">Note from Poonji: {d.note}</p>}
                      </div>
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${meta.cls}`} data-testid={`doc-status-${d.id.slice(0, 8)}`}>{meta.label}</span>
                      <a data-testid={`doc-download-${d.id.slice(0, 8)}`} href={apiUrl(`/portal/documents/${d.id}/download`)} className="text-blue-800 hover:text-blue-600" aria-label={`Download ${d.doc_type}`}>
                        <Download className="h-4 w-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
