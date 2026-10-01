import {
  HRA_RATES,
  SBCA_RATES,
  DEFAULT_DA_RATE,
  NPS_EMPLOYEE_RATE,
  NPS_EMPLOYER_RATE,
  PROFESSIONAL_TAX,
  GP_FUND_RATE,
  getTARate,
  getGISRate,
  type SalaryResult,
} from './payMatrixData';

export interface SalaryInput {
  basicPay: number;
  level: number;
  daRate: number;
  hraClass: 'X' | 'Y' | 'Z';
  isHighAltitude: boolean;
  isHighCity: boolean;
  includeGPFund: boolean;
  includeNPS: boolean;
  includePT: boolean;
  includeGIS: boolean;
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const basicPay = input.basicPay;
  const daRate = input.daRate || DEFAULT_DA_RATE;

  // Dearness Allowance = DA% × Basic Pay
  const da = Math.round((basicPay * daRate) / 100);

  // House Rent Allowance = HRA% × Basic Pay
  const hraPct = HRA_RATES[input.hraClass];
  const hra = Math.round((basicPay * hraPct) / 100);

  // Sikkim Border Compensatory Allowance
  const sbcaPct = input.isHighAltitude ? SBCA_RATES.high_altitude : SBCA_RATES.regular;
  const sbca = Math.round((basicPay * sbcaPct) / 100);

  // Transport Allowance = TA base + DA on TA
  const taBase = getTARate(input.level, input.isHighCity);
  const taDa = Math.round((taBase * daRate) / 100);
  const ta = taBase + taDa;

  // Gross Salary
  const grossSalary = basicPay + da + hra + sbca + ta;

  // Deductions
  // NPS = 10% × (Basic + DA)
  const nps = input.includeNPS ? Math.round(((basicPay + da) * NPS_EMPLOYEE_RATE) / 100) : 0;

  // GP Fund = 6% × Basic Pay
  const gpFund = input.includeGPFund ? Math.round((basicPay * GP_FUND_RATE) / 100) : 0;

  // Professional Tax (flat monthly)
  const professionalTax = input.includePT ? PROFESSIONAL_TAX : 0;

  // Group Insurance Scheme
  const gis = input.includeGIS ? getGISRate(input.level) : 0;

  const totalDeductions = nps + gpFund + professionalTax + gis;
  const netSalary = grossSalary - totalDeductions;

  // Employer NPS contribution = 14% × (Basic + DA)
  const employerNps = Math.round(((basicPay + da) * NPS_EMPLOYER_RATE) / 100);
  const totalCostToGovt = grossSalary + employerNps;

  return {
    basicPay,
    da,
    hra,
    sbca,
    ta,
    taDa,
    grossSalary,
    nps,
    gpFund,
    professionalTax,
    gis,
    totalDeductions,
    netSalary,
    employerNps,
    totalCostToGovt,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}

