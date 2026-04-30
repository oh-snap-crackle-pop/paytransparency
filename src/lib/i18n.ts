import { fi, type Dict } from '@/i18n/fi';
import { en } from '@/i18n/en';
import { useLanguage } from '@/store/language';

const dicts: Record<'fi' | 'en', Dict> = { fi, en };

type DotPath<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : T[K] extends object
    ? DotPath<T[K], `${P}${K}.`>
    : never;
}[keyof T & string];

export type TKey = DotPath<Dict>;

function readPath(obj: unknown, path: string): string {
  const parts = path.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return path;
    }
  }
  return typeof cur === 'string' ? cur : path;
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}

export function useT() {
  const lang = useLanguage((s) => s.lang);
  const dict = dicts[lang];
  const t = (key: TKey, vars?: Record<string, string | number>) =>
    interpolate(readPath(dict, key), vars);
  return { t, lang };
}
