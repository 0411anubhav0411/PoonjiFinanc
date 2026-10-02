import { useState } from "react";
import { sipFutureValue, lumpsumFutureValue } from "@/lib/finance";
import { formatINR, formatINRCompact } from "@/lib/format";
import { SliderField } from "@/components/SliderField";
import { BreakdownDonut, ResultRow } from "@/components/calc/shared";

export function SipCalc() {
  const [monthly, setMonthly] = useState(25000);
  const [ret, setRet] = useState(12);
  const [years, setYears] = useState(15);
  const { invested, maturity, gains } = sipFutureValue(monthly, ret, years);
  const crore = maturity >= 1e7;
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="sip-monthly" label="Monthly SIP" value={monthly} min={500} max={200000} step={500} onChange={setMonthly} format={formatINR} />
        <SliderField testid="sip-return" label="Expected Return (% p.a.)" value={ret} min={4} max={20} step={0.5} onChange={setRet} format={(v) => `${v.toFixed(1)}%`} />
        <SliderField testid="sip-years" label="Duration (years)" value={years} min={1} max={35} onChange={setYears} format={(v) => `${v} yrs`} />
        {crore && (
          <p data-testid="sip-crorepati" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-600">
            Crorepati milestone — your discipline crosses ₹1 Crore.
          </p>
        )}
      </div>
      <div className="glass-card rounded-2xl p-6">
        <BreakdownDonut testid="sip-chart" a={invested} b={gains} labels={["Invested", "Est. Returns"]} />
        <div className="mt-4">
          <ResultRow testid="sip-maturity" label="Future Value" value={formatINR(maturity)} highlight />
          <ResultRow testid="sip-invested" label="Total Invested" value={formatINR(invested)} />
          <ResultRow testid="sip-gains" label="Estimated Returns" value={formatINR(gains)} />
        </div>
      </div>
    </div>
  );
}

export function LumpsumCalc() {
  const [amount, setAmount] = useState(1000000);
  const [ret, setRet] = useState(12);
  const [years, setYears] = useState(10);
  const { invested, maturity, gains } = lumpsumFutureValue(amount, ret, years);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="lump-amount" label="Investment Amount" value={amount} min={10000} max={20000000} step={10000} onChange={setAmount} format={formatINR} />
        <SliderField testid="lump-return" label="Expected Return (% p.a.)" value={ret} min={4} max={20} step={0.5} onChange={setRet} format={(v) => `${v.toFixed(1)}%`} />
        <SliderField testid="lump-years" label="Period (years)" value={years} min={1} max={30} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="glass-card rounded-2xl p-6">
        <BreakdownDonut testid="lump-chart" a={invested} b={gains} labels={["Invested", "Wealth Gain"]} />
        <div className="mt-4">
          <ResultRow testid="lump-maturity" label="Final Corpus" value={formatINR(maturity)} highlight />
          <ResultRow testid="lump-invested" label="Invested Capital" value={formatINR(invested)} />
          <ResultRow testid="lump-gains" label="Wealth Gain" value={formatINRCompact(gains)} />
        </div>
      </div>
    </div>
  );
}
