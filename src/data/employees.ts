import { jobLevels, type JobLevel } from './jobLevels';

export type Gender = 'female' | 'male';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  departmentId: string;
  jobLevelId: string;
  baseSalary: number;
  variablePay: number;
  hireDate: string;
  performanceRating: 1 | 2 | 3 | 4 | 5;
  location: 'Helsinki' | 'Tampere' | 'Oulu' | 'Turku';
}

// Mulberry32 deterministic PRNG so reloads produce identical data.
function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const femaleNames = [
  'Anna', 'Maria', 'Helena', 'Aino', 'Sofia', 'Emma', 'Olivia', 'Iida',
  'Aada', 'Eevi', 'Saana', 'Pinja', 'Kaisa', 'Laura', 'Sanna', 'Tiina',
  'Heidi', 'Marja', 'Päivi', 'Riikka', 'Henna', 'Suvi', 'Mira', 'Nora',
  'Hanna', 'Leena', 'Mervi', 'Eveliina', 'Veera', 'Roosa', 'Linnea', 'Helmi',
];
const maleNames = [
  'Matti', 'Juha', 'Mikko', 'Antti', 'Jukka', 'Pekka', 'Kalle', 'Lauri',
  'Eero', 'Olli', 'Tuomas', 'Aleksi', 'Joonas', 'Niko', 'Sami', 'Jari',
  'Janne', 'Henri', 'Otto', 'Toni', 'Ville', 'Tero', 'Markku', 'Juuso',
  'Eetu', 'Joel', 'Aaro', 'Onni', 'Vesa', 'Leevi', 'Patrik', 'Jesse',
];
const lastNames = [
  'Virtanen', 'Korhonen', 'Mäkinen', 'Nieminen', 'Mäkelä', 'Hämäläinen', 'Laine',
  'Heikkinen', 'Koskinen', 'Järvinen', 'Lehtonen', 'Lehtinen', 'Saarinen',
  'Salminen', 'Heinonen', 'Niemi', 'Heikkilä', 'Kinnunen', 'Salonen', 'Turunen',
  'Salo', 'Laitinen', 'Tuominen', 'Rantanen', 'Karjalainen', 'Jokinen', 'Mattila',
  'Ahonen', 'Lahtinen', 'Ojala', 'Leppänen', 'Kallio', 'Lindberg', 'Aaltonen',
];
const cities: Employee['location'][] = ['Helsinki', 'Tampere', 'Oulu', 'Turku'];

type LevelMix = [number, number, number, number, number, number];

interface DeptPlan {
  id: string;
  males: number;
  females: number;
  // Gender-conditional level mixes — must sum to 1 each. The headline-gap is
  // driven primarily by men being concentrated at higher levels in tech-heavy
  // departments, with a small within-band penalty on top.
  maleLevelMix: LevelMix;
  femaleLevelMix: LevelMix;
  // Within-band salary penalty applied to women on top of the level effect.
  withinBandFemalePenalty: number;
}

// Hand-calibrated to land near these target gaps:
// Engineering ~11%, IT ~9%, Sales ~7%, Operations ~5%, Marketing ~4%,
// Customer Service ~3%, Finance ~2%, HR ~1.5%.
const departmentPlans: DeptPlan[] = [
  {
    id: 'eng',
    males: 50, females: 22,
    maleLevelMix:   [0.06, 0.16, 0.24, 0.30, 0.16, 0.08],
    femaleLevelMix: [0.10, 0.20, 0.28, 0.26, 0.12, 0.04],
    withinBandFemalePenalty: 0.05,
  },
  {
    id: 'it',
    males: 16, females: 8,
    maleLevelMix:   [0.07, 0.18, 0.27, 0.28, 0.13, 0.07],
    femaleLevelMix: [0.12, 0.22, 0.28, 0.24, 0.10, 0.04],
    withinBandFemalePenalty: 0.04,
  },
  {
    id: 'sales',
    males: 22, females: 16,
    maleLevelMix:   [0.08, 0.18, 0.28, 0.28, 0.13, 0.05],
    femaleLevelMix: [0.12, 0.22, 0.29, 0.23, 0.10, 0.04],
    withinBandFemalePenalty: 0.030,
  },
  {
    id: 'ops',
    males: 16, females: 14,
    maleLevelMix:   [0.10, 0.22, 0.28, 0.22, 0.12, 0.06],
    femaleLevelMix: [0.13, 0.24, 0.29, 0.20, 0.10, 0.04],
    withinBandFemalePenalty: 0.025,
  },
  {
    id: 'mkt',
    males: 12, females: 14,
    maleLevelMix:   [0.10, 0.22, 0.28, 0.23, 0.12, 0.05],
    femaleLevelMix: [0.12, 0.23, 0.28, 0.22, 0.11, 0.04],
    withinBandFemalePenalty: 0.030,
  },
  {
    id: 'cs',
    males: 12, females: 18,
    maleLevelMix:   [0.18, 0.30, 0.27, 0.15, 0.07, 0.03],
    femaleLevelMix: [0.20, 0.31, 0.26, 0.14, 0.06, 0.03],
    withinBandFemalePenalty: 0.020,
  },
  {
    id: 'fin',
    males: 12, females: 12,
    maleLevelMix:   [0.10, 0.22, 0.28, 0.22, 0.13, 0.05],
    femaleLevelMix: [0.12, 0.23, 0.28, 0.21, 0.12, 0.04],
    withinBandFemalePenalty: 0.018,
  },
  {
    id: 'hr',
    males: 8, females: 12,
    maleLevelMix:   [0.08, 0.25, 0.28, 0.22, 0.12, 0.05],
    femaleLevelMix: [0.10, 0.26, 0.27, 0.22, 0.11, 0.04],
    withinBandFemalePenalty: 0.012,
  },
];

// Deterministically distribute `count` people across the 6 levels using `mix`.
// Uses largest-remainder rounding so gender-mix doesn't drift due to small N.
function buildLevelRoster(count: number, mix: LevelMix): JobLevel[] {
  const exact = mix.map((p) => p * count);
  const floors = exact.map((x) => Math.floor(x));
  const used = floors.reduce((a, b) => a + b, 0);
  let remaining = count - used;
  const remainders = exact
    .map((x, i) => ({ i, frac: x - Math.floor(x) }))
    .sort((a, b) => b.frac - a.frac);
  const counts = [...floors];
  for (let k = 0; k < remainders.length && remaining > 0; k++) {
    counts[remainders[k].i]++;
    remaining--;
  }
  const roster: JobLevel[] = [];
  counts.forEach((n, i) => {
    for (let k = 0; k < n; k++) roster.push(jobLevels[i]);
  });
  return roster;
}

function generate(): Employee[] {
  const rng = makeRng(42);
  const out: Employee[] = [];
  let counter = 1000;

  for (const plan of departmentPlans) {
    const maleRoster = buildLevelRoster(plan.males, plan.maleLevelMix);
    const femaleRoster = buildLevelRoster(plan.females, plan.femaleLevelMix);
    const roster: Array<{ gender: Gender; level: JobLevel }> = [
      ...maleRoster.map((level) => ({ gender: 'male' as Gender, level })),
      ...femaleRoster.map((level) => ({ gender: 'female' as Gender, level })),
    ];

    for (const slot of roster) {
      const isFemale = slot.gender === 'female';
      const level = slot.level;

      // Gaussian-ish position within band centered on bandMid using two uniforms.
      const u = rng() + rng() - 1; // ~triangular [-1,1]
      const halfRange = (level.bandMax - level.bandMin) / 2;
      let salary = level.bandMid + u * halfRange * 0.75;

      if (isFemale) salary *= 1 - plan.withinBandFemalePenalty;

      // Tiny gender-neutral noise to break ties.
      salary *= 1 + (rng() - 0.5) * 0.012;

      // A small fraction become outliers to populate the bands "out of band" panel.
      const outlierRoll = rng();
      if (outlierRoll < 0.025) salary = level.bandMax * (1.04 + rng() * 0.04);
      else if (outlierRoll > 0.975) salary = level.bandMin * (0.93 - rng() * 0.04);

      const baseSalary = Math.round(salary / 100) * 100;
      const variablePay = Math.round((baseSalary * (0.05 + rng() * 0.12)) / 100) * 100;

      const firstName = (isFemale ? femaleNames : maleNames)[
        Math.floor(rng() * (isFemale ? femaleNames.length : maleNames.length))
      ];
      const lastName = lastNames[Math.floor(rng() * lastNames.length)];

      const yearsTenure = Math.floor(rng() * 12);
      const hireDate = new Date(
        2026 - yearsTenure,
        Math.floor(rng() * 12),
        1 + Math.floor(rng() * 27),
      )
        .toISOString()
        .slice(0, 10);

      const ratingDist = [0.05, 0.15, 0.45, 0.28, 0.07];
      const r = rng();
      let rating: 1 | 2 | 3 | 4 | 5 = 3;
      let acc = 0;
      for (let k = 0; k < 5; k++) {
        acc += ratingDist[k];
        if (r <= acc) {
          rating = (k + 1) as typeof rating;
          break;
        }
      }

      out.push({
        id: `E${counter++}`,
        firstName,
        lastName,
        gender: isFemale ? 'female' : 'male',
        departmentId: plan.id,
        jobLevelId: level.id,
        baseSalary,
        variablePay,
        hireDate,
        performanceRating: rating,
        location: cities[Math.floor(rng() * cities.length)],
      });
    }
  }

  return out;
}

export const employees: Employee[] = generate();

export const employeeById = Object.fromEntries(
  employees.map((e) => [e.id, e]),
) as Record<string, Employee>;

// Pin a known employee for the employee-portal demo (Sami Korhonen, L4 Engineering).
export const SELF_EMPLOYEE_ID = (() => {
  const candidate = employees.find(
    (e) => e.gender === 'male' && e.departmentId === 'eng' && e.jobLevelId === 'L4',
  );
  return candidate?.id ?? employees[0].id;
})();
