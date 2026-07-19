import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/theme';
import { getElevation, Radius, Spacing } from '@/theme';

/**
 * Rondivo card — an off-white sheet resting on the paper.
 *
 *  · `resting` — the standard sheet (contact + ambient shadow).
 *  · `raised`  — the screen's ONE dominant card; at most one per screen.
 *  · `flat`    — recessed grouping inside another card; no shadow.
 *
 * Cards never carry borders in light mode — separation is light, not line.
 * (Dark mode adds a hairline edge because shadows die on night paper.)
 */
export function Card({
  children,
  variant = 'resting',
  padded = true,
  style,
}: {
  children: ReactNode;
  variant?: 'resting' | 'raised' | 'flat';
  /** Interior padding on by default; disable for lists that manage their own. */
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { palette, scheme, resolvedTheme } = useTheme();
  const elevation = getElevation(resolvedTheme);

  const surface: ViewStyle =
    variant === 'flat'
      ? { backgroundColor: palette.cardMuted, borderRadius: Radius.tile }
      : {
          backgroundColor: palette.card,
          borderRadius: variant === 'raised' ? Radius.hero : Radius.card,
          ...(variant === 'raised' ? elevation.raised : elevation.card),
          ...(scheme === 'dark'
            ? { borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border }
            : null),
        };

  return (
    <View style={[surface, padded && { padding: Spacing.cardPadding }, style]}>{children}</View>
  );
}
