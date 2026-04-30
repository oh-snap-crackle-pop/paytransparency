import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers3,
  ClipboardList,
  CalendarRange,
  FileText,
  MessageCircle,
  Wallet,
  Compass,
} from 'lucide-react';
import { useT } from '@/lib/i18n';
import { usePersona } from '@/store/persona';
import { cn } from '@/lib/cn';

interface NavItem {
  to: string;
  labelKey: string;
  icon: typeof LayoutDashboard;
}

const hrNav: NavItem[] = [
  { to: '/hr/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/hr/bands', labelKey: 'nav.bands', icon: Layers3 },
  { to: '/hr/justifications', labelKey: 'nav.justifications', icon: ClipboardList },
  { to: '/hr/review', labelKey: 'nav.review', icon: CalendarRange },
  { to: '/hr/reports', labelKey: 'nav.reports', icon: FileText },
  { to: '/hr/assistant', labelKey: 'nav.assistant', icon: MessageCircle },
];

const employeeNav: NavItem[] = [
  { to: '/me', labelKey: 'nav.myPay', icon: Wallet },
  { to: '/me/criteria', labelKey: 'nav.criteria', icon: Compass },
];

export function Sidebar() {
  const { t } = useT();
  const persona = usePersona((s) => s.persona);
  const { pathname } = useLocation();
  // Honor the URL when it disagrees with the stored persona (deep-linking).
  const effectivePersona = pathname.startsWith('/me') ? 'employee' : persona === 'employee' ? 'employee' : 'hr';
  const items = effectivePersona === 'hr' ? hrNav : employeeNav;

  return (
    <aside className="hidden w-64 shrink-0 border-r border-ink-200/70 bg-surface-0 lg:block">
      <nav className="flex flex-col gap-0.5 p-3">
        <div className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-400">
          {t(effectivePersona === 'hr' ? 'persona.hr' : 'persona.employee')}
        </div>
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/me'}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-integrata-100 text-integrata-900'
                  : 'text-ink-600 hover:bg-surface-50 hover:text-ink-900',
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn('h-4 w-4', isActive ? 'text-integrata-700' : 'text-ink-400 group-hover:text-ink-600')}
                />
                <span>{t(item.labelKey as Parameters<typeof t>[0])}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mx-3 mt-4 rounded-md border border-integrata-200 bg-integrata-50 p-3">
        <p className="text-xs font-semibold text-integrata-900">
          {t('brand.tagline')}
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-integrata-700">
          {t('assistant.disclaimer')}
        </p>
      </div>
    </aside>
  );
}
