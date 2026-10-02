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
