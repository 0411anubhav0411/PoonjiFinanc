import { useState } from "react";
import { Link } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { apiPost } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSeo } from "@/lib/seo";

export default function ForgotPassword() {
  useSeo("Forgot Password — Poonji Finance", "Reset your Poonji Finance account password securely.");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiPost("/auth/forgot-password", { email });
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <div className="hero-bg grain relative min-h-[70vh]">
      <div className="mx-auto max-w-md px-4 py-24">
        {sent ? (
          <div className="glass-card rounded-3xl p-8 text-center" data-testid="forgot-sent">
            <MailCheck className="mx-auto h-10 w-10 text-emerald-600" />
            <h1 className="mt-4 font-heading text-2xl font-bold">Check your inbox</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              If an account exists for <span className="font-medium text-foreground">{email}</span>, we've sent a reset link valid for 30 minutes.
            </p>
            <Link to="/login" data-testid="forgot-back-login" className="mt-6 inline-block font-medium text-blue-800 hover:text-blue-600">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="glass-card grid gap-4 rounded-3xl p-8" data-testid="forgot-form">
            <h1 className="font-heading text-2xl font-bold">Forgot your password?</h1>
            <p className="text-sm text-muted-foreground">Enter your account email and we'll send you a secure reset link.</p>
            <Input data-testid="forgot-email" type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-secondary/60" />
            <Button data-testid="forgot-submit" type="submit" disabled={loading}>
              {loading ? "Sending…" : "Send Reset Link"}
            </Button>
            <Link to="/login" data-testid="forgot-login-link" className="text-center text-sm text-blue-800 hover:text-blue-600">
              Back to Sign In
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
