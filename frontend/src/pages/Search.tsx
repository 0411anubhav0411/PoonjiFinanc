import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Search as SearchIcon } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { useSeo } from "@/lib/seo";
import { BLOG_POSTS, FAQS, GUIDES, SERVICE_VERTICALS } from "@/data/content";
import type { BlogPostItem, FinanceUpdate, PartnerPublic, Rate } from "@/lib/types";

const CALCULATORS = [
  { name: "Loan EMI Calculator", path: "/calculators" },
  { name: "Home Loan EMI Calculator", path: "/calculators" },
  { name: "Personal Loan EMI Calculator", path: "/calculators" },
  { name: "Loan Eligibility Calculator", path: "/calculators" },
  { name: "SIP Calculator", path: "/calculators" },
  { name: "Step-Up SIP Calculator", path: "/calculators" },
  { name: "Lump Sum Calculator", path: "/calculators" },
  { name: "SWP Calculator", path: "/calculators" },
  { name: "CAGR Calculator", path: "/calculators" },
  { name: "FD Calculator", path: "/calculators" },
  { name: "RD Calculator", path: "/calculators" },
  { name: "Retirement Calculator", path: "/calculators" },
  { name: "Goal-Based Investment Calculator", path: "/calculators" },
];

const hit = (q: string, ...fields: (string | undefined | null)[]) =>
  fields.some((f) => f?.toLowerCase().includes(q));

interface ResultGroup {
  title: string;
  items: { label: string; sub?: string; path: string; testid: string }[];
}

export default function Search() {
  useSeo("Search — Poonji Finance", "Search services, interest rates, calculators, guides, blogs, FAQs and partners.");
  const [q, setQ] = useState("");
  const query = q.trim().toLowerCase();
  const active = query.length >= 2;

  const rates = useQuery({ queryKey: ["search-rates"], queryFn: () => apiGet<Rate[]>("/rates"), enabled: active });
  const partners = useQuery({ queryKey: ["search-partners"], queryFn: () => apiGet<PartnerPublic[]>("/partners"), enabled: active });
  const updates = useQuery({ queryKey: ["search-updates"], queryFn: () => apiGet<FinanceUpdate[]>("/updates"), enabled: active });
  const blog = useQuery({ queryKey: ["search-blog"], queryFn: () => apiGet<BlogPostItem[]>("/blog"), enabled: active });

  const groups: ResultGroup[] = !active
    ? []
    : [
        {
          title: "Services",
          items: SERVICE_VERTICALS.filter((s) => hit(query, s.title, s.tagline, ...s.points)).map((s) => ({
            label: s.title, sub: s.tagline, path: "/services", testid: `search-service-${s.slug}`,
          })),
        },
        {
          title: "Interest Rates",
          items: (rates.data ?? []).filter((r) => hit(query, r.institution, r.product, r.category)).map((r) => ({
            label: `${r.institution} — ${r.product}`, sub: r.rate_text, path: "/rates", testid: `search-rate-${r.id.slice(0, 8)}`,
          })),
        },
        {
          title: "Calculators",
          items: CALCULATORS.filter((c) => hit(query, c.name)).map((c) => ({
            label: c.name, path: c.path, testid: `search-calc-${c.name.toLowerCase().replace(/[^a-z]+/g, "-")}`,
          })),
        },
        {
          title: "Blog",
          items: (blog.data ?? []).filter((b) => hit(query, b.title, b.excerpt, b.category)).map((b) => ({
            label: b.title, sub: b.excerpt, path: `/blog/${b.slug}`, testid: `search-blog-${b.slug}`,
          })),
        },
        {
          title: "Guides",
          items: GUIDES.filter((g) => hit(query, g.title, g.desc)).map((g) => ({
            label: g.title, sub: g.desc, path: "/resources", testid: `search-guide-${g.title.toLowerCase().replace(/[^a-z]+/g, "-")}`,
          })),
        },
        {
          title: "FAQs",
          items: FAQS.filter((f) => hit(query, f.q, f.a)).map((f) => ({
            label: f.q, sub: f.category, path: "/faqs", testid: `search-faq-${f.q.toLowerCase().replace(/[^a-z]+/g, "-").slice(0, 40)}`,
          })),
        },
        {
          title: "Partners",
          items: (partners.data ?? []).filter((p) => hit(query, p.name, p.profile?.company, p.profile?.city, p.profile?.services)).map((p) => ({
            label: p.profile?.company ?? p.name, sub: p.profile?.city, path: "/partners", testid: `search-partner-${p.id.slice(0, 8)}`,
          })),
        },
        {
          title: "Finance Updates",
          items: (updates.data ?? []).filter((u) => hit(query, u.title, u.body, u.category)).map((u) => ({
            label: u.title, sub: u.category, path: "/updates", testid: `search-update-${u.id.slice(0, 8)}`,
          })),
        },
      ];

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8" data-testid="search-page">
      <p className="overline-tag">Search</p>
      <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">What are you looking for?</h1>
      <div className="relative mt-8">
        <SearchIcon className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          data-testid="search-input"
          autoFocus
          placeholder='Try "home loan", "SIP", "FD rates"…'
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-14 rounded-2xl bg-secondary/60 pl-12 text-base"
        />
      </div>

      {active && (
        <p className="mt-4 text-sm text-muted-foreground" data-testid="search-count">
          {total} result{total === 1 ? "" : "s"} for "{q}"
        </p>
      )}

      <div className="mt-8 grid gap-8">
        {groups.filter((g) => g.items.length > 0).map((g) => (
          <div key={g.title}>
            <p className="overline-tag">{g.title}</p>
            <div className="mt-3 grid gap-2">
              {g.items.slice(0, 6).map((item) => (
                <Link
                  key={item.testid}
                  to={item.path}
                  data-testid={item.testid}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:border-blue-700/50"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    {item.sub && <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{item.sub}</p>}
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-blue-800 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        ))}
        {active && total === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground" data-testid="search-empty">
            Nothing found for "{q}". Try a broader term, or submit an enquiry and we'll point you to the right place.
          </p>
        )}
      </div>
    </div>
  );
}
