import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import type { BlogPostItem } from "@/lib/types";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, BadgeCheck, Calculator, PhoneCall, ShieldCheck, Timer } from "lucide-react";
import { Marquee } from "@/components/Marquee";
import { Reveal, SectionHead } from "@/components/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SliderField } from "@/components/SliderField";
import { buttonVariants } from "@/components/ui/button";
import { emi } from "@/lib/finance";
import { formatINR } from "@/lib/format";
import { BLOG_POSTS, IMG, SERVICE_VERTICALS, STATS, STEPS, WHY_POINTS } from "@/data/content";
import { useSeo } from "@/lib/seo";

function HeroLine({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 + i * 0.14, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function EmiSandbox() {
  const [amount, setAmount] = useState(2500000);
  const [years, setYears] = useState(10);
  const monthly = emi(amount, 9.5, years);
  return (
    <div className="glass-card float-slow rounded-3xl p-6 shadow-2xl shadow-blue-900/10 sm:p-8" data-testid="hero-emi-sandbox">
      <div className="flex items-center justify-between">
        <p className="overline-tag">Live EMI Sandbox</p>
        <Calculator className="h-4 w-4 text-gold" />
      </div>
      <div className="mt-6 grid gap-6">
        <SliderField testid="hero-emi-amount" label="Loan Amount" value={amount} min={100000} max={10000000} step={50000} onChange={setAmount} format={formatINR} />
        <SliderField testid="hero-emi-tenure" label="Tenure" value={years} min={1} max={25} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="mt-6 border-t border-border/70 pt-5">
        <p className="text-xs text-muted-foreground">Monthly EMI @ 9.5% p.a.</p>
        <p data-testid="hero-emi-value" className="mt-1 font-mono text-3xl font-bold text-gold">{formatINR(monthly)}</p>
      </div>
      <Link to="/calculators" data-testid="hero-emi-more" className="mt-4 inline-flex items-center gap-1.5 text-sm text-gold transition-colors hover:text-gold-light">
        Explore 16 financial tools <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

const BENTO_SPANS = [
  "lg:col-span-4", "lg:col-span-2",
  "lg:col-span-2", "lg:col-span-2", "lg:col-span-2",
  "lg:col-span-3", "lg:col-span-3", "lg:col-span-6",
];

export default function Home() {
  useSeo(
    "Poonji Finance — One Platform. Multiple Financial Solutions.",
    "Loans, insurance, fixed deposits and mutual funds facilitated transparently across 45+ banks, NBFCs, insurers and investment platforms."
  );
  const blogQ = useQuery({ queryKey: ["blog"], queryFn: () => apiGet<BlogPostItem[]>("/blog") });
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <div>
      <section ref={heroRef} className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pt-20 pb-24 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:pt-28 lg:pb-32">
          <div>
            <motion.p
              className="overline-tag inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BadgeCheck className="h-3.5 w-3.5" /> One Platform. Multiple Financial Solutions.
            </motion.p>
            <h1 className="mt-6 font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl lg:text-6xl">
              <HeroLine i={0}>Your Financial</HeroLine>
              <HeroLine i={1}>Goals. <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">Our</span></HeroLine>
              <HeroLine i={2}><span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">Guidance.</span></HeroLine>
            </h1>
            <motion.p
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              Loans, insurance, fixed deposits and mutual funds — compared and facilitated across 45+ banks, NBFCs, insurers and investment platforms. One accountable desk, transparent process, zero jargon.
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
            >
              <Link to="/contact" data-testid="hero-get-started" className={buttonVariants({ size: "lg" })}>
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" data-testid="hero-explore" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Explore Services
              </Link>
            </motion.div>
            <motion.div
              className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.8 }}
            >
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Transparent facilitation</span>
              <span className="flex items-center gap-2"><Timer className="h-4 w-4 text-emerald-600" /> 30-min callback pledge</span>
              <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4 text-emerald-600" /> Human advisors, not bots</span>
            </motion.div>
          </div>
          <motion.div style={{ y }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
            <EmiSandbox />
          </motion.div>
        </div>
      </section>

      <Marquee />

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead
          overline="What We Facilitate"
          title="Every major financial product, under one roof"
          sub="Ten product verticals, one accountable team. We compare suitable options across our partner network before you commit to anything."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-6" data-testid="services-bento">
          {SERVICE_VERTICALS.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05} className={BENTO_SPANS[i]}>
              <Link
                to="/services"
                data-testid={`bento-${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/60 hover:shadow-lg hover:shadow-blue-900/10"
              >
                <s.icon className="h-7 w-7 text-gold" />
                <h3 className="mt-4 font-heading text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Know more <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8" data-testid="stats-strip">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <div className="rounded-2xl border border-border bg-background/60 p-6 text-center">
                <p className="font-heading text-3xl font-bold tracking-tight text-gold">{s.value}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-border">
              <img src={IMG.consult} alt="Financial consultation at Poonji Finance" className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <p className="absolute bottom-5 left-6 max-w-sm font-heading text-lg font-bold">Advice that starts with your goal, not our product.</p>
            </div>
          </Reveal>
          <div>
            <SectionHead
              align="left"
              overline="Why Poonji Finance"
              title="Built around the customer, not the commission"
              sub="We are facilitators — our job is to make the market legible to you, then get your application across the line cleanly."
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {WHY_POINTS.map((w, i) => (
                <Reveal key={w.title} delay={i * 0.05}>
                  <div className="rounded-xl border border-border bg-card p-5">
                    <p className="font-mono text-xs text-gold">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-2 font-heading text-base font-bold">{w.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{w.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead
            overline="How It Works"
            title="Five steps from enquiry to completion"
            sub="A simple, transparent pipeline — you always know what happens next."
          />
          <div className="mt-14 grid gap-4 md:grid-cols-3 lg:grid-cols-5" data-testid="steps-strip">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07}>
                <div className="relative h-full rounded-2xl border border-border bg-background/60 p-6">
                  <p className="font-mono text-2xl font-bold text-blue-600/70">{s.n}</p>
                  <h3 className="mt-3 font-heading text-base font-bold leading-snug">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link to="/how-it-works" data-testid="steps-more" className="inline-flex items-center gap-1.5 text-sm text-gold hover:text-gold-light">
              See the full process <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHead
              align="left"
              overline="Quick Enquiry"
              title="Tell us what you need — we take it from there"
              sub="Sixty seconds of your time. A specialist calls back within one business day — usually much sooner."
            />
            <Reveal delay={0.1}>
              <div className="mt-8 overflow-hidden rounded-3xl border border-border">
                <img src={IMG.family} alt="Indian family at their new home" className="aspect-[16/9] w-full object-cover" loading="lazy" />
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <EnquiryForm />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead overline="From the Blog" title="Finance, explained in plain language" />
          <div className="mt-14 grid gap-4 md:grid-cols-3" data-testid="blog-teaser">
            {(blogQ.data ?? []).slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.07}>
                <Link to={`/blog/${p.slug}`} data-testid={`blog-teaser-${p.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-blue-600/60">
                  {p.image && (
                    <div className="overflow-hidden">
                      <img src={p.image} alt={p.title} className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="overline-tag">{p.category}</p>
                    <h3 className="mt-2 font-heading text-lg font-bold leading-snug">{p.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                    <p className="mt-4 text-xs text-muted-foreground/70">{p.read_time}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
