import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CONTACT } from "@/data/content";

export function ApplicationDialog({ role, index }: { role: string; index: number }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiPost<{ id: string }>("/applications", {
        ...form,
        role,
        message: form.message || undefined,
      });
      toast.success(`Application received. Reference ID: ${res.id.slice(0, 8).toUpperCase()}`, {
        description: "We review every application and respond within 5 working days.",
      });
      setOpen(false);
      setForm({ name: "", email: "", mobile: "", message: "" });
    } catch {
      toast.error("Could not submit right now. Please email us your CV instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button data-testid={`careers-apply-${index}`} variant="outline" className="shrink-0" onClick={() => setOpen(true)}>
        Apply Now <ArrowRight className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent data-testid="application-dialog">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Apply — {role}</DialogTitle>
            <DialogDescription>Share your details and we'll respond within 5 working days.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="grid gap-4" data-testid="application-form">
            <Input data-testid="application-name" required minLength={2} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-secondary/60" />
            <Input data-testid="application-email" required type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-secondary/60" />
            <Input data-testid="application-mobile" required minLength={10} placeholder="Mobile number" inputMode="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="bg-secondary/60" />
            <Textarea data-testid="application-message" placeholder="Brief note — experience, current role, why Poonji (optional)" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-secondary/60" />
            <Button data-testid="application-submit" type="submit" disabled={loading}>
              {loading ? "Submitting…" : "Submit Application"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground">
            Prefer email? Send your CV to {CONTACT.email} with the role in the subject line.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
