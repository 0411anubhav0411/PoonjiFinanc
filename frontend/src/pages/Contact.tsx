import { useState } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Reveal, SectionHead } from "@/components/Reveal";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CallbackDialog } from "@/components/CallbackDialog";
import { Button } from "@/components/ui/button";
import { CONTACT, IMG } from "@/data/content";

export default function Contact() {
  const [callbackOpen, setCallbackOpen] = useState(false);

  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="overline-tag">Contact Us</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Talk to a human, <span className="bg-gradient-to-r from-blue-500 to-[#D4AF37] bg-clip-text text-transparent">not a bot</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Call, WhatsApp, email or drop an enquiry — every route lands with a real advisor.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <div className="grid content-start gap-4">
            {[
              { icon: Phone, label: "Call Us", value: CONTACT.phone, href: CONTACT.phoneHref, testid: "contact-phone" },
              { icon: Mail, label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, testid: "contact-email" },
              { icon: MessageCircle, label: "WhatsApp", value: "Chat with us instantly", href: CONTACT.whatsapp, testid: "contact-whatsapp" },
              { icon: MapPin, label: "Office", value: CONTACT.address, testid: "contact-address" },
              { icon: Clock, label: "Working Hours", value: CONTACT.hours, testid: "contact-hours" },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 0.05}>
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/15">
                    <c.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    {c.href ? (
                      <a data-testid={c.testid} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="text-sm font-semibold text-foreground transition-colors hover:text-gold">
                        {c.value}
                      </a>
                    ) : (
                      <p data-testid={c.testid} className="text-sm font-semibold text-foreground">{c.value}</p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <Button data-testid="contact-callback" size="lg" className="w-full" onClick={() => setCallbackOpen(true)}>
                Request a Callback
              </Button>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="relative overflow-hidden rounded-2xl border border-border">
                <img src={IMG.skyline} alt="Poonji Finance office district" className="aspect-[16/9] w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/90 to-transparent p-5">
                  <p className="text-sm text-muted-foreground">Bengaluru · Serving customers across India</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="glass-card rounded-3xl p-6 sm:p-8">
              <SectionHead align="left" overline="Enquiry Form" title="Send us your requirement" />
              <div className="mt-8">
                <EnquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <CallbackDialog open={callbackOpen} onOpenChange={setCallbackOpen} />
    </div>
  );
}
