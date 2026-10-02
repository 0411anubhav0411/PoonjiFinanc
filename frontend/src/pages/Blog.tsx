import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Reveal } from "@/components/Reveal";
import { Input } from "@/components/ui/input";
import type { BlogPostItem } from "@/lib/types";
import { useSeo } from "@/lib/seo";

export default function Blog() {
  useSeo("Blog — Poonji Finance", "Plain-language insights on loans, insurance, mutual funds, deposits and personal finance from the Poonji Finance team.");
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const postsQ = useQuery({ queryKey: ["blog"], queryFn: () => apiGet<BlogPostItem[]>("/blog") });
  const categories = ["All", ...Array.from(new Set((postsQ.data ?? []).map((p) => p.category)))];
  const posts = (postsQ.data ?? []).filter(
    (p) =>
      (cat === "All" || p.category === cat) &&
      (q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.excerpt.toLowerCase().includes(q.toLowerCase()))
  );
  const [featured, ...rest] = posts;

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="overline-tag">Blog</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Insights, minus the jargon
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Loans, insurance, investments and personal finance — written to be understood, not to impress.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" data-testid="blog-filters">
            {categories.map((c) => (
              <button
                key={c}
                data-testid={`blog-filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  cat === c ? "border-blue-600 bg-blue-600/20 text-gold-light" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <Input
            data-testid="blog-search"
            placeholder="Search articles…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-xs bg-secondary/60"
          />
        </div>

        {posts.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground" data-testid="blog-empty">No articles match your search.</p>
        )}

        {featured && (
          <Reveal className="mt-12">
            <Link to={`/blog/${featured.slug}`} data-testid="blog-featured" className="group grid overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-blue-600/60 lg:grid-cols-2">
              {featured.image && (
                <div className="overflow-hidden">
                  <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
              )}
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <p className="overline-tag">Featured · {featured.category}</p>
                <h2 className="mt-3 font-heading text-2xl font-bold leading-snug sm:text-3xl">{featured.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">{featured.excerpt}</p>
                <p className="mt-6 text-xs text-muted-foreground/70">{featured.author} · {new Date(featured.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · {featured.read_time}</p>
              </div>
            </Link>
          </Reveal>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="blog-grid">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05}>
              <Link to={`/blog/${p.slug}`} data-testid={`blog-card-${p.slug}`} className="group block h-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/60">
                {p.image && (
                  <div className="overflow-hidden">
                    <img src={p.image} alt={p.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  </div>
                )}
                <div className="p-6">
                  <p className="overline-tag">{p.category}</p>
                  <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                  <p className="mt-4 text-xs text-muted-foreground/70">{p.author} · {new Date(p.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} · {p.read_time}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
