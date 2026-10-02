import { useState } from "react";
import { apiPost, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Callback {
  id: string;
}

export function CallbackDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [form, setForm] = useState({ name: "", mobile: "", preferred_time: "Within 30 minutes" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost<Callback>("/callbacks", form);
      toast.success("Callback requested", {
        description: "We'll call you within 30 minutes during business hours (9:30 AM – 6:30 PM).",
      });
      onOpenChange(false);
      setForm({ name: "", mobile: "", preferred_time: "Within 30 minutes" });
    } catch (error) {
      const message = error instanceof ApiError
        ? typeof error.body === "object" && error.body && "detail" in error.body
          ? String((error.body as { detail?: string }).detail ?? "Could not submit right now. Please call us directly.")
          : "Could not submit right now. Please call us directly."
        : "Could not submit right now. Please call us directly.";
      console.error("Callback request failed", error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="callback-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Request a Callback</DialogTitle>
          <DialogDescription>
            Our team calls back within 30 minutes during business hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" data-testid="callback-form">
          <Input data-testid="callback-name" required minLength={2} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary/60" />
          <Input data-testid="callback-mobile" required placeholder="Mobile number" inputMode="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="bg-secondary/60" />
          <select data-testid="callback-time" className="pf-select" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}>
            <option>Within 30 minutes</option>
            <option>Morning (9:30 AM – 12 PM)</option>
            <option>Afternoon (12 PM – 3 PM)</option>
            <option>Evening (3 PM – 6:30 PM)</option>
          </select>
          <Button data-testid="callback-submit" type="submit" disabled={loading}>
            {loading ? "Requesting…" : "Call Me Back"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
