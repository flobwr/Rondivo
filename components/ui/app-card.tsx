import { StyleSheet, View, ViewProps } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow, badgeShadow, cardShadow, heroShadow } from '@/constants/shadow';
import { AppSurface, AppSurfaceProps } from './app-surface';
import { PressableScale, PressableScaleProps } from './pressable-scale';

const ELEVATION_SHADOW = {
  none: null,
  badge: badgeShadow,
  action: actionShadow,
  card: cardShadow,
  hero: heroShadow,
} as const;

export type AppCardProps = Omit<AppSurfaceProps, 'elevation' | 'radius'> & {
  /** Shadow level. Defaults to the standard white-card shadow. */
  elevation?: AppSurfaceProps['elevation'];
  /** Corner radius. Defaults to `card`. */
  radius?: AppSurfaceProps['radius'];
  /** When set, the whole card becomes a springy pressable. */
  onPress?: PressableScaleProps['onPress'];
  /** Press options forwarded to PressableScale when `onPress` is set. */
  pressProps?: Omit<PressableScaleProps, 'onPress' | 'style' | 'children'>;
};

/**
 * The standard Rondivo card: white surface, `card` radius, card shadow and the
 * canonical 20px internal padding. This is the default container for a unit of
 * content (an appointment, a reminder, a metric group…).
 *
 * Compose it with the slot components below rather than growing one giant card:
 *
 *   <AppCard>
 *     <CardHeader … />
 *     <CardContent>…</CardContent>
 *     <CardFooter>…</CardFooter>
 *   </AppCard>
 *
 * Pass `onPress` to make the entire card an animated pressable.
 */
export function AppCard({
  elevation = 'card',
  radius = 'card',
  padding = 'cardPadding',
  background = 'card',
  bordered = false,
  onPress,
  pressProps,
  style,
  children,
  ...rest
}: AppCardProps) {
  if (onPress) {
    return (
      <PressableScale
        onPress={onPress}
        pressScale={0.98}
        style={[
          {
            backgroundColor: Palette[background],
            borderRadius: Radius[radius],
            padding: typeof padding === 'number' ? padding : Spacing[padding],
          },
          bordered ? styles.bordered : null,
          ELEVATION_SHADOW[elevation],
          style,
        ]}
        {...pressProps}>
        {children}
      </PressableScale>
    );
  }

  return (
    <AppSurface
      elevation={elevation}
      radius={radius}
      padding={padding}
      background={background}
      bordered={bordered}
      style={style}
      {...rest}>
      {children}
    </AppSurface>
  );
}

// ── Slots ─────────────────────────────────────────────────────────────────────

type SlotProps = ViewProps & { children?: React.ReactNode };

/** Top row of a card: title/eyebrow on the left, actions/meta on the right. */
export function CardHeader({ style, ...rest }: SlotProps) {
  return <View style={[styles.header, style]} {...rest} />;
}

/** Main body of a card. Adds vertical rhythm above when following a header. */
export function CardContent({ style, ...rest }: SlotProps) {
  return <View style={[styles.content, style]} {...rest} />;
}

/** Bottom area of a card — secondary info. */
export function CardFooter({ style, ...rest }: SlotProps) {
  return <View style={[styles.footer, style]} {...rest} />;
}

/** A right-aligned row of buttons/actions for the bottom of a card. */
export function CardActions({ style, ...rest }: SlotProps) {
  return <View style={[styles.actions, style]} {...rest} />;
}

const styles = StyleSheet.create({
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    marginTop: Spacing.md,
  },
  footer: {
    marginTop: Spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
});
