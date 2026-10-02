import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { apiGet, apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { AppNotification } from "@/lib/types";

export function NotificationsTab() {
  const qc = useQueryClient();
  const notes = useQuery({ queryKey: ["portal-notifs"], queryFn: () => apiGet<AppNotification[]>("/portal/notifications") });

  const markAll = async () => {
    await apiPost("/portal/notifications/read-all");
    qc.invalidateQueries({ queryKey: ["portal-notifs"] });
  };

  const unread = (notes.data ?? []).filter((n) => !n.read).length;

  return (
    <div data-testid="notifications-panel">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold">Notifications {unread > 0 && <span className="ml-2 rounded-full bg-blue-700 px-2 py-0.5 text-xs text-white">{unread} new</span>}</h2>
        {unread > 0 && (
          <Button data-testid="notifs-read-all" variant="outline" size="sm" onClick={markAll}>Mark all read</Button>
        )}
      </div>
      {notes.data?.length === 0 && (
        <p className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground" data-testid="notifs-empty">
          Nothing yet — updates about your documents and applications will appear here.
        </p>
      )}
      <div className="mt-4 grid gap-2">
        {(notes.data ?? []).map((n) => (
          <div key={n.id} className={`flex gap-3 rounded-xl border p-4 ${n.read ? "border-border bg-card" : "border-blue-700/30 bg-blue-700/5"}`} data-testid={`notif-${n.id.slice(0, 8)}`}>
            <Bell className={`mt-0.5 h-4 w-4 shrink-0 ${n.read ? "text-muted-foreground" : "text-blue-800"}`} />
            <div>
              <p className="text-sm font-semibold">{n.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-xs text-muted-foreground/70">{new Date(n.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
