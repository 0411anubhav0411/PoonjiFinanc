import { useState } from "react";
import { emiBreakdown } from "@/lib/finance";
import { formatINR } from "@/lib/format";
import { SliderField } from "@/components/SliderField";
import { BreakdownDonut, ResultRow } from "@/components/calc/shared";

function EmiCore({
  amount, setAmount, rate, setRate, years, setYears,
  minAmount, maxAmount, minRate, maxRate, minYears, maxYears, stepAmount = 10000,
  extra,
  idPrefix,
}: {
  amount: number; setAmount: (v: number) => void;
  rate: number; setRate: (v: number) => void;
  years: number; setYears: (v: number) => void;
  minAmount: number; maxAmount: number; minRate: number; maxRate: number; minYears: number; maxYears: number;
  stepAmount?: number;
  extra?: React.ReactNode;
  idPrefix: string;
}) {
  const { monthly, total, interest } = emiBreakdown(amount, rate, years);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        {extra}
        <SliderField testid={`${idPrefix}-amount`} label="Loan Amount" value={amount} min={minAmount} max={maxAmount} step={stepAmount} onChange={setAmount} format={formatINR} />
        <SliderField testid={`${idPrefix}-rate`} label="Interest Rate (% p.a.)" value={rate} min={minRate} max={maxRate} step={0.05} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
        <SliderField testid={`${idPrefix}-tenure`} label="Tenure (years)" value={years} min={minYears} max={maxYears} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="glass-card rounded-2xl p-6">
        <BreakdownDonut testid={`${idPrefix}-chart`} a={amount} b={interest} labels={["Principal", "Interest"]} />
        <div className="mt-4">
          <ResultRow testid={`${idPrefix}-emi`} label="Monthly EMI" value={formatINR(monthly)} highlight />
          <ResultRow testid={`${idPrefix}-interest`} label="Total Interest" value={formatINR(interest)} />
          <ResultRow testid={`${idPrefix}-total`} label="Total Amount Payable" value={formatINR(total)} />
        </div>
      </div>
    </div>
  );
}

export function EmiGeneral() {
  const [amount, setAmount] = useState(2500000);
  const [rate, setRate] = useState(9.5);
  const [years, setYears] = useState(10);
  return <EmiCore idPrefix="emi" amount={amount} setAmount={setAmount} rate={rate} setRate={setRate} years={years} setYears={setYears} minAmount={100000} maxAmount={30000000} minRate={6} maxRate={24} minYears={1} maxYears={30} />;
}

export function EmiPersonal() {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(4);
  const fee = amount * 0.02;
  return (
    <div>
      <EmiCore idPrefix="ploan" amount={amount} setAmount={setAmount} rate={rate} setRate={setRate} years={years} setYears={setYears} minAmount={50000} maxAmount={4000000} minRate={10.5} maxRate={24} minYears={1} maxYears={5} stepAmount={25000} />
      <p className="mt-6 text-xs text-muted-foreground" data-testid="ploan-fee-note">
        Indicative processing fee at 2% + GST: <span className="font-mono text-gold">{formatINR(fee)}</span>. Actual fees vary by lender.
      </p>
    </div>
  );
}

export function EmiHome() {
  const [property, setProperty] = useState(8000000);
  const [down, setDown] = useState(1600000);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);
  const loan = Math.max(0, property - down);
  return (
    <EmiCore
      idPrefix="hloan"
      amount={loan}
      setAmount={(v) => setDown(Math.max(0, property - v))}
      rate={rate} setRate={setRate} years={years} setYears={setYears}
      minAmount={500000} maxAmount={50000000} minRate={7} maxRate={12} minYears={5} maxYears={30} stepAmount={100000}
      extra={
        <>
          <SliderField testid="hloan-property" label="Property Value" value={property} min={1500000} max={60000000} step={100000} onChange={setProperty} format={formatINR} />
          <SliderField testid="hloan-down" label="Down Payment" value={down} min={0} max={Math.max(0, property - 500000)} step={50000} onChange={setDown} format={formatINR} />
        </>
      }
    />
  );
}
