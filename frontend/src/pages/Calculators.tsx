import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmiGeneral, EmiHome, EmiPersonal } from "@/components/calc/LoanCalcs";
import { SipCalc, LumpsumCalc } from "@/components/calc/InvestCalcs";
import { FdCalc, RdCalc } from "@/components/calc/DepositCalcs";
import { EligibilityCalc } from "@/components/calc/EligibilityCalc";
import {
  StepUpSipCalc,
  SwpCalc,
  CagrCalc,
  SimpleInterestCalc,
  CompoundInterestCalc,
  InflationCalc,
  RetirementCalc,
  GoalCalc,
} from "@/components/calc/AdvancedCalcs";
import { useSeo } from "@/lib/seo";

const TABS = [
  { id: "emi", label: "Loan EMI", node: <EmiGeneral /> },
  { id: "home", label: "Home Loan", node: <EmiHome /> },
  { id: "personal", label: "Personal Loan", node: <EmiPersonal /> },
  { id: "eligibility", label: "Eligibility", node: <EligibilityCalc /> },
  { id: "sip", label: "SIP", node: <SipCalc /> },
  { id: "stepup", label: "Step-Up SIP", node: <StepUpSipCalc /> },
  { id: "lumpsum", label: "Lump Sum", node: <LumpsumCalc /> },
  { id: "swp", label: "SWP", node: <SwpCalc /> },
  { id: "cagr", label: "CAGR", node: <CagrCalc /> },
  { id: "fd", label: "FD", node: <FdCalc /> },
  { id: "rd", label: "RD", node: <RdCalc /> },
  { id: "simple", label: "Simple Int", node: <SimpleInterestCalc /> },
  { id: "compound", label: "Compound Int", node: <CompoundInterestCalc /> },
  { id: "inflation", label: "Inflation", node: <InflationCalc /> },
  { id: "retirement", label: "Retirement", node: <RetirementCalc /> },
  { id: "goal", label: "Goal Plan", node: <GoalCalc /> },
];

export default function Calculators() {
  useSeo("Financial Calculators — Poonji Finance", "16 free calculators — EMI, home loan, SIP, step-up SIP, SWP, FD, RD, CAGR, inflation, retirement and goal planning.");
  return (
    <div>
      <section className="hero-bg grain relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
          <Reveal>
            <p className="overline-tag">Financial Tools</p>
            <h1 className="mt-4 max-w-3xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tighter sm:text-5xl">
              Run the numbers <span className="bg-gradient-to-r from-blue-500 to-[#B08A1E] bg-clip-text text-transparent">before you sign anything</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Sixteen interactive calculators for loans, deposits, investments and life goals — live results as you drag. Free, instant, no sign-up.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Tabs defaultValue="emi" data-testid="calculator-tabs">
          <TabsList variant="line" className="mb-12 flex h-auto w-full flex-wrap justify-start gap-x-6 gap-y-2">
            {TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id} data-testid={`calc-tab-${t.id}`} className="text-sm">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {TABS.map((t) => (
            <TabsContent key={t.id} value={t.id} data-testid={`calc-panel-${t.id}`}>
              {t.node}
            </TabsContent>
          ))}
        </Tabs>

        <Reveal className="mt-16">
          <p className="rounded-2xl border border-border bg-card p-5 text-xs leading-relaxed text-muted-foreground" data-testid="calc-disclaimer">
            All calculators provide indicative estimates for illustration only. Actual EMIs, returns, eligibility and maturity values depend on the terms of the respective institution, applicable interest rate movements, taxation and fees. These outputs are not financial advice.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="flex flex-col items-center gap-6 rounded-3xl border border-blue-600/30 bg-gradient-to-r from-blue-100/80 to-amber-100/50 p-10 text-center">
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">Like the numbers? Let's make them real.</h2>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              Share your requirement and we'll match it against live offers from 45+ partner institutions.
            </p>
            <Link to="/contact" data-testid="calc-cta" className={buttonVariants({ size: "lg" })}>
              Get a Personalised Quote <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
