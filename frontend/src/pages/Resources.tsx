import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { GUIDES } from "@/data/content";
import { useSeo } from "@/lib/seo";

const GLOSSARY = [
  { term: "EMI", def: "Equated Monthly Instalment — fixed monthly loan repayment covering principal + interest." },
  { term: "CIBIL Score", def: "A 300–900 credit score summarising your repayment history; 750+ unlocks the best offers." },
  { term: "FOIR", def: "Fixed Obligations to Income Ratio — the share of income already committed to EMIs." },
  { term: "NAV", def: "Net Asset Value — the per-unit price of a mutual fund, computed daily." },
  { term: "SIP", def: "Systematic Investment Plan — automatic monthly mutual fund investing." },
  { term: "ELSS", def: "Equity Linked Savings Scheme — tax-saving mutual fund under Section 80C, 3-year lock-in." },
  { term: "DICGC", def: "Deposit insurance covering up to ₹5 lakh per depositor per bank, including interest." },
  { term: "Balance Transfer", def: "Moving an existing loan to a new lender for a lower rate or better terms." },
  { term: "Sum Assured", def: "The guaranteed payout amount of a life insurance policy." },
  { term: "Lumpsum", def: "A one-time investment of a single large amount, as opposed to periodic SIPs." },
];

export default function Resources() {
  useSeo("Financial Guides & Resources — Poonji Finance", "Plain-language guides on credit scores, EMIs, SIPs, insurance and personal finance, plus a glossary of essential terms.");
  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">Resources & Financial Guides</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Learn the system, <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">then use it</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Plain-language guides on loans, insurance, deposits and investing — the same explanations our advisors give across the table.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead align="left" overline="Guides" title="Start with the fundamentals" />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" data-testid="guides-grid">
          {GUIDES.map((g, i) => (
            <Reveal key={g.title} delay={i * 0.04}>
              <Link
                to={`/blog/${g.slug}`}
                data-testid={`guide-${g.title.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/60"
              >
                <BookOpen className="h-5 w-5 text-gold" />
                <h3 className="mt-4 font-heading text-base font-bold leading-snug">{g.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.desc}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Read guide <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead align="left" overline="Glossary" title="Terms worth knowing" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="glossary-grid">
            {GLOSSARY.map((g, i) => (
              <Reveal key={g.term} delay={i * 0.03}>
                <div className="h-full rounded-2xl border border-border bg-background/60 p-5">
                  <p className="font-mono text-sm font-semibold text-gold">{g.term}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{g.def}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
