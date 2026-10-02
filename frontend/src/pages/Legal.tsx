import { Reveal } from "@/components/Reveal";
import { CONTACT } from "@/data/content";
import { useSeo } from "@/lib/seo";

const PAGES: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
  disclaimer: {
    title: "Disclaimer",
    sections: [
      { h: "Our Role", p: "Poonji Finance operates as a financial services facilitation and distribution platform. We do not lend money, underwrite insurance, or manage investments directly. All financial products are offered and issued by the respective banks, non-banking financial companies, insurance companies, asset management companies and other regulated entities, and remain subject to their terms, conditions, eligibility criteria and approval processes." },
      { h: "No Guarantees", p: "Nothing on this website constitutes a guarantee of loan approval, insurance claim settlement, investment returns, or any specific financial outcome. Interest rates, premiums, returns and eligibility norms are indicative, change frequently, and are determined solely by the product provider." },
      { h: "Not Advice", p: "Content on this website — including articles, guides, calculators and tools — is for general information and education only and does not constitute investment, insurance, tax or legal advice. Mutual fund investments are subject to market risks; read all scheme-related documents carefully before investing." },
      { h: "Accuracy", p: "While we work to keep information current, we make no representation about the completeness or accuracy of rates, figures or third-party information displayed. Please verify all terms with the concerned institution before making any decision." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      { h: "What We Collect", p: "When you submit an enquiry or callback request, we collect your name, contact number, email, city, the service you're interested in, and any details you share about your requirement. We also collect standard analytics data (pages visited, device type) to improve the website." },
      { h: "How We Use It", p: "Your information is used to respond to your enquiry, connect you with suitable financial institutions or product providers at your request, and — with your consent — to keep you informed about relevant products. We do not sell your personal data." },
      { h: "Sharing", p: "Your details are shared only with the financial institutions or partners necessary to process your specific request, and only to the extent required. All partners are bound by their own regulatory obligations on data handling." },
      { h: "Your Rights", p: "You may request access, correction or deletion of your personal data at any time by writing to us at " + CONTACT.email + ". We retain enquiry records only as long as needed for service, legal and regulatory purposes." },
    ],
  },
  terms: {
    title: "Terms & Conditions",
    sections: [
      { h: "Use of This Website", p: "By using this website you agree to these terms. The website provides information about, and facilitation for, third-party financial products. Submitting an enquiry creates no obligation on either side; it is a request for a conversation." },
      { h: "Facilitation Only", p: "Any application you choose to make is a contract between you and the respective financial institution. Poonji Finance is not a party to that contract and is not responsible for the institution's decisions, timelines, pricing or service levels." },
      { h: "Calculators & Tools", p: "Calculators on this website produce indicative illustrations based on the inputs you provide and simplified assumptions. They are not quotes, offers, or advice." },
      { h: "Intellectual Property", p: "All content, branding and design on this website belong to Poonji Finance and may not be reproduced without written permission. These terms are governed by the laws of India; courts at Bengaluru have exclusive jurisdiction." },
    ],
  },
  grievance: {
    title: "Grievance Redressal",
    sections: [
      { h: "Step 1 — Tell Us", p: "Raise your concern via " + CONTACT.email + " or " + CONTACT.phone + ". Share your enquiry reference ID if you have one. We acknowledge every grievance within 2 working days." },
      { h: "Step 2 — Resolution", p: "A senior team member reviews your concern and responds with a resolution or a clear status update within 7 working days. Complex cases involving partner institutions may take up to 30 days, with weekly updates." },
      { h: "Step 3 — Escalation", p: "If your grievance relates to a financial product itself (a loan, policy or investment), you can escalate to the concerned institution's grievance cell, and subsequently to the relevant regulator — RBI (lending), IRDAI (insurance) or SEBI (investments) — through their respective portals." },
    ],
  },
};

export default function Legal({ kind }: { kind: "disclaimer" | "privacy" | "terms" | "grievance" }) {
  const page = PAGES[kind];
  useSeo(`${page.title} — Poonji Finance`, "Legal and compliance information for Poonji Finance customers and visitors.");
  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <Reveal>
            <p className="overline-tag">Legal & Compliance</p>
            <h1 className="mt-4 font-heading text-4xl font-extrabold tracking-tighter sm:text-5xl" data-testid={`legal-title-${kind}`}>{page.title}</h1>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10" data-testid={`legal-body-${kind}`}>
          {page.sections.map((s) => (
            <Reveal key={s.h}>
              <div>
                <h2 className="font-heading text-xl font-bold">{s.h}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-12 text-xs text-muted-foreground/70">Last updated: July 2026. These templates should be reviewed against Poonji Finance's actual registrations, licences and distributor status before publication.</p>
      </section>
    </div>
  );
}
