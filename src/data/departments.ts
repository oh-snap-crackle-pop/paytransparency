export interface Department {
  id: string;
  name: { fi: string; en: string };
  short: string;
}

export const departments: Department[] = [
  { id: 'eng', short: 'ENG', name: { fi: 'Tekniikka', en: 'Engineering' } },
  { id: 'sales', short: 'SAL', name: { fi: 'Myynti', en: 'Sales' } },
  { id: 'mkt', short: 'MKT', name: { fi: 'Markkinointi', en: 'Marketing' } },
  { id: 'cs', short: 'CS', name: { fi: 'Asiakaspalvelu', en: 'Customer Service' } },
  { id: 'hr', short: 'HR', name: { fi: 'Henkilöstöhallinto', en: 'HR' } },
  { id: 'fin', short: 'FIN', name: { fi: 'Talous', en: 'Finance' } },
  { id: 'ops', short: 'OPS', name: { fi: 'Operaatiot', en: 'Operations' } },
  { id: 'it', short: 'IT', name: { fi: 'IT', en: 'IT' } },
];

export const departmentById = Object.fromEntries(
  departments.map((d) => [d.id, d]),
) as Record<string, Department>;
