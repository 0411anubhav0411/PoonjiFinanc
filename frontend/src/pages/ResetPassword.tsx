import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BadgeCheck } from "lucide-react";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSeo } from "@/lib/seo";

export default function ResetPassword() {
  useSeo("Reset Password — Poonji Finance", "Set a new password for your Poonji Finance account.");
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apiPost("/auth/reset-password", { token, password });
      setDone(true);
    } catch {
      setError("This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero-bg grain relative min-h-[70vh]">
      <div className="mx-auto max-w-md px-4 py-24">
        {done ? (
          <div className="glass-card rounded-3xl p-8 text-center" data-testid="reset-done">
            <BadgeCheck className="mx-auto h-10 w-10 text-emerald-600" />
            <h1 className="mt-4 font-heading text-2xl font-bold">Password updated</h1>
            <p className="mt-3 text-sm text-muted-foreground">Sign in with your new password.</p>
            <Link to="/login" data-testid="reset-goto-login" className="mt-6 inline-block font-medium text-blue-800 hover:text-blue-600">
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="glass-card grid gap-4 rounded-3xl p-8" data-testid="reset-form">
            <h1 className="font-heading text-2xl font-bold">Set a new password</h1>
            {!token && <p className="text-sm text-red-600" data-testid="reset-no-token">This link is missing its token. Please use the link from your email.</p>}
            <Input data-testid="reset-password" type="password" required minLength={8} placeholder="New password (min 8 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-secondary/60" />
            <Input data-testid="reset-confirm" type="password" required minLength={8} placeholder="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="bg-secondary/60" />
            {error && <p data-testid="reset-error" className="text-sm text-red-600">{error}</p>}
            <Button data-testid="reset-submit" type="submit" disabled={loading || !token}>
              {loading ? "Updating…" : "Update Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
