import { StyleSheet, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';

export type AppDividerProps = {
  /** Vertical instead of horizontal. */
  vertical?: boolean;
  /** Inset from the leading edge (e.g. to align under a list item's text). */
  inset?: number;
  /** Vertical margin around a horizontal divider. */
  spacing?: keyof typeof Spacing | number;
  color?: string;
};

/**
 * A hairline separator in the design-system border colour. Replaces the
 * repeated `height: StyleSheet.hairlineWidth, backgroundColor: Palette.border`
 * separators in the reminders list and card stacks.
 */
export function AppDivider({ vertical = false, inset = 0, spacing, color = Palette.border }: AppDividerProps) {
  const margin = spacing === undefined ? 0 : typeof spacing === 'number' ? spacing : Spacing[spacing];

  if (vertical) {
    return <View style={[styles.vertical, { backgroundColor: color, marginHorizontal: margin }]} />;
  }
  return (
    <View
      style={[styles.horizontal, { backgroundColor: color, marginLeft: inset, marginVertical: margin }]}
    />
  );
}

const styles = StyleSheet.create({
  horizontal: {
    height: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  vertical: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
});
