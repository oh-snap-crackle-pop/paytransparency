import { employees } from './employees';

export type JustificationCategory =
  | 'seniority'
  | 'market'
  | 'performance'
  | 'scarce'
  | 'promotion'
  | 'correction';

export interface Justification {
  id: string;
  employeeId: string;
  decidedBy: string;
  decidedAt: string;
  category: JustificationCategory;
  changePct: number;
  fromSalary: number;
  toSalary: number;
  status: 'approved' | 'pending';
  rationale: { fi: string; en: string };
  attachments: string[];
}

// Pick stable employees by id index to keep these realistic across reloads.
function pick(i: number) {
  return employees[i % employees.length];
}

const now = new Date('2026-04-15');
function daysAgo(n: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

export const justifications: Justification[] = [
  {
    id: 'J-2031',
    employeeId: pick(7).id,
    decidedBy: 'Anna Virtanen',
    decidedAt: daysAgo(4),
    category: 'market',
    changePct: 0.062,
    fromSalary: pick(7).baseSalary,
    toSalary: Math.round(pick(7).baseSalary * 1.062 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Mercer 2026 Q1 -markkinatutkimus osoittaa, että L3-tason senior-kehittäjien mediaani Helsingissä on noussut 6,2 %. Kohdistetaan korjaus kaikille saman kohortin työntekijöille.',
      en: 'Mercer Q1 2026 benchmark shows L3 senior developer median in Helsinki up 6.2 %. Adjustment applied uniformly to the cohort.',
    },
    attachments: ['mercer-q1-2026.pdf'],
  },
  {
    id: 'J-2032',
    employeeId: pick(15).id,
    decidedBy: 'Anna Virtanen',
    decidedAt: daysAgo(11),
    category: 'correction',
    changePct: 0.084,
    fromSalary: pick(15).baseSalary,
    toSalary: Math.round(pick(15).baseSalary * 1.084 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Yhteisen palkkakartoituksen havainto: työntekijä alle haarukan vastaavaan rooliin ja kokemukseen verrattuna. Korjaus haarukan mediaaniin.',
      en: 'Joint pay assessment finding: below band relative to comparable role and tenure. Correction to band median.',
    },
    attachments: ['jpa-2026-q1.pdf'],
  },
  {
    id: 'J-2033',
    employeeId: pick(22).id,
    decidedBy: 'Mikko Heikkilä',
    decidedAt: daysAgo(18),
    category: 'promotion',
    changePct: 0.118,
    fromSalary: pick(22).baseSalary,
    toSalary: Math.round(pick(22).baseSalary * 1.118 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Ylennys L3 → L4. Vastuualue kasvaa kahden tiimin teknisestä johtamisesta.',
      en: 'Promotion L3 → L4. Scope increases to technical leadership of two teams.',
    },
    attachments: ['promotion-memo.pdf', 'role-spec-L4.pdf'],
  },
  {
    id: 'J-2034',
    employeeId: pick(33).id,
    decidedBy: 'Sari Salmela',
    decidedAt: daysAgo(24),
    category: 'performance',
    changePct: 0.045,
    fromSalary: pick(33).baseSalary,
    toSalary: Math.round(pick(33).baseSalary * 1.045 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Vuosittainen suoritusarvio 5/5 kahtena vuonna peräkkäin, dokumentoidut tavoitteet täytetty.',
      en: 'Annual performance rating 5/5 two years running, documented goals met.',
    },
    attachments: ['perf-review-2025.pdf'],
  },
  {
    id: 'J-2035',
    employeeId: pick(48).id,
    decidedBy: 'Anna Virtanen',
    decidedAt: daysAgo(31),
    category: 'scarce',
    changePct: 0.097,
    fromSalary: pick(48).baseSalary,
    toSalary: Math.round(pick(48).baseSalary * 1.097 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Pilvinatiivien tietoturva-arkkitehtien tarjonta Suomessa erittäin niukkaa (Korn Ferry 2026 -raportti). Markkinapremium dokumentoitu.',
      en: 'Cloud-native security architect supply in Finland highly constrained (Korn Ferry 2026 report). Market premium documented.',
    },
    attachments: ['kf-scarcity-2026.pdf'],
  },
  {
    id: 'J-2036',
    employeeId: pick(60).id,
    decidedBy: 'Mikko Heikkilä',
    decidedAt: daysAgo(38),
    category: 'seniority',
    changePct: 0.030,
    fromSalary: pick(60).baseSalary,
    toSalary: Math.round(pick(60).baseSalary * 1.030 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Kymmenen vuoden täysi virka, kokemustasolla aiempaa tehtävää laajempi vastuualue.',
      en: 'Ten-year tenure milestone with broader responsibility scope vs. earlier role.',
    },
    attachments: [],
  },
  {
    id: 'J-2037',
    employeeId: pick(72).id,
    decidedBy: 'Sari Salmela',
    decidedAt: daysAgo(45),
    category: 'correction',
    changePct: 0.115,
    fromSalary: pick(72).baseSalary,
    toSalary: Math.round(pick(72).baseSalary * 1.115 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Tasakorjaus: aiempi alku-palkka neuvoteltu epäsuotuisasti, johon palkka-avoimuusdirektiivi ei salli vedota perusteena.',
      en: 'Equity correction: prior starting salary negotiated unfavourably; the directive prohibits using that as a justification going forward.',
    },
    attachments: ['equity-review-memo.pdf'],
  },
  {
    id: 'J-2038',
    employeeId: pick(85).id,
    decidedBy: 'Anna Virtanen',
    decidedAt: daysAgo(52),
    category: 'market',
    changePct: 0.038,
    fromSalary: pick(85).baseSalary,
    toSalary: Math.round(pick(85).baseSalary * 1.038 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Asiakaspalvelun L2-tason markkinakehitys + paikallinen elinkustannusindeksi.',
      en: 'Customer service L2 market movement + regional cost-of-living index.',
    },
    attachments: ['mercer-cs-2026.pdf'],
  },
  {
    id: 'J-2039',
    employeeId: pick(99).id,
    decidedBy: 'Mikko Heikkilä',
    decidedAt: daysAgo(58),
    category: 'performance',
    changePct: 0.060,
    fromSalary: pick(99).baseSalary,
    toSalary: Math.round(pick(99).baseSalary * 1.060 / 100) * 100,
    status: 'pending',
    rationale: {
      fi: 'Ehdotettu korotus 4/5-arvosanan ja Q1-tavoitteiden ylittymisen perusteella. Odottaa palkkakomitean hyväksyntää.',
      en: 'Proposed increase based on 4/5 rating and Q1 goal overachievement. Awaiting comp committee approval.',
    },
    attachments: ['q1-goals.pdf'],
  },
  {
    id: 'J-2040',
    employeeId: pick(110).id,
    decidedBy: 'Anna Virtanen',
    decidedAt: daysAgo(64),
    category: 'promotion',
    changePct: 0.140,
    fromSalary: pick(110).baseSalary,
    toSalary: Math.round(pick(110).baseSalary * 1.140 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Ylennys L4 → L5. Päällikkövastuu, alaisuuteen 7 henkilöä.',
      en: 'Promotion L4 → L5. Manager scope, 7 direct reports.',
    },
    attachments: ['promotion-L5-memo.pdf'],
  },
  {
    id: 'J-2041',
    employeeId: pick(125).id,
    decidedBy: 'Sari Salmela',
    decidedAt: daysAgo(72),
    category: 'correction',
    changePct: 0.072,
    fromSalary: pick(125).baseSalary,
    toSalary: Math.round(pick(125).baseSalary * 1.072 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Sukupuolten välisen palkkaeron tasakorjaus markkinointitiimissä, dokumentoitu Q4 2025 audit.',
      en: 'Gender pay-gap equity correction in marketing team, documented in Q4 2025 audit.',
    },
    attachments: ['marketing-audit-2025q4.pdf'],
  },
  {
    id: 'J-2042',
    employeeId: pick(138).id,
    decidedBy: 'Mikko Heikkilä',
    decidedAt: daysAgo(80),
    category: 'seniority',
    changePct: 0.025,
    fromSalary: pick(138).baseSalary,
    toSalary: Math.round(pick(138).baseSalary * 1.025 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Viiden vuoden palvelusvuosimerkki, vakiintunut käytäntö.',
      en: 'Five-year service milestone, established practice.',
    },
    attachments: [],
  },
  {
    id: 'J-2043',
    employeeId: pick(150).id,
    decidedBy: 'Anna Virtanen',
    decidedAt: daysAgo(88),
    category: 'scarce',
    changePct: 0.110,
    fromSalary: pick(150).baseSalary,
    toSalary: Math.round(pick(150).baseSalary * 1.110 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Salesforce-arkkitehdin niukka tarjonta pohjoismaissa. Dokumentoitu rekrytointitarjousten määrä viimeisen 6 kk aikana.',
      en: 'Salesforce architect supply scarce in the Nordics. Number of competing offers in past 6 months documented.',
    },
    attachments: ['offer-analysis-2026.pdf'],
  },
  {
    id: 'J-2044',
    employeeId: pick(165).id,
    decidedBy: 'Sari Salmela',
    decidedAt: daysAgo(95),
    category: 'performance',
    changePct: 0.052,
    fromSalary: pick(165).baseSalary,
    toSalary: Math.round(pick(165).baseSalary * 1.052 / 100) * 100,
    status: 'pending',
    rationale: {
      fi: 'Ehdotus perustuu 5/5-arvioon ja merkittävään liidiosuuteen Q4-launchissa.',
      en: 'Proposal based on 5/5 review and significant lead role in Q4 launch.',
    },
    attachments: [],
  },
  {
    id: 'J-2045',
    employeeId: pick(180).id,
    decidedBy: 'Mikko Heikkilä',
    decidedAt: daysAgo(102),
    category: 'market',
    changePct: 0.041,
    fromSalary: pick(180).baseSalary,
    toSalary: Math.round(pick(180).baseSalary * 1.041 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'IT-operaatioiden L4-tason markkina-aineisto kerätty Mercer ja Korn Ferry -lähteistä, mediaani noussut 4 %.',
      en: 'IT ops L4 benchmark from Mercer + Korn Ferry: median up 4 %.',
    },
    attachments: ['mercer-it-2026.pdf'],
  },
  {
    id: 'J-2046',
    employeeId: pick(195).id,
    decidedBy: 'Anna Virtanen',
    decidedAt: daysAgo(110),
    category: 'correction',
    changePct: 0.064,
    fromSalary: pick(195).baseSalary,
    toSalary: Math.round(pick(195).baseSalary * 1.064 / 100) * 100,
    status: 'approved',
    rationale: {
      fi: 'Tasakorjaus operaatioiden L3-tason naispuolisten työntekijöiden kohdalla yhteisen palkkakartoituksen jälkeen.',
      en: 'Equity correction for female employees in Operations L3 following joint pay assessment.',
    },
    attachments: ['ops-jpa-2026.pdf'],
  },
];
