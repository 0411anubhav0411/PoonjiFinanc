import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet, apiPatch } from "@/lib/api";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSeo } from "@/lib/seo";
import type { PortalUser } from "@/lib/types";

const STATUS_BANNER: Record<string, { cls: string; text: string }> = {
  pending: { cls: "border-amber-500/40 bg-amber-500/10 text-amber-800", text: "Your partner account is under review by Poonji Finance. You can complete your profile meanwhile — it goes public once approved." },
  approved: { cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700", text: "Your partner account is approved and visible in the public directory." },
  rejected: { cls: "border-red-500/40 bg-red-500/10 text-red-700", text: "Your partner application was not approved. Contact us to understand why and re-apply." },
  suspended: { cls: "border-red-500/40 bg-red-500/10 text-red-700", text: "Your partner account is currently suspended. Contact Poonji Finance for details." },
};

const PARTNER_CATEGORIES = ["Referral Partner", "Channel Partner", "Financial Consultant", "Business Associate", "Builder / Property Partner", "Other"];

export default function PartnerPortal() {
  useSeo("Partner Portal — Poonji Finance", "Manage your Poonji Finance partner profile.");
  const qc = useQueryClient();
  const me = useQuery({ queryKey: ["auth-me"], queryFn: () => apiGet<PortalUser>("/auth/me"), retry: false });
  const user = me.data;
  const p = user?.profile ?? {};

  const [form, setForm] = useState<Record<string, string> | null>(null);
  const [saving, setSaving] = useState(false);
  const current = form ?? {
    name: user?.name ?? "",
    mobile: user?.mobile ?? "",
    designation: p.designation ?? "",
    business_address: p.business_address ?? "",
    city: p.city ?? "",
    state: p.state ?? "",
    website: p.website ?? "",
    description: p.description ?? "",
    services: p.services ?? "",
    experience_years: p.experience_years ?? "",
    category: p.category ?? PARTNER_CATEGORIES[0],
  };

  if (me.isLoading) {
    return <div className="py-40 text-center text-muted-foreground">Loading your portal…</div>;
  }

  if (!user || user.role !== "partner") {
    return (
      <div className="mx-auto max-w-md px-4 py-32 text-center" data-testid="partner-login-prompt">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight">Partner Portal</h1>
        <p className="mt-3 text-sm text-muted-foreground">Sign in with your partner account, or apply to become a partner.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/login" data-testid="partner-goto-login" className={buttonVariants()}>Sign In</Link>
          <Link to="/signup" data-testid="partner-goto-signup" className={buttonVariants({ variant: "outline" })}>Apply as Partner</Link>
        </div>
      </div>
    );
  }

  const banner = STATUS_BANNER[user.partner_status ?? "pending"];
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...current, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPatch("/portal/profile", current);
      qc.invalidateQueries({ queryKey: ["auth-me"] });
      setForm(null);
      toast.success("Profile saved");
    } catch {
      toast.error("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8" data-testid="partner-portal">
      <p className="overline-tag">Partner Portal</p>
      <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight">{user.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{user.profile?.company} · {user.profile?.category}</p>

      <div className={`mt-6 rounded-2xl border px-5 py-4 text-sm ${banner.cls}`} data-testid="partner-status-banner">{banner.text}</div>

      <form onSubmit={save} className="glass-card mt-8 grid gap-5 rounded-3xl p-6 sm:p-8" data-testid="partner-profile-form">
        <h2 className="font-heading text-lg font-bold">Public Profile</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <label htmlFor="pp-name" className="text-xs font-medium text-muted-foreground">Your Name</label>
            <Input id="pp-name" data-testid="pp-name" value={current.name} onChange={set("name")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="pp-mobile" className="text-xs font-medium text-muted-foreground">Mobile</label>
            <Input id="pp-mobile" data-testid="pp-mobile" value={current.mobile} onChange={set("mobile")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="pp-designation" className="text-xs font-medium text-muted-foreground">Designation</label>
            <Input id="pp-designation" data-testid="pp-designation" value={current.designation} onChange={set("designation")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="pp-category" className="text-xs font-medium text-muted-foreground">Partner Category</label>
            <select id="pp-category" data-testid="pp-category" className="pf-select" value={current.category} onChange={set("category")}>
              {PARTNER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <label htmlFor="pp-address" className="text-xs font-medium text-muted-foreground">Business Address</label>
            <Input id="pp-address" data-testid="pp-address" value={current.business_address} onChange={set("business_address")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="pp-city" className="text-xs font-medium text-muted-foreground">City</label>
            <Input id="pp-city" data-testid="pp-city" value={current.city} onChange={set("city")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="pp-state" className="text-xs font-medium text-muted-foreground">State</label>
            <Input id="pp-state" data-testid="pp-state" value={current.state} onChange={set("state")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="pp-website" className="text-xs font-medium text-muted-foreground">Website</label>
            <Input id="pp-website" data-testid="pp-website" value={current.website} onChange={set("website")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="pp-exp" className="text-xs font-medium text-muted-foreground">Years of Experience</label>
            <Input id="pp-exp" data-testid="pp-exp" value={current.experience_years} onChange={set("experience_years")} className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <label htmlFor="pp-services" className="text-xs font-medium text-muted-foreground">Services / Products You Handle</label>
            <Input id="pp-services" data-testid="pp-services" value={current.services} onChange={set("services")} placeholder="e.g. Home loans, LAP, insurance" className="bg-secondary/60" />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <label htmlFor="pp-desc" className="text-xs font-medium text-muted-foreground">Professional Description</label>
            <Textarea id="pp-desc" data-testid="pp-desc" rows={3} value={current.description} onChange={set("description")} className="bg-secondary/60" />
          </div>
        </div>
        <Button data-testid="pp-save" type="submit" disabled={saving} className="w-fit">{saving ? "Saving…" : "Save Profile"}</Button>
      </form>
    </div>
  );
}
