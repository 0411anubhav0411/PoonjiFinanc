import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CallbackDialog } from "@/components/CallbackDialog";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/data/content";
import { useSeo } from "@/lib/seo";

export default function HowItWorks() {
  useSeo("How It Works — Poonji Finance", "Five transparent steps from enquiry to completion — how Poonji Finance facilitates your loan, insurance or investment application.");
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <Reveal>
            <p className="overline-tag">How It Works</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Five steps. <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">Zero guesswork.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              From your first enquiry to final approval, here's exactly what happens — and what we handle for you at each stage.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative grid gap-10" data-testid="pipeline">
          <div className="absolute top-2 bottom-2 left-[27px] w-px bg-gradient-to-b from-blue-600/60 via-border to-transparent sm:left-[31px]" aria-hidden />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <motion.div
                className="relative flex gap-6 sm:gap-8"
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-600/40 bg-card font-mono text-lg font-bold text-gold sm:h-16 sm:w-16">
                  {s.n}
                </div>
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
                  <h2 className="font-heading text-lg font-bold sm:text-xl">{s.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">{s.text}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <p className="rounded-2xl border border-border bg-card p-5 text-xs leading-relaxed text-muted-foreground" data-testid="pipeline-disclaimer">
            Note: Poonji Finance facilitates your application; processing, approval, pricing and disbursal are performed by the concerned financial institution, subject to its policies and eligibility criteria. Timelines are indicative.
          </p>
        </Reveal>
      </section>

      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead
            overline="Step 1 Starts Here"
            title="Tell us your requirement"
            sub="The whole pipeline begins with this 60-second form."
          />
          <Reveal className="mt-12">
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <EnquiryForm compact />
            </div>
          </Reveal>
          <Reveal className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Prefer talking first?</p>
            <Button data-testid="how-callback" variant="outline" className="mt-3" onClick={() => setCallbackOpen(true)}>
              Request a Callback <ArrowRight className="h-4 w-4" />
            </Button>
          </Reveal>
        </div>
      </section>
      <CallbackDialog open={callbackOpen} onOpenChange={setCallbackOpen} />
    </div>
  );
}
