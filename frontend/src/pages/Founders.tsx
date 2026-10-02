import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { FOUNDERS } from "@/data/content";
import { useSeo } from "@/lib/seo";

export default function Founders() {
  useSeo("Our Founders — Poonji Finance", "Meet Balbir Singh Gogia, Harshual Singh Gogia and Harshita Singh Gogia — the founding family behind Poonji Finance.");
  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">Our Founders</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              The people behind <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">Poonji</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              A founding family with decades of combined experience across banking, insurance and operations — and one shared conviction: customers deserve someone on their side of the table.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" data-testid="founders-grid">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <article className="overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-100 via-card to-background">
                  <div className="absolute inset-0 opacity-40 [background:radial-gradient(circle_at_50%_120%,rgba(212,175,55,0.15),transparent_60%)]" />
                  {f.image ? (
                    <img src={f.image} alt={`${f.name}, ${f.role}`} className="relative aspect-[4/3] w-full object-cover object-top" loading="lazy" />
                  ) : (
                    <span className="relative my-14 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-[#B08A1E] font-heading text-3xl font-extrabold text-white shadow-xl shadow-blue-900/10">
                      {f.initials}
                    </span>
                  )}
                </div>
                <div className="border-t border-border px-6 pt-5 sm:px-8">
                  <h2 className="font-heading text-2xl font-bold">{f.name}</h2>
                  <p className="text-sm text-gold">{f.role}</p>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{f.bio}</p>
                  <ul className="mt-6 grid gap-2.5">
                    {f.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12">
            <Quote className="h-10 w-10 text-blue-600/50" />
            <blockquote className="mt-6 max-w-3xl font-heading text-xl font-bold leading-relaxed sm:text-2xl" data-testid="founders-message">
              "We started Poonji Finance because we kept meeting people who were doing everything right — earning, saving, trying — and still getting poor financial outcomes simply because no one explained the system to them honestly. Our promise is simple: we will always tell you what we earn, what a product truly costs, and whether you should buy it at all."
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">— Balbir, Harshual & Harshita Gogia, Poonji Finance</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/contact" data-testid="founders-contact-cta" className={buttonVariants({ size: "lg" })}>
                Start a Conversation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" data-testid="founders-process-cta" className={buttonVariants({ size: "lg", variant: "outline" })}>
                See How We Work
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10">
          <SectionHead
            overline="The Road Ahead"
            title="Where we're taking Poonji"
            sub="A customer portal with application tracking, deeper partner integrations, and financial education for every Indian household — built on the same transparent foundation."
          />
        </Reveal>
      </section>
    </div>
  );
}
