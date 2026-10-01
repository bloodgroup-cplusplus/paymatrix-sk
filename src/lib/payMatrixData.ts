export interface PayLevel {
  level: number;
  label: string;
  gradePay: number;
  payBand: string;
  startIndex: number;
  // progression cells (each cell is a 3% increment rounded to nearest 100)
  cells: number[];
}

// Generate pay matrix cells: each cell increases by ~3% rounded to nearest 100
function generateCells(start: number, count: number): number[] {
  const cells: number[] = [start];
  for (let i = 1; i < count; i++) {
    const next = Math.round((cells[i - 1] * 1.03) / 100) * 100;
    cells.push(next);
  }
  return cells;
}

export const PAY_LEVELS: PayLevel[] = [
  { level: 1, label: 'Level 1', gradePay: 1300, payBand: '4440-7440', startIndex: 14800, cells: generateCells(14800, 40) },
  { level: 2, label: 'Level 2', gradePay: 1400, payBand: '5200-20200', startIndex: 16900, cells: generateCells(16900, 40) },
  { level: 3, label: 'Level 3', gradePay: 1650, payBand: '5200-20200', startIndex: 18000, cells: generateCells(18000, 40) },
  { level: 4, label: 'Level 4', gradePay: 1800, payBand: '5200-20200', startIndex: 19900, cells: generateCells(19900, 40) },
  { level: 5, label: 'Level 5', gradePay: 1900, payBand: '5200-20200', startIndex: 21700, cells: generateCells(21700, 40) },
  { level: 6, label: 'Level 6', gradePay: 2100, payBand: '5200-20200', startIndex: 25300, cells: generateCells(25300, 40) },
  { level: 7, label: 'Level 7', gradePay: 2300, payBand: '5200-20200', startIndex: 27800, cells: generateCells(27800, 40) },
  { level: 8, label: 'Level 8', gradePay: 2400, payBand: '9300-34800', startIndex: 29200, cells: generateCells(29200, 40) },
  { level: 9, label: 'Level 9', gradePay: 2800, payBand: '9300-34800', startIndex: 35400, cells: generateCells(35400, 40) },
  { level: 10, label: 'Level 10', gradePay: 4200, payBand: '9300-34800', startIndex: 40800, cells: generateCells(40800, 40) },
  { level: 11, label: 'Level 11', gradePay: 4600, payBand: '9300-34800', startIndex: 44900, cells: generateCells(44900, 40) },
  { level: 12, label: 'Level 12', gradePay: 4800, payBand: '9300-34800', startIndex: 50700, cells: generateCells(50700, 40) },
  { level: 13, label: 'Level 13', gradePay: 5200, payBand: '15600-39100', startIndex: 56600, cells: generateCells(56600, 40) },
  { level: 14, label: 'Level 14', gradePay: 5400, payBand: '15600-39100', startIndex: 67700, cells: generateCells(67700, 40) },
  { level: 15, label: 'Level 15', gradePay: 6600, payBand: '15600-39100', startIndex: 78800, cells: generateCells(78800, 40) },
  { level: 16, label: 'Level 16', gradePay: 7600, payBand: '37400-67000', startIndex: 105600, cells: generateCells(105600, 40) },
  { level: 17, label: 'Level 17', gradePay: 8700, payBand: '37400-67000', startIndex: 122900, cells: generateCells(122900, 40) },
  { level: 18, label: 'Level 18', gradePay: 10000, payBand: '67000-79000', startIndex: 186200, cells: generateCells(186200, 40) },
];

// HRA rates based on city classification (Sikkim uses X/Y/Z categories)
export const HRA_RATES = {
  X: 24, // Class X cities (higher HRA)
  Y: 16, // Class Y cities
  Z: 8,  // Class Z cities / rural
};

// Sikkim Border Compensatory Allowance rates
export const SBCA_RATES = {
  regular: 8,    // 8% of basic pay for regular areas
  high_altitude: 12, // 12% for high altitude areas
};

// Transport Allowance rates
export const TA_RATES = {
  highCities: { level9AndAbove: 7200, level3To8: 3600, level1And2: 1350 },
  otherPlaces: { level9AndAbove: 3600, level3To8: 1800, level1And2: 900 },
};

// DA current rate (as of 2026)
export const DEFAULT_DA_RATE = 53;

// NPS employee contribution rate
export const NPS_EMPLOYEE_RATE = 10;

// NPS employer contribution rate
export const NPS_EMPLOYER_RATE = 14;

// Professional Tax (monthly, Sikkim)
export const PROFESSIONAL_TAX = 200;

// Group Insurance Scheme (GIS)
export const GIS_RATES: Record<string, number> = {
  '1': 30,
  '2': 30,
  '3': 30,
  '4': 45,
  '5': 45,
  '6': 60,
  '7': 60,
  '8': 90,
  '9': 120,
  '10': 120,
  '11': 180,
  '12': 180,
  '13': 240,
  '14': 240,
  '15': 300,
  '16': 300,
  '17': 300,
  '18': 300,
};

// GP Fund contribution rate (Sikkim specific)
export const GP_FUND_RATE = 6;

export interface SalaryComponent {
  name: string;
  amount: number;
  description?: string;
}

export interface SalaryResult {
  basicPay: number;
  da: number;
  hra: number;
  sbca: number;
  ta: number;
  taDa: number;
  grossSalary: number;
  nps: number;
  gpFund: number;
  professionalTax: number;
  gis: number;
  totalDeductions: number;
  netSalary: number;
  employerNps: number;
  totalCostToGovt: number;
}

export function getTARate(level: number, isHighCity: boolean): number {
  const rates = isHighCity ? TA_RATES.highCities : TA_RATES.otherPlaces;
  if (level >= 9) return rates.level9AndAbove;
  if (level >= 3) return rates.level3To8;
  return rates.level1And2;
}

export function getGISRate(level: number): number {
  return GIS_RATES[String(level)] ?? 30;
}

