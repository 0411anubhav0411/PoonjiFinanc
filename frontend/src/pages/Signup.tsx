import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSeo } from "@/lib/seo";
import type { PortalUser } from "@/lib/types";

const EMPLOYMENT = ["Salaried", "Self-Employed / Business", "Professional", "Retired", "Other"];
const PARTNER_CATEGORIES = ["Referral Partner", "Channel Partner", "Financial Consultant", "Business Associate", "Builder / Property Partner", "Other"];

export default function Signup() {
  useSeo("Sign Up — Poonji Finance", "Create your Poonji Finance customer or partner account.");
  const [tab, setTab] = useState<"customer" | "partner">("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [partnerDone, setPartnerDone] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [customer, setCustomer] = useState({
    name: "", mobile: "", email: "", password: "", city: "", state: "",
    employment_type: EMPLOYMENT[0], income: "", pan: "",
  });
  const [partner, setPartner] = useState({
    name: "", company: "", category: PARTNER_CATEGORIES[0], email: "", mobile: "",
    password: "", city: "", state: "", description: "",
  });

  const setC = (k: keyof typeof customer) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setCustomer((f) => ({ ...f, [k]: e.target.value }));
  const setP = (k: keyof typeof partner) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setPartner((f) => ({ ...f, [k]: e.target.value }));

  const submitCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await apiPost<PortalUser>("/auth/register", {
        ...customer,
        city: customer.city || undefined,
        state: customer.state || undefined,
        income: customer.income || undefined,
        pan: customer.pan || undefined,
      });
      queryClient.setQueryData(["auth-me"], user);
      toast.success("Account created — welcome to Poonji Finance");
      navigate(`/verify-email?email=${encodeURIComponent(customer.email)}`);
    } catch (err) {
      setError(err instanceof Error && "status" in err && (err as { status: number }).status === 409
        ? "An account with this email already exists"
        : "Could not create account. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  const submitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/auth/register-partner", {
        ...partner,
        city: partner.city || undefined,
        state: partner.state || undefined,
        description: partner.description || undefined,
      });
      setPartnerDone(true);
    } catch (err) {
      setError(err instanceof Error && "status" in err && (err as { status: number }).status === 409
        ? "An account with this email already exists"
        : "Could not submit application. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  if (partnerDone) {
    return (
      <div className="hero-bg grain relative min-h-[80vh]">
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <BadgeCheck className="mx-auto h-12 w-12 text-emerald-600" />
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight">Application received</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Thank you for your interest in partnering with Poonji Finance. Our team will review your details and activate your partner account. You'll hear from us shortly.
          </p>
          <Link to="/login" data-testid="partner-done-login" className="mt-6 inline-block font-medium text-blue-800 hover:text-blue-600">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-bg grain relative">
      <div className="mx-auto max-w-xl px-4 py-20 sm:py-24">
        <div className="text-center">
          <p className="overline-tag">Join Poonji Finance</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Create your account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Customers get a document vault and application tracking. Partners get a public profile.</p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2" data-testid="signup-tabs">
          {(["customer", "partner"] as const).map((t) => (
            <button
              key={t}
              type="button"
              data-testid={`signup-tab-${t}`}
              onClick={() => setTab(t)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition-all ${
                tab === t ? "border-blue-700 bg-blue-700/5 text-blue-800" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "customer" ? "I'm a Customer" : "I'm a Partner"}
            </button>
          ))}
        </div>

        {tab === "customer" ? (
          <form onSubmit={submitCustomer} className="glass-card mt-6 grid gap-4 rounded-3xl p-6 sm:p-8" data-testid="signup-customer-form">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input data-testid="signup-name" required minLength={2} placeholder="Full name" value={customer.name} onChange={setC("name")} className="bg-secondary/60" />
              <Input data-testid="signup-mobile" required minLength={10} placeholder="Mobile number" inputMode="tel" value={customer.mobile} onChange={setC("mobile")} className="bg-secondary/60" />
              <Input data-testid="signup-email" required type="email" placeholder="Email address" value={customer.email} onChange={setC("email")} className="bg-secondary/60" />
              <Input data-testid="signup-password" required minLength={8} type="password" placeholder="Password (min 8 characters)" value={customer.password} onChange={setC("password")} className="bg-secondary/60" />
              <Input data-testid="signup-city" placeholder="City" value={customer.city} onChange={setC("city")} className="bg-secondary/60" />
              <Input data-testid="signup-state" placeholder="State" value={customer.state} onChange={setC("state")} className="bg-secondary/60" />
              <select data-testid="signup-employment" className="pf-select" value={customer.employment_type} onChange={setC("employment_type")}>
                {EMPLOYMENT.map((o) => <option key={o}>{o}</option>)}
              </select>
              <Input data-testid="signup-income" placeholder="Approx. monthly income (optional)" value={customer.income} onChange={setC("income")} className="bg-secondary/60" />
              <Input data-testid="signup-pan" placeholder="PAN (optional)" value={customer.pan} onChange={setC("pan")} className="bg-secondary/60 sm:col-span-2" />
            </div>
            {error && <p data-testid="signup-error" className="text-sm text-red-600">{error}</p>}
            <Button data-testid="signup-submit" type="submit" size="lg" disabled={loading}>
              {loading ? "Creating account…" : "Create Customer Account"}
            </Button>
          </form>
        ) : (
          <form onSubmit={submitPartner} className="glass-card mt-6 grid gap-4 rounded-3xl p-6 sm:p-8" data-testid="signup-partner-form">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input data-testid="partner-name" required minLength={2} placeholder="Your full name" value={partner.name} onChange={setP("name")} className="bg-secondary/60" />
              <Input data-testid="partner-company" required minLength={2} placeholder="Company / firm name" value={partner.company} onChange={setP("company")} className="bg-secondary/60" />
              <select data-testid="partner-category" className="pf-select" value={partner.category} onChange={setP("category")}>
                {PARTNER_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <Input data-testid="partner-mobile" required minLength={10} placeholder="Mobile number" inputMode="tel" value={partner.mobile} onChange={setP("mobile")} className="bg-secondary/60" />
              <Input data-testid="partner-email" required type="email" placeholder="Email address" value={partner.email} onChange={setP("email")} className="bg-secondary/60" />
              <Input data-testid="partner-password" required minLength={8} type="password" placeholder="Password (min 8 characters)" value={partner.password} onChange={setP("password")} className="bg-secondary/60" />
              <Input data-testid="partner-city" placeholder="City" value={partner.city} onChange={setP("city")} className="bg-secondary/60" />
              <Input data-testid="partner-state" placeholder="State" value={partner.state} onChange={setP("state")} className="bg-secondary/60" />
            </div>
            <Textarea data-testid="partner-description" placeholder="Briefly describe your business and the services you handle" rows={3} value={partner.description} onChange={setP("description")} className="bg-secondary/60" />
            {error && <p data-testid="partner-error" className="text-sm text-red-600">{error}</p>}
            <Button data-testid="partner-submit" type="submit" size="lg" disabled={loading}>
              {loading ? "Submitting…" : "Apply for Partner Account"}
            </Button>
            <p className="text-xs text-muted-foreground">Partner accounts are reviewed and approved by Poonji Finance before they appear in the public directory.</p>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" data-testid="signup-login-link" className="font-medium text-blue-800 hover:text-blue-600">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
