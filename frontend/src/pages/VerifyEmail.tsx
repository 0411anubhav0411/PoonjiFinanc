import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { apiPost } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSeo } from "@/lib/seo";

export default function VerifyEmail() {
  useSeo("Verify Email — Poonji Finance", "Verify your Poonji Finance account email with your 6-digit code.");
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiPost("/auth/verify-email", { email, code });
      setDone(true);
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      toast.success("Email verified");
      setTimeout(() => navigate("/portal"), 1200);
    } catch {
      setError("Invalid or expired code. Request a new one below.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    await apiPost("/auth/send-verification", { email });
    toast.success("A fresh code is on its way");
  };

  return (
    <div className="hero-bg grain relative min-h-[70vh]">
      <div className="mx-auto max-w-md px-4 py-24">
        {done ? (
          <div className="glass-card rounded-3xl p-8 text-center" data-testid="verify-done">
            <BadgeCheck className="mx-auto h-10 w-10 text-emerald-600" />
            <h1 className="mt-4 font-heading text-2xl font-bold">Email verified</h1>
            <p className="mt-3 text-sm text-muted-foreground">Taking you to your portal…</p>
          </div>
        ) : (
          <form onSubmit={submit} className="glass-card grid gap-4 rounded-3xl p-8" data-testid="verify-form">
            <h1 className="font-heading text-2xl font-bold">Verify your email</h1>
            <p className="text-sm text-muted-foreground">We sent a 6-digit code to your email. Enter it below — it expires in 10 minutes.</p>
            <Input data-testid="verify-email-input" type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/60" />
            <Input data-testid="verify-code" required minLength={6} maxLength={6} inputMode="numeric" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} className="bg-secondary/60 text-center font-mono text-lg tracking-[0.5em]" />
            {error && <p data-testid="verify-error" className="text-sm text-red-600">{error}</p>}
            <Button data-testid="verify-submit" type="submit" disabled={loading}>
              {loading ? "Verifying…" : "Verify Email"}
            </Button>
            <button type="button" data-testid="verify-resend" onClick={resend} className="text-sm font-medium text-blue-800 hover:text-blue-600">
              Resend code
            </button>
            <Link to="/portal" data-testid="verify-skip" className="text-center text-xs text-muted-foreground hover:text-foreground">
              I'll do this later
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
