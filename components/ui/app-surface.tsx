import { StyleSheet, View, ViewProps } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow, badgeShadow, cardShadow, heroShadow } from '@/constants/shadow';

type Elevation = 'none' | 'badge' | 'action' | 'card' | 'hero';
type SurfaceRadius = keyof typeof Radius;
type PadStep = keyof typeof Spacing | number;

const ELEVATION = {
  none: null,
  badge: badgeShadow,
  action: actionShadow,
  card: cardShadow,
  hero: heroShadow,
} as const satisfies Record<Elevation, object | null>;

export type AppSurfaceProps = ViewProps & {
  /** Background colour token. Defaults to the white card colour. */
  background?: keyof typeof Palette;
  /** Corner radius token. Defaults to `card`. */
  radius?: SurfaceRadius;
  /** Named shadow level from the design system. Defaults to `none`. */
  elevation?: Elevation;
  /** Uniform padding — a Spacing token name or raw number. */
  padding?: PadStep;
  /** Add a hairline border in the design-system border colour. */
  bordered?: boolean;
};

function pad(value: PadStep | undefined): number | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? value : Spacing[value];
}

/**
 * The lowest-level "box": a background + radius + optional elevation/border.
 *
 * Every card-like container in the app is an AppSurface underneath. Use it
 * directly when you need a plain panel, or reach for AppCard when you want the
 * standard card padding + press behaviour.
 */
export function AppSurface({
  background = 'card',
  radius = 'card',
  elevation = 'none',
  padding,
  bordered = false,
  style,
  ...rest
}: AppSurfaceProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Palette[background],
          borderRadius: Radius[radius],
          padding: pad(padding),
        },
        bordered ? styles.bordered : null,
        ELEVATION[elevation],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
});
