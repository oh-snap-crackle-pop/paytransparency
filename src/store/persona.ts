import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Persona = 'hr' | 'employee';

interface PersonaState {
  persona: Persona;
  setPersona: (p: Persona) => void;
}

export const usePersona = create<PersonaState>()(
  persist(
    (set) => ({
      persona: 'hr',
      setPersona: (persona) => set({ persona }),
    }),
    { name: 'integrata-persona' },
  ),
);
