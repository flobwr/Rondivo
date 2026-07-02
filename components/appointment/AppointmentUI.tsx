import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef, type ReactNode } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { type FeatherIconName } from '@/components/clients/types';
import { FontSize, Palette, Radius } from '@/constants/design';

export function PressableScale({
  children,
  onPress,
  style,
  to = 0.96,
  haptic = true,
  disabled,
  accessibilityLabel,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  to?: number;
  haptic?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: to, useNativeDriver: true, friction: 6, tension: 320 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };
  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} disabled={disabled || !onPress} accessibilityRole={onPress ? 'button' : undefined} accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

// A labelled section — the vertical rhythm of the whole screen.
export function Field({ label, trailing, children }: { label: string; trailing?: ReactNode; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {trailing}
      </View>
      {children}
    </View>
  );
}

export type ChipTone = 'busy' | 'short';

// Both disabled tones share the same quiet grey fill — a slot that can't be
// booked should recede, never compete with the available ones. "short" adds a
// small discreet orange badge instead of orange-tinted text, so it reads as
// "almost, but not quite" rather than as an alert.
const TONE_STYLE: Record<ChipTone, { background: string; border: string; text: string }> = {
  busy: { background: Palette.border, border: Palette.border, text: Palette.textTertiary },
  short: { background: Palette.border, border: Palette.border, text: Palette.textSecondary },
};

// The one canonical selectable pill used by every strip (date, time, duration,
// priority…). Active = solid accent; inactive = white with a hairline border;
// disabled (busy/short) = flat tone fill, no press feedback, no onPress.
export function Chip({
  label,
  sublabel,
  active,
  onPress,
  accent = Palette.blue,
  dotColor,
  icon,
  minWidth,
  disabled,
  tone,
}: {
  label: string;
  sublabel?: string;
  active: boolean;
  onPress?: () => void;
  accent?: string;
  dotColor?: string;
  icon?: FeatherIconName;
  minWidth?: number;
  disabled?: boolean;
  tone?: ChipTone;
}) {
  const toneStyle = tone ? TONE_STYLE[tone] : null;

  if (disabled) {
    return (
      <View
        style={[
          styles.chip,
          minWidth ? { minWidth } : null,
          { backgroundColor: toneStyle?.background ?? styles.chipInactive.backgroundColor, borderColor: toneStyle?.border ?? styles.chipInactive.borderColor },
        ]}
        accessibilityLabel={sublabel ? `${label}, ${sublabel}` : label}>
        <View style={styles.disabledContent}>
          <Text style={[styles.chipLabel, { color: toneStyle?.text ?? Palette.textTertiary }]} numberOfLines={1}>
            {label}
          </Text>
          {sublabel && tone === 'short' ? (
            <View style={styles.shortBadge}>
              <Text style={styles.shortBadgeText} numberOfLines={1}>
                {sublabel}
              </Text>
            </View>
          ) : sublabel ? (
            <Text style={[styles.chipSub, { color: toneStyle?.text ?? Palette.textTertiary }]} numberOfLines={1}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <PressableScale onPress={onPress} to={0.93} style={undefined} accessibilityLabel={label}>
      <View
        style={[
          styles.chip,
          minWidth ? { minWidth } : null,
          active ? { backgroundColor: accent, borderColor: accent } : styles.chipInactive,
        ]}>
        {dotColor ? <View style={[styles.dot, { backgroundColor: active ? Palette.white : dotColor }]} /> : null}
        {icon ? <Feather name={icon} size={14} color={active ? Palette.white : Palette.textSecondary} /> : null}
        <View>
          <Text style={[styles.chipLabel, { color: active ? Palette.white : Palette.textPrimary }]} numberOfLines={1}>
            {label}
          </Text>
          {sublabel ? (
            <Text style={[styles.chipSub, { color: active ? Palette.white : Palette.textTertiary }]} numberOfLines={1}>
              {sublabel}
            </Text>
          ) : null}
        </View>
      </View>
    </PressableScale>
  );
}

export function ChipScroll({ children }: { children: ReactNode }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipRow}
      keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  field: {
    marginTop: 17,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  label: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
  },
  chipRow: {
    gap: 7,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  chipInactive: {
    backgroundColor: Palette.card,
    borderColor: Palette.border,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  chipLabel: {
    fontSize: FontSize.small,
    fontWeight: '600',
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  chipSub: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
    textAlign: 'center',
  },
  disabledContent: {
    alignItems: 'center',
  },
  shortBadge: {
    marginTop: 3,
    backgroundColor: Palette.orangeSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  shortBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: Palette.orange,
    letterSpacing: -0.1,
  },
});
