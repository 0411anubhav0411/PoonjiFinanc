import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import { FAQS } from "@/data/content";
import { useSeo } from "@/lib/seo";

const CATEGORIES = ["All", ...Array.from(new Set(FAQS.map((f) => f.category)))];

export default function Faq() {
  useSeo("FAQs — Poonji Finance", "Answers to common questions about loan facilitation, insurance, investments, eligibility, documents and charges.");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const faqs = FAQS.filter(
    (f) =>
      (cat === "All" || f.category === cat) &&
      (q === "" || f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="overline-tag">FAQs</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Questions, answered plainly
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              The things customers actually ask us — about loans, insurance, investments and how facilitation works.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" data-testid="faq-filters">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                data-testid={`faq-filter-${c.toLowerCase()}`}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  cat === c ? "border-blue-600 bg-blue-600/20 text-gold-light" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Input data-testid="faq-search" placeholder="Search questions…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs bg-secondary/60" />
        </div>

        <div className="mt-10 grid gap-3" data-testid="faq-list">
          {faqs.length === 0 && <p className="py-10 text-center text-muted-foreground" data-testid="faq-empty">No questions match your search.</p>}
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.03}>
                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                  <button
                    data-testid={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading text-base font-bold leading-snug">{f.q}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground sm:text-base" data-testid={`faq-a-${i}`}>{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
