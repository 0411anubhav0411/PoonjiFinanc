import { useState } from "react";
import { fdMaturity, rdMaturity } from "@/lib/finance";
import { formatINR } from "@/lib/format";
import { SliderField } from "@/components/SliderField";
import { BreakdownDonut, ResultRow } from "@/components/calc/shared";

export function FdCalc() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(7.1);
  const [years, setYears] = useState(5);
  const [freq, setFreq] = useState("4");
  const { maturity, interest } = fdMaturity(amount, rate, years, Number(freq));
  const senior = fdMaturity(amount, rate + 0.5, years, Number(freq));
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="fd-amount" label="Deposit Amount" value={amount} min={10000} max={10000000} step={10000} onChange={setAmount} format={formatINR} />
        <SliderField testid="fd-rate" label="Interest Rate (% p.a.)" value={rate} min={3} max={9.5} step={0.05} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
        <SliderField testid="fd-years" label="Tenure (years)" value={years} min={1} max={10} onChange={setYears} format={(v) => `${v} yrs`} />
        <div className="grid gap-2">
          <label htmlFor="fd-freq" className="text-sm text-muted-foreground">Compounding Frequency</label>
          <select id="fd-freq" data-testid="fd-freq" className="pf-select" value={freq} onChange={(e) => setFreq(e.target.value)}>
            <option value="4">Quarterly (typical)</option>
            <option value="12">Monthly</option>
            <option value="2">Half-yearly</option>
            <option value="1">Yearly</option>
          </select>
        </div>
      </div>
      <div className="glass-card rounded-2xl p-6">
        <BreakdownDonut testid="fd-chart" a={amount} b={interest} labels={["Deposit", "Interest"]} />
        <div className="mt-4">
          <ResultRow testid="fd-maturity" label="Maturity Amount" value={formatINR(maturity)} highlight />
          <ResultRow testid="fd-interest" label="Interest Earned" value={formatINR(interest)} />
          <ResultRow testid="fd-senior" label="Senior Citizen (+0.50%)" value={formatINR(senior.maturity)} />
        </div>
      </div>
    </div>
  );
}

export function RdCalc() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(6.8);
  const [months, setMonths] = useState(36);
  const { invested, maturity, interest } = rdMaturity(monthly, rate, months);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="rd-monthly" label="Monthly Deposit" value={monthly} min={500} max={100000} step={500} onChange={setMonthly} format={formatINR} />
        <SliderField testid="rd-rate" label="Interest Rate (% p.a.)" value={rate} min={3} max={9} step={0.05} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
        <SliderField testid="rd-months" label="Tenure (months)" value={months} min={6} max={120} step={6} onChange={setMonths} format={(v) => `${v} mo`} />
      </div>
      <div className="glass-card rounded-2xl p-6">
        <BreakdownDonut testid="rd-chart" a={invested} b={interest} labels={["Invested", "Interest"]} />
        <div className="mt-4">
          <ResultRow testid="rd-maturity" label="Maturity Proceeds" value={formatINR(maturity)} highlight />
          <ResultRow testid="rd-invested" label="Total Deposited" value={formatINR(invested)} />
          <ResultRow testid="rd-interest" label="Interest Earned" value={formatINR(interest)} />
        </div>
      </div>
    </div>
  );
}
