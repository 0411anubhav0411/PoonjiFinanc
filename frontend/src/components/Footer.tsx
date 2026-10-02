import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { CONTACT, SERVICE_OPTIONS } from "@/data/content";

export function Footer({ onCallback }: { onCallback: () => void }) {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              One Platform. Multiple Financial Solutions. Loans, insurance, deposits and investments — facilitated transparently across 45+ partner institutions.
            </p>
            <Button data-testid="footer-callback" className="mt-6" size="sm" onClick={onCallback}>
              Request a Callback
            </Button>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">Services</h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              {SERVICE_OPTIONS.slice(0, 7).map((s) => (
                <li key={s}>
                  <Link to="/services" data-testid={`footer-service-${s.toLowerCase().replace(/[^a-z]+/g, "-")}`} className="transition-colors hover:text-sky-400">{s}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">Company</h3>
            <ul className="mt-4 grid gap-2.5 text-sm text-muted-foreground">
              <li><Link data-testid="footer-about" to="/about" className="transition-colors hover:text-sky-400">About Us</Link></li>
              <li><Link data-testid="footer-founders" to="/founders" className="transition-colors hover:text-sky-400">Our Founders</Link></li>
              <li><Link data-testid="footer-how" to="/how-it-works" className="transition-colors hover:text-sky-400">How It Works</Link></li>
              <li><Link data-testid="footer-calculators" to="/calculators" className="transition-colors hover:text-sky-400">Financial Tools</Link></li>
              <li><Link data-testid="footer-resources" to="/resources" className="transition-colors hover:text-sky-400">Resources</Link></li>
              <li><Link data-testid="footer-blog" to="/blog" className="transition-colors hover:text-sky-400">Blog</Link></li>
              <li><Link data-testid="footer-faqs" to="/faqs" className="transition-colors hover:text-sky-400">FAQs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading text-sm font-semibold tracking-wide text-foreground">Reach Us</h3>
            <ul className="mt-4 grid gap-3 text-sm text-muted-foreground">
              <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />{CONTACT.address}</li>
              <li><a data-testid="footer-phone" href={CONTACT.phoneHref} className="flex gap-2.5 transition-colors hover:text-sky-400"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />{CONTACT.phone}</a></li>
              <li><a data-testid="footer-email" href={`mailto:${CONTACT.email}`} className="flex gap-2.5 transition-colors hover:text-sky-400"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />{CONTACT.email}</a></li>
              <li className="flex gap-2.5"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />{CONTACT.hours}</li>
            </ul>
          </div>
        </div>
        <div className="mt-14 border-t border-border pt-8">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <Link data-testid="footer-disclaimer" to="/disclaimer" className="hover:text-sky-400">Disclaimer</Link>
            <Link data-testid="footer-privacy" to="/privacy" className="hover:text-sky-400">Privacy Policy</Link>
            <Link data-testid="footer-terms" to="/terms" className="hover:text-sky-400">Terms & Conditions</Link>
            <Link data-testid="footer-grievance" to="/grievance" className="hover:text-sky-400">Grievance Redressal</Link>
            <Link data-testid="footer-admin" to="/admin" className="hover:text-sky-400">Admin</Link>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground/80">
            Poonji Finance is a financial services facilitation and distribution platform. We do not lend, underwrite or manage money directly; all products are offered by the respective banks, NBFCs, insurers and investment platforms, and are subject to their terms, eligibility criteria and approval. Mutual fund investments are subject to market risks — read all scheme-related documents carefully. Nothing on this website constitutes investment advice or a guarantee of returns or approvals.
          </p>
          <p className="mt-4 text-xs text-muted-foreground/60">© {new Date().getFullYear()} Poonji Finance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
