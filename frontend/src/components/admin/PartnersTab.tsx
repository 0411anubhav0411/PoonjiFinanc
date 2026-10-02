import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { PartnerPublic } from "@/lib/types";

const PARTNER_STATUSES = ["pending", "approved", "rejected", "suspended"] as const;

export function PartnersTab() {
  const qc = useQueryClient();
  const partners = useQuery({ queryKey: ["admin-partners"], queryFn: () => apiGet<PartnerPublic[]>("/admin/partners") });

  const setStatus = async (id: string, status: string) => {
    try {
      await apiPatch(`/admin/partners/${id}`, { status });
      qc.invalidateQueries({ queryKey: ["admin-partners"] });
      toast.success(`Partner marked ${status}`);
    } catch {
      toast.error("Could not update partner");
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card" data-testid="admin-partners-table">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Partner</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(partners.data ?? []).map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell>{p.profile?.company ?? "—"}</TableCell>
              <TableCell>{p.profile?.category ?? "—"}</TableCell>
              <TableCell>{p.profile?.city ?? "—"}</TableCell>
              <TableCell className="text-xs">{p.mobile}<br />{p.email}</TableCell>
              <TableCell>
                <select
                  data-testid={`partner-status-${p.id.slice(0, 8)}`}
                  className="pf-select h-8 w-auto text-xs capitalize"
                  value={p.partner_status ?? "pending"}
                  onChange={(e) => setStatus(p.id, e.target.value)}
                >
                  {PARTNER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </TableCell>
            </TableRow>
          ))}
          {partners.data?.length === 0 && (
            <TableRow><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No partner registrations yet.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
