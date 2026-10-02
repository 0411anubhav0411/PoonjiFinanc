import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiPatch } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { PortalUser } from "@/lib/types";

const EMPLOYMENT = ["Salaried", "Self-Employed / Business", "Professional", "Retired", "Other"];

export function ProfileTab({ user }: { user: PortalUser }) {
  const qc = useQueryClient();
  const p = user.profile ?? {};
  const [form, setForm] = useState({
    name: user.name,
    mobile: user.mobile ?? "",
    dob: p.dob ?? "",
    gender: p.gender ?? "",
    address: p.address ?? "",
    city: p.city ?? "",
    state: p.state ?? "",
    pin: p.pin ?? "",
    employment_type: p.employment_type ?? "Salaried",
    occupation: p.occupation ?? "",
    company: p.company ?? "",
    income: p.income ?? "",
    pan: p.pan ?? "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiPatch("/portal/profile", form);
      qc.invalidateQueries({ queryKey: ["auth-me"] });
      toast.success("Profile updated");
    } catch {
      toast.error("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof typeof form; label: string; testid: string; type?: string }[] = [
    { key: "name", label: "Full Name", testid: "profile-name" },
    { key: "mobile", label: "Mobile Number", testid: "profile-mobile" },
    { key: "dob", label: "Date of Birth", testid: "profile-dob", type: "date" },
    { key: "gender", label: "Gender", testid: "profile-gender" },
    { key: "address", label: "Residential Address", testid: "profile-address" },
    { key: "city", label: "City", testid: "profile-city" },
    { key: "state", label: "State", testid: "profile-state" },
    { key: "pin", label: "PIN Code", testid: "profile-pin" },
    { key: "occupation", label: "Occupation", testid: "profile-occupation" },
    { key: "company", label: "Company / Business Name", testid: "profile-company" },
    { key: "income", label: "Approx. Monthly Income", testid: "profile-income" },
    { key: "pan", label: "PAN", testid: "profile-pan" },
  ];

  return (
    <form onSubmit={save} className="glass-card grid gap-5 rounded-3xl p-6 sm:p-8" data-testid="profile-form">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => (
          <div key={f.key} className="grid gap-1.5">
            <label htmlFor={f.testid} className="text-xs font-medium text-muted-foreground">{f.label}</label>
            <Input id={f.testid} data-testid={f.testid} type={f.type ?? "text"} value={form[f.key]} onChange={set(f.key)} className="bg-secondary/60" />
          </div>
        ))}
        <div className="grid gap-1.5">
          <label htmlFor="profile-employment" className="text-xs font-medium text-muted-foreground">Employment Type</label>
          <select id="profile-employment" data-testid="profile-employment" className="pf-select" value={form.employment_type} onChange={set("employment_type")}>
            {EMPLOYMENT.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button data-testid="profile-save" type="submit" disabled={saving}>{saving ? "Saving…" : "Save Profile"}</Button>
        <p className="text-xs text-muted-foreground">Signed up with {user.email}</p>
      </div>
    </form>
  );
}
