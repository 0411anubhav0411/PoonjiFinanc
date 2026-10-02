import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { FOUNDERS } from "@/data/content";

export default function Founders() {
  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">Our Founders</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              The people behind <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">Poonji</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Two careers spent inside the financial system — and one shared conviction that customers deserve someone on their side of the table.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2" data-testid="founders-grid">
          {FOUNDERS.map((f, i) => (
            <Reveal key={f.name} delay={i * 0.1}>
              <article className="overflow-hidden rounded-3xl border border-border bg-card">
                <div className="relative">
                  <img src={f.image} alt={`${f.name}, ${f.role}`} className="aspect-[16/8] w-full object-cover object-top" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <h2 className="font-heading text-2xl font-bold">{f.name}</h2>
                    <p className="text-sm text-sky-400">{f.role}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{f.bio}</p>
                  <ul className="mt-6 grid gap-2.5">
                    {f.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
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
            <p className="mt-6 text-sm text-muted-foreground">— Aarav & Meera Sharma, Founders</p>
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
