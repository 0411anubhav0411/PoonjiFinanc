export function emi(principal: number, annualRate: number, years: number): number {
  const r = annualRate / 1200;
  const n = Math.round(years * 12);
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function emiBreakdown(principal: number, annualRate: number, years: number) {
  const monthly = emi(principal, annualRate, years);
  const total = monthly * Math.round(years * 12);
  return { monthly, total, interest: total - principal };
}

export function sipFutureValue(monthly: number, annualReturn: number, years: number) {
  const r = annualReturn / 1200;
  const n = Math.round(years * 12);
  const invested = monthly * n;
  const fv = r === 0 ? invested : monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return { invested, maturity: fv, gains: fv - invested };
}

export function lumpsumFutureValue(amount: number, annualReturn: number, years: number) {
  const fv = amount * Math.pow(1 + annualReturn / 100, years);
  return { invested: amount, maturity: fv, gains: fv - amount };
}

export function fdMaturity(principal: number, annualRate: number, years: number, freqPerYear: number) {
  const maturity = principal * Math.pow(1 + annualRate / (100 * freqPerYear), freqPerYear * years);
  return { maturity, interest: maturity - principal };
}

export function rdMaturity(monthly: number, annualRate: number, months: number) {
  const r = annualRate / 100;
  const quarters = months / 3;
  let maturity = 0;
  for (let i = 1; i <= quarters; i++) {
    maturity += monthly * 3 * Math.pow(1 + r / 4, quarters - i + 1);
  }
  const invested = monthly * months;
  return { invested, maturity, interest: maturity - invested };
}

export function loanEligibility(monthlyIncome: number, existingEmis: number, annualRate: number, years: number) {
  const maxEmi = Math.max(0, (monthlyIncome - existingEmis) * 0.5);
  const r = annualRate / 1200;
  const n = Math.round(years * 12);
  const eligible = r === 0 ? maxEmi * n : maxEmi * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
  return { maxEmi, eligible };
}

export function stepUpSip(monthly: number, stepUpPct: number, annualReturn: number, years: number) {
  const r = annualReturn / 1200;
  let invested = 0;
  let value = 0;
  let m = monthly;
  for (let month = 1; month <= Math.round(years * 12); month++) {
    if (month > 1 && (month - 1) % 12 === 0) m *= 1 + stepUpPct / 100;
    invested += m;
    value = (value + m) * (1 + r);
  }
  return { invested, maturity: value, gains: value - invested };
}

export function swp(initial: number, monthlyWithdrawal: number, annualReturn: number, years: number) {
  const r = annualReturn / 1200;
  let value = initial;
  let withdrawn = 0;
  for (let i = 0; i < Math.round(years * 12) && value > 0; i++) {
    value = value * (1 + r);
    const w = Math.min(monthlyWithdrawal, value);
    value -= w;
    withdrawn += w;
  }
  return { withdrawn, remaining: Math.max(0, value) };
}

export function cagr(beginValue: number, endValue: number, years: number) {
  if (beginValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / beginValue, 1 / years) - 1) * 100;
}

export function simpleInterest(principal: number, annualRate: number, years: number) {
  const interest = (principal * annualRate * years) / 100;
  return { interest, total: principal + interest };
}

export function inflationCost(todayCost: number, inflationRate: number, years: number) {
  const future = todayCost * Math.pow(1 + inflationRate / 100, years);
  return { future, increase: future - todayCost };
}

export function retirementPlan(
  currentAge: number,
  retireAge: number,
  currentSavings: number,
  monthlyInvestment: number,
  annualReturn: number,
  inflationPct: number,
  monthlyExpenseToday: number
) {
  const years = Math.max(1, retireAge - currentAge);
  const fvSavings = currentSavings * Math.pow(1 + annualReturn / 100, years);
  const sipFv = sipFutureValue(monthlyInvestment, annualReturn, years).maturity;
  const corpus = fvSavings + sipFv;
  const futureMonthlyExpense = monthlyExpenseToday * Math.pow(1 + inflationPct / 100, years);
  const required = futureMonthlyExpense * 12 * 25;
  return { years, corpus, required, gap: corpus - required, futureMonthlyExpense };
}

export function goalPlan(targetToday: number, inflationPct: number, years: number, annualReturn: number) {
  const futureCost = targetToday * Math.pow(1 + inflationPct / 100, years);
  const r = annualReturn / 1200;
  const n = Math.round(years * 12);
  const sipNeeded = r === 0 ? futureCost / n : (futureCost * r) / ((Math.pow(1 + r, n) - 1) * (1 + r));
  const lumpsumNeeded = futureCost / Math.pow(1 + annualReturn / 100, years);
  return { futureCost, sipNeeded, lumpsumNeeded };
}
