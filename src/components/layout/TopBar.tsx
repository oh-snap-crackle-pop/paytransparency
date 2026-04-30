import { useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { PersonaSwitcher } from './PersonaSwitcher';
import { useT } from '@/lib/i18n';
import { usePersona } from '@/store/persona';

export function TopBar() {
  const { t } = useT();
  const persona = usePersona((s) => s.persona);
  const { pathname } = useLocation();
  const effective = pathname.startsWith('/me') ? 'employee' : persona === 'employee' ? 'employee' : 'hr';
  const name = effective === 'hr' ? t('persona.annaName') : t('persona.samiName');
  const title = effective === 'hr' ? t('persona.annaTitle') : t('persona.samiTitle');
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('');

  return (
    <header className="sticky top-0 z-30 border-b border-ink-200/70 bg-surface-0/85 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-6 px-6">
        <Logo />
        <div className="flex items-center gap-3">
          <PersonaSwitcher />
          <LanguageToggle />
          <div className="flex items-center gap-2.5 border-l border-ink-200 pl-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-integrata-100 text-sm font-semibold text-integrata-900">
              {initials}
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-ink-900">{name}</span>
              <span className="text-xs text-ink-500">{title}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
