import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { getSettings, updateSettings, type Appearance } from '@/services/plus/settings';
import {
  DarkPalette,
  LightPalette,
  THEMES,
  getStatusInk,
  setActivePalette,
  type PaletteShape,
  type ThemeName,
} from '@/theme';

type ThemeContextValue = {
  /** Clair / Sombre / Auto — the luminosity switch. */
  appearance: Appearance;
  setAppearance: (value: Appearance) => void;
  /** The chosen paper (Plus ▸ Apparence ▸ Thème). */
  theme: ThemeName;
  setTheme: (value: ThemeName) => void;
  /** The paper actually on screen — `nuit` whenever the scheme is dark. */
  resolvedTheme: ThemeName;
  scheme: 'light' | 'dark';
  palette: PaletteShape;
  statusInk: ReturnType<typeof getStatusInk>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Resolves Apparence (Clair/Sombre/Auto) × Thème (Atelier/Neige/Ardoise/
 * Sable/Nuit) to the active palette and pushes it into the live `Palette`
 * object, so every screen — themed-hook consumers AND `createThemedStyles`
 * call sites — follows the same paper.
 *
 * Resolution: the luminosity switch decides light/dark first; any dark
 * result lands on Nuit. In the light, the chosen paper applies — and
 * choosing Nuit as the paper IS choosing the dark scheme.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [appearance, setAppearanceState] = useState<Appearance>('clair');
  const [theme, setThemeState] = useState<ThemeName>('atelier');

  useEffect(() => {
    getSettings().then((settings) => {
      setAppearanceState(settings.appearance);
      setThemeState(settings.theme);
    });
  }, []);

  const setAppearance = (value: Appearance) => {
    setAppearanceState(value);
    updateSettings({ appearance: value });
  };

  const setTheme = (value: ThemeName) => {
    setThemeState(value);
    updateSettings({ theme: value });
  };

  const baseScheme: 'light' | 'dark' =
    appearance === 'sombre'
      ? 'dark'
      : appearance === 'clair'
        ? 'light'
        : systemScheme === 'dark'
          ? 'dark'
          : 'light';

  const resolvedTheme: ThemeName = baseScheme === 'dark' ? 'nuit' : theme;
  const scheme = THEMES[resolvedTheme].scheme;
  const palette = THEMES[resolvedTheme].palette;

  // Swap the live palette DURING render, before any child renders — every
  // `Palette.x` read and every themed stylesheet resolved this frame is
  // already on the new paper.
  useMemo(() => {
    setActivePalette(palette);
  }, [palette]);

  const statusInk = useMemo(() => getStatusInk(palette), [palette]);

  const value = useMemo(
    () => ({
      appearance,
      setAppearance,
      theme,
      setTheme,
      resolvedTheme,
      scheme,
      palette,
      statusInk,
    }),
    [appearance, theme, resolvedTheme, scheme, palette, statusInk]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Screens outside the ThemeProvider tree (shouldn't happen once mounted
    // at the app root) still get a valid, default-paper value.
    return {
      appearance: 'clair',
      setAppearance: () => {},
      theme: 'atelier',
      setTheme: () => {},
      resolvedTheme: 'atelier',
      scheme: 'light',
      palette: LightPalette,
      statusInk: getStatusInk(LightPalette),
    };
  }
  return ctx;
}

export { DarkPalette, LightPalette };
