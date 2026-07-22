import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { ControlColor, ControlSize, IconSize, Opacity, Palette, Radius } from '@/constants/design';
import { iconButtonShadow } from '@/constants/shadow';
import { PressScale } from '@/constants/motion';
import { AppText } from './app-text';
import { PressableScale, PressableScaleProps } from './pressable-scale';

type Variant = 'plain' | 'soft' | 'filled' | 'bordered';
type Size = 'sm' | 'md' | 'lg';
type Shape = 'circle' | 'rounded';
type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppIconButtonProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  icon: FeatherName;
  variant?: Variant;
  size?: Size;
  shape?: Shape;
  /** Icon + fill tint. Defaults to primary text colour. */
  color?: string;
  /** Background for `soft`/`filled` variants. Defaults from `color`. */
  background?: string;
  /** Small count badge in the top-right corner (e.g. unread notifications). */
  badgeCount?: number;
  accessibilityLabel: string;
};

const SIZE: Record<Size, { box: number; icon: number }> = {
  sm: { box: ControlSize.sm, icon: IconSize.md },
  md: { box: ControlSize.md, icon: IconSize.lg },
  lg: { box: ControlSize.lg, icon: IconSize.xl },
};

/**
 * Circular / rounded icon-only button. Replaces the many hand-rolled round
 * buttons (header bell/settings, back button, planning "+", GPS, travel nav…).
 */
export function AppIconButton({
  icon,
  variant = 'plain',
  size = 'md',
  shape = 'circle',
  color = Palette.textPrimary,
  background,
  badgeCount,
  ...rest
}: AppIconButtonProps) {
  const s = SIZE[size];
  const bg =
    variant === 'filled'
      ? color
      : variant === 'soft'
        ? (background ?? Palette.blueSoft)
        : variant === 'bordered'
          ? Palette.card
          : ControlColor.neutralBg;
  const iconColor = variant === 'filled' ? Palette.white : color;

  return (
    <PressableScale
      accessibilityRole="button"
      pressScale={PressScale.icon}
      style={[
        styles.base,
        {
          width: s.box,
          height: s.box,
          borderRadius: shape === 'circle' ? s.box / 2 : Radius.tile,
          backgroundColor: variant === 'plain' && background ? background : bg,
        },
        variant === 'bordered' ? styles.bordered : null,
        variant === 'plain' || variant === 'bordered' ? iconButtonShadow : null,
      ]}
      {...rest}>
      <Feather name={icon} size={s.icon} color={iconColor} />
      {badgeCount ? (
        <View style={styles.badge}>
          <AppText style={styles.badgeText}>{badgeCount}</AppText>
        </View>
      ) : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: Palette.notification,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Palette.screen,
  },
  badgeText: {
    color: Palette.white,
    fontSize: 9,
    fontWeight: '700',
    opacity: Opacity.full,
  },
});
