import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import {
  ControlSize,
  FontWeight,
  IconSize,
  LetterSpacing,
  Opacity,
  Palette,
  Radius,
  Spacing,
} from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { PressScale } from '@/constants/motion';
import { AppText } from './app-text';
import { PressableScale, PressableScaleProps } from './pressable-scale';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';
type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppButtonProps = Omit<PressableScaleProps, 'children' | 'style'> & {
  label: string;
  /** Visual weight. `primary` = filled blue, `secondary` = soft, `ghost` = text. */
  variant?: Variant;
  size?: Size;
  /** Optional leading icon. */
  icon?: FeatherName;
  /** Optional trailing icon (e.g. chevron / plus). */
  trailingIcon?: FeatherName;
  /** Stretch to fill the parent width. */
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
};

const VARIANT: Record<Variant, { bg: string; fg: string; shadow: boolean }> = {
  primary: { bg: Palette.blue, fg: Palette.white, shadow: true },
  secondary: { bg: Palette.blueSoft, fg: Palette.blue, shadow: false },
  ghost: { bg: 'transparent', fg: Palette.blue, shadow: false },
  danger: { bg: Palette.notification, fg: Palette.white, shadow: true },
};

const SIZE: Record<Size, { height: number; padH: number; font: number; icon: number }> = {
  sm: { height: ControlSize.sm, padH: Spacing.md, font: 13, icon: IconSize.sm },
  md: { height: ControlSize.md, padH: Spacing.lg, font: 15, icon: IconSize.md },
  lg: { height: ControlSize.lg, padH: Spacing.xl, font: 16, icon: IconSize.lg },
};

/**
 * The single button primitive. Never create `QuoteButton`, `InvoiceButton`,
 * `ReminderButton` — reach for `<AppButton variant … icon … />`. See
 * COMPONENT_GUIDELINES.md § "Never fork a button".
 */
export function AppButton({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  trailingIcon,
  fullWidth = false,
  loading = false,
  disabled = false,
  ...rest
}: AppButtonProps) {
  const v = VARIANT[variant];
  const s = SIZE[size];
  const inactive = disabled || loading;

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      pressScale={PressScale.control}
      style={[
        styles.base,
        {
          height: s.height,
          paddingHorizontal: s.padH,
          backgroundColor: v.bg,
          opacity: inactive ? Opacity.disabled : Opacity.full,
        },
        fullWidth ? styles.fullWidth : null,
        v.shadow ? actionShadow : null,
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <View style={styles.row}>
          {icon ? <Feather name={icon} size={s.icon} color={v.fg} /> : null}
          <AppText
            style={[styles.label, { color: v.fg, fontSize: s.font }]}
            numberOfLines={1}>
            {label}
          </AppText>
          {trailingIcon ? <Feather name={trailingIcon} size={s.icon} color={v.fg} /> : null}
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.cozy,
  },
});
