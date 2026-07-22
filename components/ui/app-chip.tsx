import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { Accent, AccentName, IconSize, Palette, Radius, Spacing } from '@/constants/design';
import { PressScale } from '@/constants/motion';
import { AppText } from './app-text';
import { PressableScale, PressableScaleProps } from './pressable-scale';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppChipProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  label: string;
  icon?: FeatherName;
  /** Accent used when selected (and for the icon). */
  accent?: AccentName;
  /** Selected/active state — filled with the soft accent background. */
  selected?: boolean;
};

/**
 * An interactive, selectable pill — filters, tags, quick toggles. Unlike
 * AppBadge (a static status label), a chip is pressable and has a selected
 * state. Reach for this before inventing a `FilterButton`.
 */
export function AppChip({ label, icon, accent = 'blue', selected = false, ...rest }: AppChipProps) {
  const a = Accent[accent];
  const fg = selected ? a.solid : Palette.textSecondary;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected }}
      pressScale={PressScale.icon}
      style={[
        styles.base,
        {
          backgroundColor: selected ? a.soft : Palette.cardMuted,
          borderColor: selected ? a.soft : Palette.border,
        },
      ]}
      {...rest}>
      <View style={styles.row}>
        {icon ? <Feather name={icon} size={IconSize.sm} color={fg} /> : null}
        <AppText variant="caption" style={{ color: fg }} numberOfLines={1}>
          {label}
        </AppText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
});
