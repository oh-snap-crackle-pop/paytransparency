import { employees } from '../src/data/employees';
import { meanGap, medianGap, gapByDepartment } from '../src/lib/analytics';
import { departmentById } from '../src/data/departments';

console.log('Headcount:', employees.length);
console.log('Overall mean gap:', (meanGap(employees) * 100).toFixed(2) + '%');
console.log('Overall median gap:', (medianGap(employees) * 100).toFixed(2) + '%');
console.log('---');
for (const d of gapByDepartment()) {
  const name = departmentById[d.departmentId].name.en;
  console.log(
    `  ${d.departmentId.padEnd(6)} ${name.padEnd(18)}  mean ${(d.meanGap * 100)
      .toFixed(2)
      .padStart(6)}%   med ${(d.medianGap * 100).toFixed(2).padStart(6)}%   n=${d.headcount}${
      d.flagged ? '  ⚠ FLAG' : ''
    }`,
  );
}
