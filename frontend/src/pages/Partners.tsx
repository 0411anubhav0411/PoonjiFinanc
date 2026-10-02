import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, MapPin } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Reveal, SectionHead } from "@/components/Reveal";
import { useSeo } from "@/lib/seo";
import type { PartnerPublic } from "@/lib/types";

export default function Partners() {
  useSeo("Our Partners — Poonji Finance", "Find approved Poonji Finance channel partners, referral partners and financial consultants near you.");
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");

  const partners = useQuery({
    queryKey: ["partners", q, city],
    queryFn: () => apiGet<PartnerPublic[]>(`/partners?q=${encodeURIComponent(q)}&city=${encodeURIComponent(city)}`),
  });

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="overline-tag">Partner Directory</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Find an approved <span className="bg-gradient-to-r from-blue-800 to-[#B08A1E] bg-clip-text text-transparent">Poonji partner</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Channel partners, referral partners and financial consultants vetted by Poonji Finance.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Input data-testid="partner-search" placeholder="Search by name, company or service…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-md bg-secondary/60" />
          <Input data-testid="partner-city-filter" placeholder="Filter by city…" value={city} onChange={(e) => setCity(e.target.value)} className="max-w-xs bg-secondary/60" />
        </div>

        {partners.data?.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground" data-testid="partners-empty">
            No approved partners match your search yet. Check back soon — our network is growing.
          </p>
        )}

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="partners-grid">
          {(partners.data ?? []).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.04}>
              <article className="h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-700/40 hover:shadow-lg hover:shadow-blue-900/10">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-800 to-[#B08A1E] font-heading text-base font-bold text-white">
                    {(p.profile?.company ?? p.name).slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h2 className="font-heading text-base font-bold leading-snug">{p.profile?.company ?? p.name}</h2>
                    <p className="text-xs text-muted-foreground">{p.name}{p.profile?.designation ? ` · ${p.profile.designation}` : ""}</p>
                  </div>
                </div>
                {p.profile?.description && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.profile.description}</p>}
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  {p.profile?.category && <span>{p.profile.category}</span>}
                  {(p.profile?.city || p.profile?.state) && (
                    <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{[p.profile.city, p.profile.state].filter(Boolean).join(", ")}</span>
                  )}
                </div>
                {p.profile?.services && <p className="mt-2 text-xs text-muted-foreground">Services: {p.profile.services}</p>}
                <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" /> Poonji Finance — Approved Partner
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-12 rounded-2xl border border-border bg-card p-5 text-xs leading-relaxed text-muted-foreground" data-testid="partners-disclaimer">
          Listing in this directory indicates an approved business relationship with Poonji Finance. It does not constitute an endorsement of every service a partner may independently offer. Partner details are reviewed by Poonji Finance before publication.
        </p>

        <SectionHead
          overline="Become a Partner"
          title="Work with Poonji Finance"
          sub="Referral partners, channel partners, consultants and builders — apply for a partner account and grow with us."
        />
        <div className="mt-8 text-center">
          <a href="/signup" data-testid="partners-apply" className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800">
            Apply for Partner Account
          </a>
        </div>
      </section>
    </div>
  );
}
