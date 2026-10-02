import { useQuery } from "@tanstack/react-query";
import { AlertCircle } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import { useSeo } from "@/lib/seo";
import type { FinanceUpdate } from "@/lib/types";

export default function Updates() {
  useSeo("Banking & Finance Updates — Poonji Finance", "Current developments in lending rates, RBI policy, deposits, insurance and investments — dated and sourced.");
  const updates = useQuery({ queryKey: ["updates"], queryFn: () => apiGet<FinanceUpdate[]>("/updates") });

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="overline-tag">Banking & Finance Updates</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              What's happening <span className="bg-gradient-to-r from-blue-800 to-[#B08A1E] bg-clip-text text-transparent">in finance</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Dated, sourced updates on rates, regulation and markets — curated by the Poonji team, never recycled old news.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {updates.data?.length === 0 && (
          <p className="py-16 text-center text-muted-foreground" data-testid="updates-empty">No updates published yet — check back soon.</p>
        )}
        <div className="grid gap-4" data-testid="updates-list">
          {(updates.data ?? []).map((u, i) => (
            <Reveal key={u.id} delay={i * 0.04}>
              <article className={`rounded-2xl border p-6 ${u.important ? "border-amber-500/50 bg-amber-500/5" : "border-border bg-card"}`} data-testid={`update-${u.id.slice(0, 8)}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="overline-tag">{u.category}</span>
                  {u.important && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 font-medium text-amber-800">
                      <AlertCircle className="h-3 w-3" /> Important
                    </span>
                  )}
                </div>
                <h2 className="mt-3 font-heading text-lg font-bold leading-snug">{u.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{u.body}</p>
                <p className="mt-4 text-xs text-muted-foreground/70">
                  {new Date(u.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                  {u.source ? ` · Source: ${u.source}` : ""}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-xs leading-relaxed text-muted-foreground/80">
          Updates are for general awareness and are not investment advice. Always verify with the official source before acting.
        </p>
      </section>
    </div>
  );
}
