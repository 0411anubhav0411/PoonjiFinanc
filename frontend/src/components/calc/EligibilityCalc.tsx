import { useState } from "react";
import { loanEligibility } from "@/lib/finance";
import { formatINR, formatINRCompact } from "@/lib/format";
import { SliderField } from "@/components/SliderField";
import { ResultRow } from "@/components/calc/shared";

export function EligibilityCalc() {
  const [income, setIncome] = useState(120000);
  const [existing, setExisting] = useState(15000);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(15);
  const [employment, setEmployment] = useState("Salaried");
  const { maxEmi, eligible } = loanEligibility(income, existing, rate, years);

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="elig-income" label="Monthly Income" value={income} min={20000} max={1000000} step={5000} onChange={setIncome} format={formatINR} />
        <SliderField testid="elig-existing" label="Existing EMIs (monthly)" value={existing} min={0} max={300000} step={1000} onChange={setExisting} format={formatINR} />
        <SliderField testid="elig-rate" label="Approx. Interest Rate (%)" value={rate} min={8} max={16} step={0.1} onChange={setRate} format={(v) => `${v.toFixed(1)}%`} />
        <SliderField testid="elig-years" label="Tenure (years)" value={years} min={1} max={30} onChange={setYears} format={(v) => `${v} yrs`} />
        <div className="grid gap-2">
          <label htmlFor="elig-employment" className="text-sm text-muted-foreground">Employment Type</label>
          <select id="elig-employment" data-testid="elig-employment" className="pf-select" value={employment} onChange={(e) => setEmployment(e.target.value)}>
            <option>Salaried</option>
            <option>Self-Employed / Business</option>
            <option>Professional (Doctor, CA, etc.)</option>
          </select>
        </div>
      </div>
      <div className="glass-card grid content-start gap-1 rounded-2xl p-6">
        <p className="overline-tag">Indicative Estimate</p>
        <div className="mt-4">
          <ResultRow testid="elig-amount" label="Estimated Loan Eligibility" value={formatINRCompact(eligible)} highlight />
          <ResultRow testid="elig-emi" label="Max Comfortable EMI (50% FOIR)" value={formatINR(maxEmi)} />
          <ResultRow testid="elig-profile" label="Profile" value={employment} />
        </div>
        <p className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-800" data-testid="elig-disclaimer">
          This is an indicative estimate only, assuming ~50% FOIR. Actual eligibility depends on credit score, employer/business profile, existing obligations and each lender's policy. Final approval rests solely with the lending institution.
        </p>
      </div>
    </div>
  );
}
