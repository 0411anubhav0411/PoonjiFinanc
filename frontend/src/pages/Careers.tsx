import { ArrowRight, GraduationCap, HeartHandshake, MapPin, TrendingUp } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";
import { CONTACT } from "@/data/content";

const ROLES = [
  {
    title: "Relationship Manager — Loan Facilitation",
    location: "Ghaziabad, UP",
    type: "Full-time",
    desc: "Own customer relationships end-to-end: understand requirements, coordinate with partner banks and NBFCs, and shepherd applications from enquiry to disbursal.",
  },
  {
    title: "Insurance & Investment Advisor",
    location: "Ghaziabad, UP",
    type: "Full-time",
    desc: "Guide families on term, health and general insurance plus mutual fund investments — plain language, suitability first, no mis-selling. Ever.",
  },
  {
    title: "Customer Success Associate",
    location: "Ghaziabad, UP · Hybrid",
    type: "Full-time",
    desc: "Be the voice behind our 30-minute callback pledge — first response, documentation checklists, follow-ups, and turning anxious applicants into calm customers.",
  },
];

const PERKS = [
  { icon: HeartHandshake, title: "Ethics Before Targets", text: "We never push a product that doesn't fit. Your incentive is a happy customer, not a mis-sold policy." },
  { icon: GraduationCap, title: "Learn the Whole Market", text: "Loans, insurance, deposits, investments — you train across every vertical with real partner institutions." },
  { icon: TrendingUp, title: "Grow With a Young Firm", text: "Early team members shape processes, lead verticals, and grow into partnership tracks as we scale." },
];

export default function Careers() {
  useSeo("Careers — Poonji Finance", "Join Poonji Finance in Ghaziabad — roles across loan facilitation, insurance advisory and customer success. Ethics first, always.");

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">Careers</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Build a career on <span className="bg-gradient-to-r from-blue-500 to-[#D4AF37] bg-clip-text text-transparent">honest finance</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Poonji Finance is a young, founder-led firm with one non-negotiable: the customer comes first. If that sounds like a place you'd do your best work, we should talk.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHead overline="Why Poonji" title="What working here feels like" />
        <div className="mt-14 grid gap-4 md:grid-cols-3" data-testid="careers-perks">
          {PERKS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-border bg-card p-7">
                <p.icon className="h-7 w-7 text-gold" />
                <h3 className="mt-4 font-heading text-lg font-bold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead
            overline="Open Roles"
            title="Current openings"
            sub="Don't see your role but believe you'd fit? Write to us anyway — we read every application."
          />
          <div className="mt-14 grid gap-4" data-testid="careers-roles">
            {ROLES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06}>
                <article className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6 transition-colors hover:border-blue-600/60 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <div>
                    <h3 className="font-heading text-lg font-bold">{r.title}</h3>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" />{r.location}</span>
                      <span>{r.type}</span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
                  </div>
                  <a
                    data-testid={`careers-apply-${i}`}
                    href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Application: ${r.title}`)}`}
                    className={`${buttonVariants({ variant: "outline" })} shrink-0`}
                  >
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Send your CV to{" "}
              <a data-testid="careers-email" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Careers at Poonji Finance")}`} className="text-gold hover:text-gold-light">
                {CONTACT.email}
              </a>{" "}
              — tell us which role, and one financial product you'd explain to your grandmother.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
