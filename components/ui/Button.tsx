import { Feather } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { type IconName } from '@/components/ui/IconWell';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { getElevation, Radius, Size } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

/**
 * Rondivo button — one shape (capsule), four voices.
 *
 *  · `primary`   — Bleu Rondivo. THE action of the screen; at most one visible.
 *  · `secondary` — off-white sheet with a hairline edge; everything else.
 *  · `ghost`     — bare blue text; inline and footer actions.
 *  · `danger`    — a sheet inked in the muted danger red; routine
 *                  destructive actions (logout, delete) that must not
 *                  shout like a real error state.
 *
 * Height 52 (compact 40), always full capsule, label never wraps. Loading
 * swaps the label for a spinner without letting the button change size.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  compact = false,
  icon,
  disabled = false,
  loading = false,
  fullWidth = true,
}: {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  compact?: boolean;
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}) {
  const { palette, scheme } = useTheme();
  const elevation = getElevation(scheme);

  const surface = {
    primary: { backgroundColor: palette.blue },
    secondary: {
      backgroundColor: palette.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
    },
    ghost: { backgroundColor: 'transparent' },
    danger: {
      backgroundColor: palette.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: palette.border,
    },
  }[variant];

  const ink = {
    primary: palette.onAccent,
    secondary: palette.textPrimary,
    ghost: palette.blue,
    danger: palette.danger,
  }[variant];

  const shadow = variant === 'primary' ? elevation.whisper : undefined;

  return (
    <PressableScale
      onPress={disabled || loading ? undefined : onPress}
      to={0.97}
      accessibilityLabel={label}
      style={[
        styles.base,
        shadow,
        surface,
        {
          height: compact ? Size.buttonHeightCompact : Size.buttonHeight,
          paddingHorizontal: compact ? 18 : 24,
          alignSelf: fullWidth ? 'stretch' : 'center',
          opacity: disabled ? 0.4 : 1,
        },
      ]}>
      {loading ? (
        <ActivityIndicator color={ink} />
      ) : (
        <View style={styles.content}>
          {icon ? <Feather name={icon} size={compact ? 16 : 18} color={ink} /> : null}
          <Text
            numberOfLines={1}
            style={[styles.label, { color: ink, fontSize: compact ? 14 : 16 }]}>
            {label}
          </Text>
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
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontWeight: '600',
    letterSpacing: -0.25,
  },
});
