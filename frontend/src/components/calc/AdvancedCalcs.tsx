import { useState } from "react";
import {
  stepUpSip,
  swp,
  cagr,
  simpleInterest,
  fdMaturity,
  inflationCost,
  retirementPlan,
  goalPlan,
} from "@/lib/finance";
import { formatINR, formatINRCompact } from "@/lib/format";
import { SliderField } from "@/components/SliderField";
import { BreakdownDonut, ResultRow } from "@/components/calc/shared";

export function StepUpSipCalc() {
  const [monthly, setMonthly] = useState(20000);
  const [stepUp, setStepUp] = useState(10);
  const [ret, setRet] = useState(12);
  const [years, setYears] = useState(15);
  const { invested, maturity, gains } = stepUpSip(monthly, stepUp, ret, years);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="stepup-monthly" label="Starting Monthly SIP" value={monthly} min={1000} max={200000} step={500} onChange={setMonthly} format={formatINR} />
        <SliderField testid="stepup-pct" label="Annual Step-Up (%)" value={stepUp} min={0} max={25} step={1} onChange={setStepUp} format={(v) => `${v}%`} />
        <SliderField testid="stepup-return" label="Expected Return (% p.a.)" value={ret} min={4} max={20} step={0.5} onChange={setRet} format={(v) => `${v.toFixed(1)}%`} />
        <SliderField testid="stepup-years" label="Duration (years)" value={years} min={1} max={35} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="glass-card rounded-2xl p-6">
        <BreakdownDonut testid="stepup-chart" a={invested} b={gains} labels={["Invested", "Est. Returns"]} />
        <div className="mt-4">
          <ResultRow testid="stepup-maturity" label="Future Value" value={formatINR(maturity)} highlight />
          <ResultRow testid="stepup-invested" label="Total Invested" value={formatINR(invested)} />
          <ResultRow testid="stepup-gains" label="Estimated Returns" value={formatINRCompact(gains)} />
        </div>
      </div>
    </div>
  );
}

export function SwpCalc() {
  const [initial, setInitial] = useState(5000000);
  const [withdrawal, setWithdrawal] = useState(40000);
  const [ret, setRet] = useState(9);
  const [years, setYears] = useState(20);
  const { withdrawn, remaining } = swp(initial, withdrawal, ret, years);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="swp-initial" label="Initial Investment" value={initial} min={500000} max={50000000} step={100000} onChange={setInitial} format={formatINR} />
        <SliderField testid="swp-withdrawal" label="Monthly Withdrawal" value={withdrawal} min={5000} max={300000} step={1000} onChange={setWithdrawal} format={formatINR} />
        <SliderField testid="swp-return" label="Expected Return (% p.a.)" value={ret} min={4} max={15} step={0.5} onChange={setRet} format={(v) => `${v.toFixed(1)}%`} />
        <SliderField testid="swp-years" label="Duration (years)" value={years} min={1} max={30} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="glass-card rounded-2xl p-6">
        <BreakdownDonut testid="swp-chart" a={withdrawn} b={remaining} labels={["Total Withdrawn", "Remaining"]} />
        <div className="mt-4">
          <ResultRow testid="swp-withdrawn" label="Total Withdrawn" value={formatINR(withdrawn)} highlight />
          <ResultRow testid="swp-remaining" label="Remaining Value" value={formatINR(remaining)} />
        </div>
        {remaining === 0 && (
          <p data-testid="swp-depleted" className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-800">
            At these settings the corpus depletes before {years} years. Lower the withdrawal or extend the horizon.
          </p>
        )}
      </div>
    </div>
  );
}

export function CagrCalc() {
  const [begin, setBegin] = useState(500000);
  const [end, setEnd] = useState(1500000);
  const [years, setYears] = useState(7);
  const rate = cagr(begin, end, years);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="cagr-begin" label="Beginning Value" value={begin} min={10000} max={20000000} step={10000} onChange={setBegin} format={formatINR} />
        <SliderField testid="cagr-end" label="Final Value" value={end} min={10000} max={50000000} step={10000} onChange={setEnd} format={formatINR} />
        <SliderField testid="cagr-years" label="Period (years)" value={years} min={1} max={30} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="glass-card grid content-start rounded-2xl p-6">
        <p className="overline-tag">Compound Annual Growth Rate</p>
        <p data-testid="cagr-result" className="mt-4 font-mono text-4xl font-bold text-gold">{rate.toFixed(2)}%</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {formatINR(begin)} grew to {formatINR(end)} in {years} years.
        </p>
      </div>
    </div>
  );
}

export function SimpleInterestCalc() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const { interest, total } = simpleInterest(principal, rate, years);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="si-principal" label="Principal" value={principal} min={10000} max={10000000} step={10000} onChange={setPrincipal} format={formatINR} />
        <SliderField testid="si-rate" label="Interest Rate (% p.a.)" value={rate} min={1} max={15} step={0.25} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
        <SliderField testid="si-years" label="Period (years)" value={years} min={1} max={20} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="glass-card grid content-start rounded-2xl p-6">
        <BreakdownDonut testid="si-chart" a={principal} b={interest} labels={["Principal", "Interest"]} />
        <div className="mt-4">
          <ResultRow testid="si-total" label="Total Value" value={formatINR(total)} highlight />
          <ResultRow testid="si-interest" label="Interest Earned" value={formatINR(interest)} />
        </div>
      </div>
    </div>
  );
}

export function CompoundInterestCalc() {
  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState("1");
  const { maturity, interest } = fdMaturity(principal, rate, years, Number(freq));
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="ci-principal" label="Principal" value={principal} min={10000} max={10000000} step={10000} onChange={setPrincipal} format={formatINR} />
        <SliderField testid="ci-rate" label="Interest Rate (% p.a.)" value={rate} min={1} max={15} step={0.25} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
        <SliderField testid="ci-years" label="Period (years)" value={years} min={1} max={30} onChange={setYears} format={(v) => `${v} yrs`} />
        <div className="grid gap-2">
          <label htmlFor="ci-freq" className="text-sm text-muted-foreground">Compounding Frequency</label>
          <select id="ci-freq" data-testid="ci-freq" className="pf-select" value={freq} onChange={(e) => setFreq(e.target.value)}>
            <option value="1">Yearly</option>
            <option value="2">Half-yearly</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
          </select>
        </div>
      </div>
      <div className="glass-card grid content-start rounded-2xl p-6">
        <BreakdownDonut testid="ci-chart" a={principal} b={interest} labels={["Principal", "Interest"]} />
        <div className="mt-4">
          <ResultRow testid="ci-total" label="Maturity Value" value={formatINR(maturity)} highlight />
          <ResultRow testid="ci-interest" label="Compound Interest" value={formatINR(interest)} />
        </div>
      </div>
    </div>
  );
}

export function InflationCalc() {
  const [cost, setCost] = useState(1000000);
  const [rate, setRate] = useState(6);
  const [years, setYears] = useState(15);
  const { future, increase } = inflationCost(cost, rate, years);
  const power = cost / Math.pow(1 + rate / 100, years);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="inf-cost" label="Cost Today" value={cost} min={50000} max={50000000} step={50000} onChange={setCost} format={formatINR} />
        <SliderField testid="inf-rate" label="Assumed Inflation (% p.a.)" value={rate} min={3} max={10} step={0.25} onChange={setRate} format={(v) => `${v.toFixed(2)}%`} />
        <SliderField testid="inf-years" label="Years Ahead" value={years} min={1} max={30} onChange={setYears} format={(v) => `${v} yrs`} />
      </div>
      <div className="glass-card grid content-start rounded-2xl p-6">
        <p className="overline-tag">The Silent Tax</p>
        <div className="mt-4">
          <ResultRow testid="inf-future" label={`Cost in ${years} years`} value={formatINR(future)} highlight />
          <ResultRow testid="inf-increase" label="Increase Due to Inflation" value={formatINR(increase)} />
          <ResultRow testid="inf-power" label={`Today's ${formatINR(cost)} will feel like`} value={formatINR(power)} />
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          This is why money kept idle loses value — and why long-term goals need growth assets, not just savings.
        </p>
      </div>
    </div>
  );
}

export function RetirementCalc() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(58);
  const [savings, setSavings] = useState(1000000);
  const [monthly, setMonthly] = useState(30000);
  const [ret, setRet] = useState(11);
  const [infl, setInfl] = useState(6);
  const [expense, setExpense] = useState(80000);
  const { years, corpus, required, gap, futureMonthlyExpense } = retirementPlan(
    age, Math.max(retireAge, age + 1), savings, monthly, ret, infl, expense
  );
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <SliderField testid="ret-age" label="Current Age" value={age} min={18} max={55} onChange={setAge} format={(v) => `${v} yrs`} />
        <SliderField testid="ret-retire-age" label="Retirement Age" value={retireAge} min={45} max={70} onChange={setRetireAge} format={(v) => `${v} yrs`} />
        <SliderField testid="ret-savings" label="Current Savings" value={savings} min={0} max={20000000} step={100000} onChange={setSavings} format={formatINR} />
        <SliderField testid="ret-monthly" label="Monthly Investment" value={monthly} min={0} max={300000} step={1000} onChange={setMonthly} format={formatINR} />
        <SliderField testid="ret-return" label="Expected Return (% p.a.)" value={ret} min={6} max={15} step={0.5} onChange={setRet} format={(v) => `${v.toFixed(1)}%`} />
        <SliderField testid="ret-inflation" label="Expected Inflation (%)" value={infl} min={4} max={9} step={0.25} onChange={setInfl} format={(v) => `${v.toFixed(2)}%`} />
        <SliderField testid="ret-expense" label="Monthly Expense Today" value={expense} min={20000} max={500000} step={5000} onChange={setExpense} format={formatINR} />
      </div>
      <div className="glass-card grid content-start rounded-2xl p-6">
        <p className="overline-tag">{years} Years to Retirement</p>
        <div className="mt-4">
          <ResultRow testid="ret-corpus" label="Projected Corpus" value={formatINRCompact(corpus)} highlight />
          <ResultRow testid="ret-required" label="Required Corpus (4% rule)" value={formatINRCompact(required)} />
          <ResultRow testid="ret-expense-future" label="Monthly Expense at Retirement" value={formatINR(futureMonthlyExpense)} />
        </div>
        <p
          data-testid="ret-gap"
          className={`mt-5 rounded-lg border px-4 py-2.5 text-sm ${
            gap >= 0
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
              : "border-red-500/30 bg-red-500/10 text-red-600"
          }`}
        >
          {gap >= 0
            ? `On track — a projected surplus of ${formatINRCompact(gap)}.`
            : `Shortfall of ${formatINRCompact(Math.abs(gap))} — raise the monthly investment or start earlier.`}
        </p>
      </div>
    </div>
  );
}

const GOALS: Record<string, number> = {
  "Child's Education": 10,
  "House Purchase": 7,
  "Wedding": 8,
  "Vehicle": 6,
  "Retirement": 6,
  "Emergency Fund": 6,
};

export function GoalCalc() {
  const [goal, setGoal] = useState("Child's Education");
  const [target, setTarget] = useState(5000000);
  const [years, setYears] = useState(12);
  const [ret, setRet] = useState(12);
  const infl = GOALS[goal];
  const { futureCost, sipNeeded, lumpsumNeeded } = goalPlan(target, infl, years, ret);
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="grid content-start gap-7">
        <div className="grid gap-2">
          <label htmlFor="goal-type" className="text-sm text-muted-foreground">Financial Goal</label>
          <select id="goal-type" data-testid="goal-type" className="pf-select" value={goal} onChange={(e) => setGoal(e.target.value)}>
            {Object.keys(GOALS).map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground/70">Assumed inflation for this goal: {infl}% p.a.</p>
        </div>
        <SliderField testid="goal-target" label="Cost of Goal Today" value={target} min={500000} max={50000000} step={100000} onChange={setTarget} format={formatINR} />
        <SliderField testid="goal-years" label="Years to Goal" value={years} min={1} max={30} onChange={setYears} format={(v) => `${v} yrs`} />
        <SliderField testid="goal-return" label="Expected Return (% p.a.)" value={ret} min={6} max={15} step={0.5} onChange={setRet} format={(v) => `${v.toFixed(1)}%`} />
      </div>
      <div className="glass-card grid content-start rounded-2xl p-6">
        <p className="overline-tag">{goal}</p>
        <div className="mt-4">
          <ResultRow testid="goal-future" label="Future Cost of Goal" value={formatINRCompact(futureCost)} highlight />
          <ResultRow testid="goal-sip" label="Monthly SIP Needed" value={formatINR(sipNeeded)} />
          <ResultRow testid="goal-lumpsum" label="Or One-Time Investment" value={formatINR(lumpsumNeeded)} />
        </div>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Indicative only — actual requirements depend on real inflation, returns and taxation. We'll build a proper goal plan with you.
        </p>
      </div>
    </div>
  );
}
