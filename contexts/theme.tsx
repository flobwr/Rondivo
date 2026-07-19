import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { getSettings, updateSettings, type ThemeChoice } from '@/services/plus/settings';
import {
  LightPalette,
  MidnightPalette,
  THEMES,
  getStatusInk,
  setActivePalette,
  type PaletteShape,
  type ThemeName,
} from '@/theme';

type ThemeContextValue = {
  /** The raw setting — a paper name, or `auto` to follow the system. */
  theme: ThemeChoice;
  setTheme: (value: ThemeChoice) => void;
  /** `theme` resolved to an actual paper — `auto` becomes Atelier or Midnight. */
  resolvedTheme: ThemeName;
  scheme: 'light' | 'dark';
  palette: PaletteShape;
  statusInk: ReturnType<typeof getStatusInk>;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Resolves the Thème setting (Plus ▸ Apparence) to an actual paper and
 * pushes it into the live `Palette` object, so every screen — themed-hook
 * consumers AND `createThemedStyles` call sites — follows the same paper.
 *
 * `auto` isn't its own palette: it watches the OS light/dark switch and
 * resolves to Atelier or Midnight, exactly like choosing either directly.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeChoice>('atelier');

  useEffect(() => {
    getSettings().then((settings) => setThemeState(settings.theme));
  }, []);

  const setTheme = (value: ThemeChoice) => {
    setThemeState(value);
    updateSettings({ theme: value });
  };

  const resolvedTheme: ThemeName =
    theme === 'auto' ? (systemScheme === 'dark' ? 'midnight' : 'atelier') : theme;

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
    () => ({ theme, setTheme, resolvedTheme, scheme, palette, statusInk }),
    [theme, resolvedTheme, scheme, palette, statusInk]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Screens outside the ThemeProvider tree (shouldn't happen once mounted
    // at the app root) still get a valid, default-paper value.
    return {
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

export { LightPalette, MidnightPalette as DarkPalette };
