import { Text, TextProps } from 'react-native';

import { Palette, Typography, TypographyVariant } from '@/constants/design';

type ColorToken = 'primary' | 'secondary' | 'tertiary' | 'inverse' | 'accent';

const COLOR: Record<ColorToken, string> = {
  primary: Palette.textPrimary,
  secondary: Palette.textSecondary,
  tertiary: Palette.textTertiary,
  inverse: Palette.white,
  accent: Palette.blue,
};

export type AppTextProps = TextProps & {
  /** Typography ramp entry — bundles size + weight + tracking. */
  variant?: TypographyVariant;
  /** Semantic text colour. Defaults to primary. */
  color?: ColorToken;
};

/**
 * The only Text you should reach for in app code.
 *
 * Instead of re-declaring `{ fontSize, fontWeight, letterSpacing, color }` in
 * every StyleSheet, pick a semantic variant + colour. This is what makes the
 * type ramp impossible to drift.
 *
 * @example <AppText variant="headline">Martin Dupont</AppText>
 * @example <AppText variant="overline" color="secondary">Prochaine intervention</AppText>
 */
export function AppText({ variant = 'body', color = 'primary', style, ...rest }: AppTextProps) {
  return <Text style={[Typography[variant], { color: COLOR[color] }, style]} {...rest} />;
}
