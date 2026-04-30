import type { Language } from '@/store/language';

const localeMap: Record<Language, string> = { fi: 'fi-FI', en: 'en-GB' };

export function formatEUR(amount: number, lang: Language = 'fi', opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(localeMap[lang], {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
    ...opts,
  }).format(amount);
}

export function formatPercent(value: number, lang: Language = 'fi', digits = 1) {
  return new Intl.NumberFormat(localeMap[lang], {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatNumber(value: number, lang: Language = 'fi') {
  return new Intl.NumberFormat(localeMap[lang]).format(value);
}

export function formatDate(date: Date | string, lang: Language = 'fi') {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeMap[lang], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d);
}
