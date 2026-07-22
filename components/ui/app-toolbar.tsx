import { StyleSheet, View, ViewProps } from 'react-native';

import { Palette, Spacing } from '@/constants/design';

type Align = 'start' | 'center' | 'end' | 'between';

export type AppToolbarProps = ViewProps & {
  align?: Align;
  /** Horizontal screen padding. Defaults to the standard screen margin. */
  inset?: boolean;
  /** Draw a hairline separator below the toolbar. */
  divider?: boolean;
  gap?: keyof typeof Spacing | number;
};

const JUSTIFY: Record<Align, ViewProps['style']> = {
  start: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  end: { justifyContent: 'flex-end' },
  between: { justifyContent: 'space-between' },
};

/**
 * A horizontal strip of controls — filter chips, segmented actions, a row of
 * icon buttons. Handles alignment, gaps and the optional bottom hairline so
 * sub-headers and action bars stay consistent across screens.
 */
export function AppToolbar({
  align = 'between',
  inset = true,
  divider = false,
  gap = 'sm',
  style,
  ...rest
}: AppToolbarProps) {
  const columnGap = typeof gap === 'number' ? gap : Spacing[gap];

  return (
    <View
      style={[
        styles.row,
        JUSTIFY[align],
        { gap: columnGap },
        inset ? styles.inset : null,
        divider ? styles.divider : null,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  inset: {
    paddingHorizontal: Spacing.screen,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
});
