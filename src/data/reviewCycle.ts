import { employees, type Employee } from './employees';
import { jobLevelById } from './jobLevels';

export interface ReviewProposal {
  id: string;
  employeeId: string;
  currentSalary: number;
  proposedSalary: number;
  changePct: number;
  manager: string;
  rationale: { fi: string; en: string };
  // System-computed: would this proposal *widen* the within-band gender gap?
  biasFlag: boolean;
}

const managers = ['Mikko Heikkilä', 'Sari Salmela', 'Anna Virtanen', 'Petri Lehto', 'Hanna Mäkelä'];

function rationale(emp: Employee): { fi: string; en: string } {
  if (emp.performanceRating >= 4) {
    return {
      fi: `Korkea suoritusarvio (${emp.performanceRating}/5). Markkina-aineisto tukee korotusta.`,
      en: `High performance rating (${emp.performanceRating}/5). Market data supports the increase.`,
    };
  }
  return {
    fi: `Vakiintunut suoritus (${emp.performanceRating}/5) ja palvelusvuodet.`,
    en: `Steady performance (${emp.performanceRating}/5) and tenure.`,
  };
}

// Build ~30 proposals deterministically by walking employees and selecting a stride.
function build(): ReviewProposal[] {
  const out: ReviewProposal[] = [];
  const stride = Math.floor(employees.length / 32);
  let counter = 5001;
  for (let i = 0; i < employees.length && out.length < 32; i += stride || 1) {
    const emp = employees[i];
    const level = jobLevelById[emp.jobLevelId];
    const baseChange = 0.02 + (emp.performanceRating - 2) * 0.012;
    // For some male employees in tech we deliberately propose a higher bump
    // so the bias-risk indicator has something to flag.
    const biasBoost =
      emp.gender === 'male' && (emp.departmentId === 'eng' || emp.departmentId === 'sales')
        ? 0.025
        : 0;
    const change = Math.max(0.005, baseChange + biasBoost);
    const proposed = Math.round((emp.baseSalary * (1 + change)) / 100) * 100;
    const cappedProposed = Math.min(proposed, Math.round(level.bandMax * 1.05));
    const actualChange = (cappedProposed - emp.baseSalary) / emp.baseSalary;

    out.push({
      id: `R-${counter++}`,
      employeeId: emp.id,
      currentSalary: emp.baseSalary,
      proposedSalary: cappedProposed,
      changePct: actualChange,
      manager: managers[i % managers.length],
      rationale: rationale(emp),
      biasFlag: biasBoost > 0 && actualChange > 0.04,
    });
  }
  return out;
}

export const reviewProposals: ReviewProposal[] = build();

export const reviewCycle = {
  id: 'CYCLE-2026-Q1',
  label: { fi: 'Palkkakierros Q1 2026', en: 'Compensation review Q1 2026' },
  startDate: '2026-03-15',
  endDate: '2026-04-30',
};
