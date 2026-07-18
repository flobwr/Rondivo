import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { type ReactNode } from 'react';

import { IconWell, type IconName } from '@/components/ui/IconWell';
import { useTheme } from '@/contexts/theme';
import { Spacing, Type } from '@/theme';

/**
 * Rondivo large-title bar — the header of the five tab-root screens.
 *
 * Left-aligned 30 pt title over the bare paper, an optional small-caps
 * eyebrow above (a month, a count) or a one-line subtitle below, and ONE
 * trailing action in a 44 pt icon well — the same well vocabulary as the
 * AppBar, one size up. Root screens never stack multiple header buttons.
 */
export function LargeTitleBar({
  title,
  eyebrow,
  subtitle,
  action,
  trailing,
  padded = true,
  style,
}: {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  action?: { icon: IconName; onPress?: () => void; label: string };
  /** Arbitrary trailing chrome for the rare non-standard root header. */
  trailing?: ReactNode;
  /** The bar pads its own gutters unless the parent already does. */
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const { palette } = useTheme();

  return (
    <View style={[styles.row, padded && { paddingHorizontal: Spacing.screen }, style]}>
      <View style={styles.texts}>
        {eyebrow ? (
          <Text style={[styles.eyebrow, { color: palette.textSecondary }]} numberOfLines={1}>
            {eyebrow}
          </Text>
        ) : null}
        <Text style={[Type.largeTitle, { color: palette.textPrimary }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[Type.footnote, { color: palette.textSecondary, marginTop: 3 }]}
            numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {trailing ??
        (action ? (
          <IconWell
            icon={action.icon}
            onPress={action.onPress}
            accessibilityLabel={action.label}
            size={44}
            iconSize={21}
            tone="accent"
          />
        ) : null)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  texts: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
});
