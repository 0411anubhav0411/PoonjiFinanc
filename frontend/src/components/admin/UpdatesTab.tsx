import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FinanceUpdate } from "@/lib/types";

const UPDATE_CATEGORIES = ["RBI & Policy", "Loans", "Deposits", "Insurance", "Investments", "Markets", "General Awareness"];

const EMPTY = { title: "", category: UPDATE_CATEGORIES[0], body: "", source: "", important: false, published: true };
type UpdateForm = typeof EMPTY;

function UpdateDialog({ update, onClose }: { update: FinanceUpdate | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<UpdateForm>(
    update
      ? { title: update.title, category: update.category, body: update.body, source: update.source ?? "", important: update.important, published: update.published }
      : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { ...form, source: form.source || undefined };
      if (update) {
        await apiPatch(`/admin/updates/${update.id}`, body);
      } else {
        await apiPost("/admin/updates", body);
      }
      qc.invalidateQueries({ queryKey: ["admin-updates"] });
      toast.success(update ? "Update saved" : "Update published");
      onClose();
    } catch {
      toast.error("Could not save update");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto" data-testid="update-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{update ? "Edit Update" : "Publish Update"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4" data-testid="update-form">
          <Input data-testid="update-title" required placeholder="Headline" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-secondary/60" />
          <div className="grid gap-4 sm:grid-cols-2">
            <select data-testid="update-category" className="pf-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {UPDATE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <Input data-testid="update-source" placeholder="Source (e.g. RBI press release)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="bg-secondary/60" />
          </div>
          <Textarea data-testid="update-body" required rows={5} placeholder="What's happening and why it matters to customers…" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="bg-secondary/60" />
          <div className="flex flex-wrap gap-6 text-sm">
            <label className="flex items-center gap-2">
              <Checkbox data-testid="update-important" checked={form.important} onCheckedChange={(v) => setForm({ ...form, important: v === true })} />
              Mark important
            </label>
            <label className="flex items-center gap-2">
              <Checkbox data-testid="update-published" checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v === true })} />
              Published
            </label>
          </div>
          <Button data-testid="update-save" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Update"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function UpdatesTab() {
  const qc = useQueryClient();
  const updates = useQuery({ queryKey: ["admin-updates"], queryFn: () => apiGet<FinanceUpdate[]>("/admin/updates") });
  const [editing, setEditing] = useState<FinanceUpdate | null>(null);
  const [adding, setAdding] = useState(false);

  const remove = async (id: string) => {
    await apiDelete(`/admin/updates/${id}`);
    qc.invalidateQueries({ queryKey: ["admin-updates"] });
    toast.success("Update removed");
  };

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button data-testid="update-add" size="sm" onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4" /> Publish Update
        </Button>
      </div>
      <div className="grid gap-3" data-testid="admin-updates-list">
        {(updates.data ?? []).map((u) => (
          <div key={u.id} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5" data-testid={`admin-update-${u.id.slice(0, 8)}`}>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="overline-tag">{u.category}</span>
                {u.important && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-medium text-amber-800">Important</span>}
                {!u.published && <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-muted-foreground">Hidden</span>}
                <span>{new Date(u.created_at).toLocaleDateString("en-IN")}</span>
              </div>
              <p className="mt-2 font-heading text-base font-bold">{u.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{u.body}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button data-testid={`update-edit-${u.id.slice(0, 8)}`} size="icon-sm" variant="ghost" onClick={() => setEditing(u)} aria-label="Edit update"><Pencil className="h-3.5 w-3.5" /></Button>
              <Button data-testid={`update-delete-${u.id.slice(0, 8)}`} size="icon-sm" variant="ghost" onClick={() => remove(u.id)} aria-label="Delete update"><Trash2 className="h-3.5 w-3.5 text-red-600" /></Button>
            </div>
          </div>
        ))}
        {updates.data?.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border py-10 text-center text-muted-foreground">No updates yet.</p>
        )}
      </div>
      {adding && <UpdateDialog update={null} onClose={() => setAdding(false)} />}
      {editing && <UpdateDialog update={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}
