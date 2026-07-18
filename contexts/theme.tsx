import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { DarkPalette, getPalette, getStatusInk, LightPalette, type PaletteShape } from '@/theme';
import { getSettings, updateSettings, type Appearance } from '@/services/plus/settings';

type ThemeContextValue = {
  appearance: Appearance;
  setAppearance: (value: Appearance) => void;
  scheme: 'light' | 'dark';
  palette: PaletteShape;
  statusInk: ReturnType<typeof getStatusInk>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Resolves the "Apparence" setting (Plus ▸ Apparence) to an actual light/dark
 * palette and makes it reactive app-wide — reading `SETTINGS.appearance`
 * directly wouldn't re-render anything, since it's a plain mutated object.
 * Only a handful of "key" screens consume `palette` from `useTheme()` today;
 * everything else still imports the static `Palette` from `@/theme`
 * and stays light regardless of this setting (see that file's comment).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [appearance, setAppearanceState] = useState<Appearance>('clair');

  useEffect(() => {
    getSettings().then((settings) => setAppearanceState(settings.appearance));
  }, []);

  const setAppearance = (value: Appearance) => {
    setAppearanceState(value);
    updateSettings({ appearance: value });
  };

  const scheme: 'light' | 'dark' =
    appearance === 'sombre' ? 'dark' : appearance === 'clair' ? 'light' : systemScheme === 'dark' ? 'dark' : 'light';

  const palette = useMemo(() => getPalette(scheme), [scheme]);
  const statusInk = useMemo(() => getStatusInk(palette), [palette]);

  const value = useMemo(
    () => ({ appearance, setAppearance, scheme, palette, statusInk }),
    [appearance, scheme, palette, statusInk]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Screens outside the ThemeProvider tree (shouldn't happen once mounted
    // at the app root) still get a valid, light-mode-equivalent value.
    return { appearance: 'clair', setAppearance: () => {}, scheme: 'light', palette: LightPalette, statusInk: getStatusInk(LightPalette) };
  }
  return ctx;
}

export { DarkPalette, LightPalette };
