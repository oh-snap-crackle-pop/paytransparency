import { useLanguage } from '@/store/language';
import { cn } from '@/lib/cn';

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex items-center rounded-md border border-ink-200 bg-surface-0 p-0.5 text-xs font-semibold"
    >
      {(['fi', 'en'] as const).map((code) => (
        <button
          key={code}
          role="radio"
          aria-checked={lang === code}
          onClick={() => setLang(code)}
          className={cn(
            'rounded-sm px-2.5 py-1 uppercase tracking-wide transition-colors',
            lang === code
              ? 'bg-integrata-900 text-surface-0'
              : 'text-ink-500 hover:text-ink-900',
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
