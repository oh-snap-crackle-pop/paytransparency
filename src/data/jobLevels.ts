export interface JobLevel {
  id: string;
  index: number;
  code: string;
  name: { fi: string; en: string };
  bandMin: number;
  bandMid: number;
  bandMax: number;
}

export const jobLevels: JobLevel[] = [
  {
    id: 'L1',
    index: 1,
    code: 'L1',
    name: { fi: 'Junior', en: 'Junior' },
    bandMin: 36000,
    bandMid: 40000,
    bandMax: 44000,
  },
  {
    id: 'L2',
    index: 2,
    code: 'L2',
    name: { fi: 'Asiantuntija', en: 'Specialist' },
    bandMin: 42000,
    bandMid: 48000,
    bandMax: 54000,
  },
  {
    id: 'L3',
    index: 3,
    code: 'L3',
    name: { fi: 'Senior-asiantuntija', en: 'Senior Specialist' },
    bandMin: 50000,
    bandMid: 58000,
    bandMax: 66000,
  },
  {
    id: 'L4',
    index: 4,
    code: 'L4',
    name: { fi: 'Lead / Senior', en: 'Lead / Senior' },
    bandMin: 60000,
    bandMid: 71000,
    bandMax: 82000,
  },
  {
    id: 'L5',
    index: 5,
    code: 'L5',
    name: { fi: 'Päällikkö', en: 'Manager' },
    bandMin: 75000,
    bandMid: 90000,
    bandMax: 105000,
  },
  {
    id: 'L6',
    index: 6,
    code: 'L6',
    name: { fi: 'Johtaja', en: 'Director' },
    bandMin: 95000,
    bandMid: 120000,
    bandMax: 145000,
  },
];

export const jobLevelById = Object.fromEntries(
  jobLevels.map((l) => [l.id, l]),
) as Record<string, JobLevel>;
