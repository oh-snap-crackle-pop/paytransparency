import { useLocation, useNavigate } from 'react-router-dom';
import { Building2, User } from 'lucide-react';
import { usePersona, type Persona } from '@/store/persona';
import { useT } from '@/lib/i18n';
import { cn } from '@/lib/cn';

export function PersonaSwitcher() {
  const { t } = useT();
  const persona = usePersona((s) => s.persona);
  const setPersona = usePersona((s) => s.setPersona);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const effective: Persona = pathname.startsWith('/me') ? 'employee' : persona;

  function pick(p: Persona) {
    setPersona(p);
    navigate(p === 'hr' ? '/hr/dashboard' : '/me');
  }

  return (
    <div
      role="radiogroup"
      aria-label={t('persona.label')}
      className="inline-flex items-center rounded-md border border-ink-200 bg-surface-0 p-0.5 text-sm"
    >
      <button
        role="radio"
        aria-checked={effective === 'hr'}
        onClick={() => pick('hr')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-medium transition-colors',
          effective === 'hr'
            ? 'bg-integrata-900 text-surface-0'
            : 'text-ink-500 hover:text-ink-900',
        )}
      >
        <Building2 className="h-3.5 w-3.5" />
        {t('persona.hr')}
      </button>
      <button
        role="radio"
        aria-checked={effective === 'employee'}
        onClick={() => pick('employee')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-sm px-3 py-1.5 font-medium transition-colors',
          effective === 'employee'
            ? 'bg-integrata-900 text-surface-0'
            : 'text-ink-500 hover:text-ink-900',
        )}
      >
        <User className="h-3.5 w-3.5" />
        {t('persona.employee')}
      </button>
    </div>
  );
}
