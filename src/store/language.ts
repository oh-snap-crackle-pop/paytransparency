import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'fi' | 'en';

interface LanguageState {
  lang: Language;
  setLang: (lang: Language) => void;
  toggle: () => void;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set, get) => ({
      lang: 'fi',
      setLang: (lang) => set({ lang }),
      toggle: () => set({ lang: get().lang === 'fi' ? 'en' : 'fi' }),
    }),
    { name: 'integrata-lang' },
  ),
);
