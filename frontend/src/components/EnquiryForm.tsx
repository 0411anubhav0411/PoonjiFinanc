import { useState } from "react";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SERVICE_OPTIONS } from "@/data/content";

interface Enquiry {
  id: string;
}

export function EnquiryForm({
  defaultService,
  compact = false,
}: {
  defaultService?: string;
  compact?: boolean;
}) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    service: defaultService ?? SERVICE_OPTIONS[0],
    requirement: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10,15}$/.test(form.mobile.replace(/[\s+]/g, "").replace(/^91/, ""))) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await apiPost<Enquiry>("/enquiries", {
        ...form,
        requirement: form.requirement || undefined,
        message: form.message || undefined,
      });
      toast.success(`Enquiry received. Reference ID: ${res.id.slice(0, 8).toUpperCase()}`, {
        description: "Our team will reach out within one business day.",
      });
      setForm({ name: "", mobile: "", email: "", city: "", service: defaultService ?? SERVICE_OPTIONS[0], requirement: "", message: "" });
    } catch {
      toast.error("Could not submit right now. Please call or WhatsApp us instead.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4" data-testid="enquiry-form">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input data-testid="enquiry-name" required minLength={2} placeholder="Full name" value={form.name} onChange={set("name")} className="bg-secondary/60" />
        <Input data-testid="enquiry-mobile" required placeholder="Mobile number" value={form.mobile} onChange={set("mobile")} className="bg-secondary/60" inputMode="tel" />
        <Input data-testid="enquiry-email" required type="email" placeholder="Email address" value={form.email} onChange={set("email")} className="bg-secondary/60" />
        <Input data-testid="enquiry-city" required placeholder="City" value={form.city} onChange={set("city")} className="bg-secondary/60" />
        <select data-testid="enquiry-service" className="pf-select" value={form.service} onChange={set("service")}>
          {SERVICE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Input data-testid="enquiry-requirement" placeholder="Approx. requirement (e.g. ₹25,00,000)" value={form.requirement} onChange={set("requirement")} className="bg-secondary/60" />
      </div>
      {!compact && (
        <Textarea data-testid="enquiry-message" placeholder="Tell us a little more (optional)" value={form.message} onChange={set("message")} rows={3} className="bg-secondary/60" />
      )}
      <Button data-testid="enquiry-submit" type="submit" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Submitting…" : "Submit Enquiry"}
      </Button>
    </form>
  );
}
