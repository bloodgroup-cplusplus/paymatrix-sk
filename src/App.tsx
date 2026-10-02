
import { useState, useMemo, useEffect } from 'react';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Wallet,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  ArrowDownRight,
  Receipt,
  PiggyBank,
  Building2,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  PAY_LEVELS,
  DEFAULT_DA_RATE,
  type PayLevel,
} from '@/lib/payMatrixData';
import {
  calculateSalary,
  formatINR,
  type SalaryInput,
} from '@/lib/salaryCalculator';
import { cn } from '@/lib/utils';

interface EarningItem {
  label: string;
  amount: number;
  icon: React.ReactNode;
  formula: string;
}

interface DeductionItem {
  label: string;
  amount: number;
  icon: React.ReactNode;
  formula: string;
}

function App() {
  const [selectedLevel, setSelectedLevel] = useState<number>(6);
  const [basicPay, setBasicPay] = useState<number>(25300);
  const [daRate, setDaRate] = useState<number>(DEFAULT_DA_RATE);
  const [hraClass, setHraClass] = useState<'X' | 'Y' | 'Z'>('Y');
  const [isHighAltitude, setIsHighAltitude] = useState(false);
  const [isHighCity, setIsHighCity] = useState(false);
  const [includeGPFund, setIncludeGPFund] = useState(true);
  const [includeNPS, setIncludeNPS] = useState(true);
  const [includePT, setIncludePT] = useState(true);
  const [includeGIS, setIncludeGIS] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(true);

  const payLevel: PayLevel = useMemo(
    () => PAY_LEVELS.find((l) => l.level === selectedLevel) ?? PAY_LEVELS[5],
    [selectedLevel]
  );

  // When level changes, set basic pay to the first cell of that level
  useEffect(() => {
    setBasicPay(payLevel.cells[0]);
  }, [payLevel]);

  const input: SalaryInput = {
    basicPay,
    level: selectedLevel,
    daRate,
    hraClass,
    isHighAltitude,
    isHighCity,
    includeGPFund,
    includeNPS,
    includePT,
    includeGIS,
  };

  const result = useMemo(() => calculateSalary(input), [input]);

  const earnings: EarningItem[] = [
    { label: 'Basic Pay', amount: result.basicPay, icon: <Wallet className="h-4 w-4" />, formula: 'Fixed as per Pay Matrix' },
    { label: 'Dearness Allowance', amount: result.da, icon: <TrendingUp className="h-4 w-4" />, formula: `${daRate}% × Basic Pay` },
    { label: 'House Rent Allowance', amount: result.hra, icon: <Building2 className="h-4 w-4" />, formula: `${hraClass === 'X' ? 24 : hraClass === 'Y' ? 16 : 8}% × Basic Pay` },
    { label: 'SBCA', amount: result.sbca, icon: <Info className="h-4 w-4" />, formula: `${isHighAltitude ? 12 : 8}% × Basic Pay` },
    { label: 'Transport Allowance', amount: result.ta, icon: <Receipt className="h-4 w-4" />, formula: `TA Base + DA on TA` },
  ];

  const deductions: DeductionItem[] = [
    ...(includeNPS ? [{ label: 'NPS (Employee)', amount: result.nps, icon: <PiggyBank className="h-4 w-4" />, formula: '10% × (Basic + DA)' }] : []),
    ...(includeGPFund ? [{ label: 'GP Fund', amount: result.gpFund, icon: <PiggyBank className="h-4 w-4" />, formula: '6% × Basic Pay' }] : []),
    ...(includePT ? [{ label: 'Professional Tax', amount: result.professionalTax, icon: <Receipt className="h-4 w-4" />, formula: 'Fixed monthly' }] : []),
    ...(includeGIS ? [{ label: 'GIS', amount: result.gis, icon: <Info className="h-4 w-4" />, formula: 'Level-based rate' }] : []),
  ];

  const handleReset = () => {
    setSelectedLevel(6);
    setDaRate(DEFAULT_DA_RATE);
    setHraClass('Y');
    setIsHighAltitude(false);
    setIsHighCity(false);
    setIncludeGPFund(true);
    setIncludeNPS(true);
    setIncludePT(true);
    setIncludeGIS(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Calculator className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">PayMatrix Sikkim</h1>
              <p className="text-xs text-muted-foreground">Salary Calculator for Sikkim Govt Employees</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Hero summary */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-border bg-primary text-primary-foreground">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                  Net Salary
                </span>
                <Wallet className="h-4 w-4 text-primary-foreground/70" />
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight">
                {formatINR(result.netSalary)}
              </p>
              <p className="mt-1 text-xs text-primary-foreground/60">per month (in-hand)</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Gross Salary
                </span>
                <ArrowUpRight className="h-4 w-4 text-success" />
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-success">
                {formatINR(result.grossSalary)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">total earnings before deductions</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Deductions
                </span>
                <ArrowDownRight className="h-4 w-4 text-danger" />
              </div>
              <p className="mt-3 text-3xl font-bold tracking-tight text-danger">
                {formatINR(result.totalDeductions)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">NPS, GP Fund, PT, GIS</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Input Panel */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-semibold">Salary Inputs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Pay Level */}
                <div className="space-y-2">
                  <Label>Pay Level</Label>
                  <Select
                    value={String(selectedLevel)}
                    onValueChange={(v) => setSelectedLevel(Number(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAY_LEVELS.map((l) => (
                        <SelectItem key={l.level} value={String(l.level)}>
                          {l.label} (GP {l.gradePay})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Pay Band: {payLevel.payBand} | Grade Pay: {payLevel.gradePay}
                  </p>
                </div>

                {/* Basic Pay */}
                <div className="space-y-2">
                  <Label>Basic Pay</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ₹
                    </span>
                    <Input
                      type="number"
                      value={basicPay}
                      onChange={(e) => setBasicPay(Number(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {payLevel.cells.slice(0, 8).map((cell, i) => (
                      <button
                        key={i}
                        onClick={() => setBasicPay(cell)}
                        className={cn(
                          'rounded-md border px-2 py-1 text-xs transition-colors',
                          basicPay === cell
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-background hover:bg-accent'
                        )}
                      >
                        {cell.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DA Rate */}
                <div className="space-y-2">
                  <Label>Dearness Allowance (%)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      value={daRate}
                      onChange={(e) => setDaRate(Number(e.target.value) || 0)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      %
                    </span>
                  </div>
                </div>

                {/* HRA City Class */}
                <div className="space-y-2">
                  <Label>HRA City Classification</Label>
                  <Select
                    value={hraClass}
                    onValueChange={(v) => setHraClass(v as 'X' | 'Y' | 'Z')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="X">Class X — 24% (Metro)</SelectItem>
                      <SelectItem value="Y">Class Y — 16% (Non-Metro)</SelectItem>
                      <SelectItem value="Z">Class Z — 8% (Rural)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Toggle Options */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Allowances & Conditions</Label>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">High Altitude (SBCA 12%)</span>
                    <Switch checked={isHighAltitude} onCheckedChange={setIsHighAltitude} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">High TPTA City</span>
                    <Switch checked={isHighCity} onCheckedChange={setIsHighCity} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Deductions</Label>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">NPS (10%)</span>
                    <Switch checked={includeNPS} onCheckedChange={setIncludeNPS} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GP Fund (6%)</span>
                    <Switch checked={includeGPFund} onCheckedChange={setIncludeGPFund} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Professional Tax</span>
                    <Switch checked={includePT} onCheckedChange={setIncludePT} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">GIS</span>
                    <Switch checked={includeGIS} onCheckedChange={setIncludeGIS} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
              </TabsList>

              {/* Summary Tab */}
              <TabsContent value="summary" className="space-y-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Earnings</CardTitle>
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        +{formatINR(result.grossSalary)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {earnings.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                            <span className="text-success">{item.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.formula}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-success">
                          +{formatINR(item.amount)}
                        </p>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-bold">Gross Salary</span>
                      <span className="text-lg font-bold text-success">
                        {formatINR(result.grossSalary)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Deductions</CardTitle>
                      <Badge variant="secondary" className="bg-danger/10 text-danger">
                        -{formatINR(result.totalDeductions)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {deductions.length === 0 && (
                      <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                        No deductions selected
                      </p>
                    )}
                    {deductions.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/10">
                            <span className="text-danger">{item.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.formula}</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-danger">
                          -{formatINR(item.amount)}
                        </p>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-bold">Total Deductions</span>
                      <span className="text-lg font-bold text-danger">
                        -{formatINR(result.totalDeductions)}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Net Result */}
                <Card className="border-2 border-primary bg-primary text-primary-foreground">
                  <CardContent className="flex items-center justify-between p-6">
                    <div>
                      <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/70">
                        Net In-Hand Salary
                      </p>
                      <p className="mt-1 text-4xl font-bold tracking-tight">
                        {formatINR(result.netSalary)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className="bg-primary-foreground/20 text-primary-foreground border-transparent">
                        Monthly
                      </Badge>
                      <p className="text-xs text-primary-foreground/60">
                        Gross − Deductions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Breakdown Tab */}
              <TabsContent value="breakdown" className="space-y-4">
                <Card className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Salary Breakdown</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBreakdown(!showBreakdown)}
                      >
                        {showBreakdown ? (
                          <><ChevronUp className="mr-1 h-4 w-4" />Collapse</>
                        ) : (
                          <><ChevronDown className="mr-1 h-4 w-4" />Expand</>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  {showBreakdown && (
                    <CardContent className="space-y-4">
                      {/* Earnings detail */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <TrendingUp className="h-4 w-4 text-success" />
                          Earnings (Additions)
                        </h4>
                        <div className="space-y-2">
                          <BreakdownRow label="Basic Pay" formula="Pay Matrix value" value={result.basicPay} positive />
                          <BreakdownRow label={`Dearness Allowance (${daRate}%)`} formula={`${daRate}% × ${formatINR(result.basicPay)}`} value={result.da} positive />
                          <BreakdownRow
                            label={`HRA (Class ${hraClass})`}
                            formula={`${hraClass === 'X' ? 24 : hraClass === 'Y' ? 16 : 8}% × ${formatINR(result.basicPay)}`}
                            value={result.hra}
                            positive
                          />
                          <BreakdownRow
                            label={`SBCA (${isHighAltitude ? '12%' : '8%'})`}
                            formula={`${isHighAltitude ? '12' : '8'}% × ${formatINR(result.basicPay)}`}
                            value={result.sbca}
                            positive
                          />
                          <BreakdownRow
                            label="Transport Allowance"
                            formula={`Base ${formatINR(result.ta - result.taDa)} + DA ${formatINR(result.taDa)}`}
                            value={result.ta}
                            positive
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-success/5 px-4 py-3">
                          <span className="text-sm font-bold text-success">Gross Salary</span>
                          <span className="text-lg font-bold text-success">{formatINR(result.grossSalary)}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Deductions detail */}
                      <div>
                        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                          <TrendingDown className="h-4 w-4 text-danger" />
                          Deductions (Subtractions)
                        </h4>
                        <div className="space-y-2">
                          {includeNPS && (
                            <BreakdownRow
                              label="NPS (Employee 10%)"
                              formula={`10% × (${formatINR(result.basicPay)} + ${formatINR(result.da)})`}
                              value={result.nps}
                            />
                          )}
                          {includeGPFund && (
                            <BreakdownRow
                              label="GP Fund (6%)"
                              formula={`6% × ${formatINR(result.basicPay)}`}
                              value={result.gpFund}
                            />
                          )}
                          {includePT && (
                            <BreakdownRow
                              label="Professional Tax"
                              formula="Fixed monthly"
                              value={result.professionalTax}
                            />
                          )}
                          {includeGIS && (
                            <BreakdownRow
                              label="Group Insurance Scheme"
                              formula={`Level ${selectedLevel} rate`}
                              value={result.gis}
                            />
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between rounded-lg bg-danger/5 px-4 py-3">
                          <span className="text-sm font-bold text-danger">Total Deductions</span>
                          <span className="text-lg font-bold text-danger">-{formatINR(result.totalDeductions)}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Final */}
                      <div className="flex items-center justify-between rounded-lg border-2 border-primary bg-primary px-6 py-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/70">
                            Net Salary
                          </p>
                          <p className="mt-0.5 text-xs text-primary-foreground/60">
                            {formatINR(result.grossSalary)} − {formatINR(result.totalDeductions)}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-primary-foreground">
                          {formatINR(result.netSalary)}
                        </p>
                      </div>

                      {/* Additional info */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="rounded-lg border border-border p-4">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Employer NPS (14%)
                          </p>
                          <p className="mt-1 text-xl font-bold">
                            {formatINR(result.employerNps)}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            14% × (Basic + DA)
                          </p>
                        </div>
                        <div className="rounded-lg border border-border p-4">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Cost to Government
                          </p>
                          <p className="mt-1 text-xl font-bold">
                            {formatINR(result.totalCostToGovt)}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Gross + Employer NPS
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Pay Matrix Table */}
                <PayMatrixTable level={payLevel} selectedPay={basicPay} onSelect={setBasicPay} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            PayMatrix Sikkim — Based on Sikkim Government Services (Revised Pay) Rules, 2018.
            This tool is for informational purposes only.
          </p>
        </footer>
      </main>
    </div>
  );
}

function BreakdownRow({
  label,
  formula,
  value,
  positive = false,
}: {
  label: string;
  formula: string;
  value: number;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3 transition-colors hover:bg-accent/30">
      <div className="flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{formula}</p>
      </div>
      <p
        className={cn(
          'text-sm font-semibold tabular-nums',
          positive ? 'text-success' : 'text-danger'
        )}
      >
        {positive ? '+' : '-'}{formatINR(value)}
      </p>
    </div>
  );
}

function PayMatrixTable({
  level,
  selectedPay,
  onSelect,
}: {
  level: PayLevel;
  selectedPay: number;
  onSelect: (value: number) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayCells = showAll ? level.cells : level.cells.slice(0, 15);

  return (
    <Card className="border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {level.label} — Pay Matrix Table
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            Grade Pay {level.gradePay}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {displayCells.map((cell, i) => (
            <button
              key={i}
              onClick={() => onSelect(cell)}
              className={cn(
                'rounded-lg border px-2 py-2.5 text-center text-sm transition-all',
                selectedPay === cell
                  ? 'border-primary bg-primary text-primary-foreground shadow-md'
                  : 'border-border bg-background hover:border-foreground/30 hover:bg-accent'
              )}
            >
              <span className="block text-xs text-muted-foreground">Cell {i + 1}</span>
              <span className="font-semibold tabular-nums">
                {cell.toLocaleString('en-IN')}
              </span>
            </button>
          ))}
        </div>
        {level.cells.length > 15 && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All ${level.cells.length} Cells`}
            {showAll ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default App;

