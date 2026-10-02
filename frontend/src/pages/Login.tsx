import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Briefcase, ShieldCheck, UserRound } from "lucide-react";
import { apiPost, ApiError } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSeo } from "@/lib/seo";
import type { PortalUser } from "@/lib/types";

const ROLES = [
  { id: "customer", label: "Customer", icon: UserRound, desc: "Applications, documents & tracking" },
  { id: "partner", label: "Partner", icon: Briefcase, desc: "Channel & referral partners" },
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "Internal administration" },
] as const;

export default function Login() {
  useSeo("Login — Poonji Finance", "Sign in to your Poonji Finance customer, partner or admin account.");
  const [role, setRole] = useState<string>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await apiPost<PortalUser>("/auth/login", { email, password });
      queryClient.setQueryData(["auth-me"], user);
      toast.success(`Welcome back, ${user.name}`);
      navigate(user.role === "admin" ? "/admin" : user.role === "partner" ? "/partner-portal" : "/portal");
    } catch (error) {
      const message = error instanceof ApiError
        ? typeof error.body === "object" && error.body && "detail" in error.body
          ? String((error.body as { detail?: string }).detail ?? "Invalid email or password")
          : "Unable to sign in right now. Please try again."
        : "Unable to sign in right now. Please check your connection and try again.";
      console.error("Login request failed", error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-bg grain relative min-h-[80vh]">
      <div className="mx-auto max-w-md px-4 py-20 sm:py-28">
        <div className="text-center">
          <p className="overline-tag">Secure Access</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">Welcome back</h1>
          <p className="mt-2 text-sm text-muted-foreground">Choose your portal and sign in.</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-2" data-testid="login-role-selector">
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              data-testid={`login-role-${r.id}`}
              onClick={() => setRole(r.id)}
              className={`rounded-2xl border p-3 text-center transition-all ${
                role === r.id ? "border-blue-700 bg-blue-700/5 shadow-sm" : "border-border bg-card hover:border-blue-700/40"
              }`}
            >
              <r.icon className={`mx-auto h-5 w-5 ${role === r.id ? "text-blue-800" : "text-muted-foreground"}`} />
              <p className="mt-1.5 text-xs font-semibold">{r.label}</p>
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {ROLES.find((r) => r.id === role)?.desc}
        </p>

        <form onSubmit={submit} className="glass-card mt-6 grid gap-4 rounded-3xl p-6 sm:p-8" data-testid="login-form">
          <Input data-testid="login-email" type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/60" />
          <Input data-testid="login-password" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/60" />
          <div className="text-right">
            <Link to="/forgot-password" data-testid="login-forgot" className="text-xs font-medium text-blue-800 hover:text-blue-600">
              Forgot password?
            </Link>
          </div>
          {error && <p data-testid="login-error" className="text-sm text-red-600">{error}</p>}
          <Button data-testid="login-submit" type="submit" size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link to="/signup" data-testid="login-signup-link" className="font-medium text-blue-800 hover:text-blue-600">
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
