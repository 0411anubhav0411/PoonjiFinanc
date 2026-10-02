import { Link } from "react-router-dom";
import { ArrowRight, Eye, HeartHandshake, Scale, Sparkles, Target, Users } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { IMG, STATS } from "@/data/content";
import { useSeo } from "@/lib/seo";

const VALUES = [
  { icon: Eye, title: "Transparency", text: "Rates, fees and commissions disclosed upfront. Always." },
  { icon: Scale, title: "Integrity", text: "We recommend what fits the customer, not what pays the most." },
  { icon: HeartHandshake, title: "Customer First", text: "Your goal anchors every conversation and every comparison." },
  { icon: Sparkles, title: "Professionalism", text: "Trained advisors, documented processes, honest timelines." },
  { icon: Users, title: "Accessibility", text: "Plain language, patient explanations, no jargon walls." },
  { icon: Target, title: "Long-Term Relationships", text: "We stay after the transaction — reviews, renewals, rebalancing." },
];

export default function About() {
  useSeo("About Us — Poonji Finance", "Our story, vision, mission and values — a financial facilitation platform built on transparency and customer-first guidance.");
  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">About Us</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Finance is complicated. <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">Accessing it shouldn't be.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Poonji Finance is a financial services facilitation and distribution platform. We exist because capable people — salaried professionals, business owners, families — routinely get lost between fifty lenders, a hundred schemes and a thousand pages of fine print. We make the market legible, then walk the process with you.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHead align="left" overline="Our Story" title="Started at a bank desk, built for the customer side of it" />
            <Reveal delay={0.1}>
              <div className="mt-6 grid gap-4 text-base leading-relaxed text-muted-foreground">
                <p>
                  Our founders spent years inside banks, NBFCs and insurance distribution. They watched the same scene repeat: a customer with a genuine need and a decent profile, turned away or overpaying — not because better options didn't exist, but because no one had the incentive to show them.
                </p>
                <p>
                  Poonji Finance was founded to sit on the customer's side of the table. As facilitators and distributors working with 45+ institutions, we compare the market first and recommend second. Our revenue comes from partners, our loyalty belongs to customers — and we disclose how that works, in writing.
                </p>
                <p>
                  Today we facilitate home loans and MSME credit, life and health protection, deposits and long-term investments — but the product was never the point. The point is a financial decision you fully understand before you sign it.
                </p>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <img src={IMG.skyline} alt="Mumbai financial district" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="h-full rounded-3xl border border-border bg-background/60 p-8">
              <p className="overline-tag">Our Vision</p>
              <p className="mt-4 font-heading text-2xl font-bold leading-snug">
                A trusted financial services platform that makes financial products easier to understand and access — for every Indian household and enterprise.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full rounded-3xl border border-border bg-background/60 p-8">
              <p className="overline-tag">Our Mission</p>
              <p className="mt-4 font-heading text-2xl font-bold leading-snug">
                To simplify financial decision-making by connecting customers with appropriate financial products and service providers — transparently, responsibly, end to end.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead overline="Our Values" title="What we refuse to compromise on" />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="values-grid">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-colors hover:border-blue-600/50">
                <v.icon className="h-6 w-6 text-gold" />
                <h3 className="mt-4 font-heading text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-6 text-center">
              <p className="font-heading text-3xl font-bold text-gold">{s.value}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <Reveal className="mt-14 text-center">
          <Link to="/founders" data-testid="about-founders-cta" className={buttonVariants({ size: "lg" })}>
            Meet Our Founders <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
