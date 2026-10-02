import { useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import { Button } from "@/components/ui/button";
import { SERVICE_OPTIONS, SERVICE_VERTICALS } from "@/data/content";
import { useSeo } from "@/lib/seo";

export default function Services() {
  useSeo("Our Services — Poonji Finance", "Home loans, business and MSME finance, personal and vehicle loans, insurance, fixed deposits, mutual funds and investment facilitation.");
  const formRef = useRef<HTMLDivElement>(null);
  const [service, setService] = useState<string>(SERVICE_OPTIONS[0]);
  const [formKey, setFormKey] = useState(0);

  const enquire = (label: string) => {
    const match = SERVICE_OPTIONS.find((o) => label.toLowerCase().includes(o.split(" ")[0].toLowerCase()));
    setService(match ?? SERVICE_OPTIONS[0]);
    setFormKey((k) => k + 1);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">Our Services</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Every financial product you'll need, <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">facilitated properly</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Loans, insurance, deposits and investments — compared across 45+ partner institutions and processed with you, end to end. New products are added as our partner network grows.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2" data-testid="services-grid">
          {SERVICE_VERTICALS.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 2) * 0.08}>
              <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 transition-all duration-300 hover:border-blue-600/60 sm:p-8">
                <div className="flex items-start justify-between gap-4">
                  <s.icon className="h-8 w-8 text-gold" />
                  <span className="font-mono text-xs text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-5 font-heading text-xl font-bold sm:text-2xl">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.tagline}</p>
                <ul className="mt-5 grid gap-2.5">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {p}
                    </li>
                  ))}
                </ul>
                <Button
                  data-testid={`service-enquire-${s.slug}`}
                  variant="outline"
                  className="mt-6 w-fit"
                  onClick={() => enquire(s.title)}
                >
                  Enquire About This <ArrowRight className="h-4 w-4" />
                </Button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 text-xs leading-relaxed text-muted-foreground" data-testid="services-disclosure">
            Disclosure: Poonji Finance acts as a facilitator/distributor. Loan approval, interest rates, insurance underwriting and investment product terms are decided solely by the respective banks, NBFCs, insurers and asset management companies. Insurance is the subject matter of solicitation; mutual fund investments are subject to market risks. Only products we are legally and regulatorily permitted to facilitate are offered.
          </p>
        </Reveal>
      </section>

      <section ref={formRef} className="border-t border-border bg-card/30 scroll-mt-20">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead
            overline="Service Enquiry"
            title="Interested in any of these? Tell us."
            sub="Pick a service, share the basics, and a specialist calls you back with suitable options."
          />
          <Reveal className="mt-12">
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <EnquiryForm key={formKey} defaultService={service} />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
