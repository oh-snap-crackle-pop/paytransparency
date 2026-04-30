import { employees, type Employee } from '@/data/employees';
import { departments } from '@/data/departments';
import { jobLevels, jobLevelById, type JobLevel } from '@/data/jobLevels';

function mean(xs: number[]) {
  if (xs.length === 0) return 0;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function median(xs: number[]) {
  if (xs.length === 0) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

export function meanGap(group: Employee[]): number {
  const m = group.filter((e) => e.gender === 'male').map((e) => e.baseSalary);
  const f = group.filter((e) => e.gender === 'female').map((e) => e.baseSalary);
  if (m.length === 0 || f.length === 0) return 0;
  const mm = mean(m);
  const fm = mean(f);
  return (mm - fm) / mm;
}

export function medianGap(group: Employee[]): number {
  const m = group.filter((e) => e.gender === 'male').map((e) => e.baseSalary);
  const f = group.filter((e) => e.gender === 'female').map((e) => e.baseSalary);
  if (m.length === 0 || f.length === 0) return 0;
  const mm = median(m);
  const fm = median(f);
  return (mm - fm) / mm;
}

export interface DepartmentGap {
  departmentId: string;
  meanGap: number;
  medianGap: number;
  headcount: number;
  flagged: boolean;
}

export function gapByDepartment(): DepartmentGap[] {
  return departments.map((d) => {
    const group = employees.filter((e) => e.departmentId === d.id);
    const mg = meanGap(group);
    return {
      departmentId: d.id,
      meanGap: mg,
      medianGap: medianGap(group),
      headcount: group.length,
      flagged: mg >= 0.05,
    };
  });
}

export interface QuartileBucket {
  quartile: 1 | 2 | 3 | 4;
  female: number;
  male: number;
}

export function quartileDistribution(): QuartileBucket[] {
  const sorted = [...employees].sort((a, b) => a.baseSalary - b.baseSalary);
  const n = sorted.length;
  const buckets: QuartileBucket[] = [
    { quartile: 1, female: 0, male: 0 },
    { quartile: 2, female: 0, male: 0 },
    { quartile: 3, female: 0, male: 0 },
    { quartile: 4, female: 0, male: 0 },
  ];
  sorted.forEach((emp, i) => {
    const q = Math.min(3, Math.floor((i / n) * 4));
    if (emp.gender === 'female') buckets[q].female++;
    else buckets[q].male++;
  });
  return buckets;
}

// Mocked historical trend (the demo shows the gap closing over time).
export interface TrendPoint {
  quarter: string;
  gap: number;
}
export function gapTrend(): TrendPoint[] {
  return [
    { quarter: '2024 Q2', gap: 0.094 },
    { quarter: '2024 Q3', gap: 0.091 },
    { quarter: '2024 Q4', gap: 0.087 },
    { quarter: '2025 Q1', gap: 0.085 },
    { quarter: '2025 Q2', gap: 0.082 },
    { quarter: '2025 Q3', gap: 0.078 },
    { quarter: '2025 Q4', gap: 0.075 },
    { quarter: '2026 Q1', gap: meanGap(employees) },
  ];
}

export type BandStatus = 'aboveBand' | 'inBand' | 'belowBand';

export interface BandPosition {
  status: BandStatus;
  // Percentile within band: 0 = bandMin, 1 = bandMax. Clamped to [-0.2, 1.2] for display.
  pct: number;
}

export function bandPosition(emp: Employee, level?: JobLevel): BandPosition {
  const lvl = level ?? jobLevelById[emp.jobLevelId];
  const pct = (emp.baseSalary - lvl.bandMin) / (lvl.bandMax - lvl.bandMin);
  let status: BandStatus = 'inBand';
  if (emp.baseSalary > lvl.bandMax) status = 'aboveBand';
  else if (emp.baseSalary < lvl.bandMin) status = 'belowBand';
  return { status, pct: Math.max(-0.2, Math.min(1.2, pct)) };
}

export interface LevelDistribution {
  level: JobLevel;
  members: Array<{ employee: Employee; position: BandPosition }>;
  count: number;
}

export function distributionByLevel(filterDept?: string): LevelDistribution[] {
  return jobLevels.map((level) => {
    const members = employees
      .filter((e) => e.jobLevelId === level.id && (!filterDept || e.departmentId === filterDept))
      .map((e) => ({ employee: e, position: bandPosition(e, level) }));
    return { level, members, count: members.length };
  });
}

export interface Outlier {
  employee: Employee;
  level: JobLevel;
  position: BandPosition;
}

export function outliers(filterDept?: string): Outlier[] {
  const out: Outlier[] = [];
  for (const e of employees) {
    if (filterDept && e.departmentId !== filterDept) continue;
    const lvl = jobLevelById[e.jobLevelId];
    const pos = bandPosition(e, lvl);
    if (pos.status !== 'inBand') out.push({ employee: e, level: lvl, position: pos });
  }
  return out.sort((a, b) => Math.abs(b.position.pct - 0.5) - Math.abs(a.position.pct - 0.5));
}

export interface Headline {
  meanGap: number;
  medianGap: number;
  headcount: number;
  flaggedDepartments: number;
  trend: TrendPoint[];
}

export function headline(): Headline {
  const depts = gapByDepartment();
  return {
    meanGap: meanGap(employees),
    medianGap: medianGap(employees),
    headcount: employees.length,
    flaggedDepartments: depts.filter((d) => d.flagged).length,
    trend: gapTrend(),
  };
}

// Summary used by the employee portal: percentile within band given the role.
export function selfPositionPercentile(empId: string): number {
  const me = employees.find((e) => e.id === empId);
  if (!me) return 0;
  const peers = employees.filter(
    (e) => e.jobLevelId === me.jobLevelId && e.departmentId === me.departmentId,
  );
  const lower = peers.filter((p) => p.baseSalary < me.baseSalary).length;
  return peers.length <= 1 ? 0.5 : lower / (peers.length - 1);
}

export function bandMedianForLevel(jobLevelId: string, departmentId: string): number {
  const peers = employees.filter(
    (e) => e.jobLevelId === jobLevelId && e.departmentId === departmentId,
  );
  if (peers.length === 0) return jobLevelById[jobLevelId].bandMid;
  return median(peers.map((p) => p.baseSalary));
}
