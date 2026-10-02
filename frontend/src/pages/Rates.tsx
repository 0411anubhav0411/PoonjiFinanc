import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import { useSeo } from "@/lib/seo";
import type { Rate } from "@/lib/types";

const RATE_TABS = [
  { id: "home-loan", label: "Home Loan" },
  { id: "lap", label: "Loan Against Property" },
  { id: "personal-loan", label: "Personal Loan" },
  { id: "business-loan", label: "Business & MSME" },
  { id: "vehicle-loan", label: "Vehicle Loan" },
  { id: "education-loan", label: "Education Loan" },
];

export default function Rates() {
  useSeo("Bank & NBFC Interest Rates — Poonji Finance", "Compare indicative home loan, LAP, personal, business and vehicle loan interest rates across banks and NBFCs.");
  const [cat, setCat] = useState("home-loan");

  const rates = useQuery({
    queryKey: ["rates", cat],
    queryFn: () => apiGet<Rate[]>(`/rates?category=${cat}`),
  });

  const latest = rates.data?.[0]?.updated_at;

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="overline-tag">Interest Rates</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Bank & NBFC rates, <span className="bg-gradient-to-r from-blue-800 to-[#B08A1E] bg-clip-text text-transparent">side by side</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Indicative lending rates across our partner institutions — maintained by our team so you compare current offers, not stale brochures.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2" data-testid="rates-tabs">
          {RATE_TABS.map((t) => (
            <button
              key={t.id}
              data-testid={`rates-tab-${t.id}`}
              onClick={() => setCat(t.id)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                cat === t.id ? "border-blue-700 bg-blue-700/5 font-semibold text-blue-800" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <p data-testid="rates-updated">{latest ? `Last updated: ${new Date(latest).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}` : ""}</p>
          <p>Indicative only — final rates depend on your profile and the institution's policies.</p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card" data-testid="rates-table">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-5 py-4 font-medium">Institution</th>
                <th className="px-5 py-4 font-medium">Product</th>
                <th className="px-5 py-4 font-medium">Interest Rate*</th>
                <th className="px-5 py-4 font-medium">Loan Amount</th>
                <th className="px-5 py-4 font-medium">Tenure</th>
                <th className="px-5 py-4 font-medium">Processing Fee</th>
                <th className="px-5 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {(rates.data ?? []).map((r) => (
                <tr key={r.id} className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40" data-testid={`rate-row-${r.id.slice(0, 8)}`}>
                  <td className="px-5 py-4 font-semibold">{r.institution}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.product}</td>
                  <td className="px-5 py-4 font-mono font-bold text-blue-800">{r.rate_text}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.amount_text ?? "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.tenure_text ?? "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{r.fee_text ?? "—"}</td>
                  <td className="px-5 py-4">
                    <Link to="/contact" data-testid={`rate-enquire-${r.id.slice(0, 8)}`} className="inline-flex items-center gap-1 text-sm font-medium text-blue-800 hover:text-blue-600">
                      Enquire <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
              {rates.data?.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">No rates published in this category yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 rounded-2xl border border-border bg-card p-5 text-xs leading-relaxed text-muted-foreground" data-testid="rates-disclaimer">
          *Rates shown are indicative ranges compiled from public sources and partner communications, and change frequently. They are not an offer or a quote. Your actual rate, eligibility, fees and terms are determined by the respective bank/NBFC based on your credit profile and their policies at the time of application. Poonji Finance facilitates applications; sanction and pricing rest solely with the institution.
        </p>
      </section>
    </div>
  );
}
