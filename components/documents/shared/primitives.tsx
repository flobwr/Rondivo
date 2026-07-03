import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useRef, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { FeatherIconName } from '../types';

/**
 * Shared building blocks for the whole Documents module (Factures, Devis,
 * Rapports, Contrats, Photos, Imports) — every list/detail screen imports
 * from here so cards, pills and section chrome stay pixel-identical across
 * sub-modules, matching the pattern already used by clients/detail/primitives.
 */

export function PressableScale({
  children,
  onPress,
  style,
  disabled,
  to = 0.97,
  accessibilityLabel,
  haptic = true,
}: {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  to?: number;
  accessibilityLabel?: string;
  haptic?: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: to, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || !onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

export const IconTile = memo(function IconTile({
  icon,
  color,
  soft,
  size = 38,
  iconSize = 17,
  radius,
}: {
  icon: FeatherIconName;
  color: string;
  soft: string;
  size?: number;
  iconSize?: number;
  radius?: number;
}) {
  return (
    <View
      style={[
        styles.iconTile,
        { width: size, height: size, borderRadius: radius ?? (size <= 32 ? 10 : 13), backgroundColor: soft },
      ]}>
      <Feather name={icon} size={iconSize} color={color} />
    </View>
  );
});

export const StatusPill = memo(function StatusPill({
  label,
  color,
  soft,
}: {
  label: string;
  color: string;
  soft: string;
}) {
  return (
    <View style={[styles.pill, { backgroundColor: soft }]}>
      <View style={[styles.pillDot, { backgroundColor: color }]} />
      <Text style={[styles.pillText, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
});

// The one canonical section card for detail screens across the module —
// header (icon + title + optional trailing) then body.
export function SectionCard({
  icon,
  iconColor = Palette.blue,
  iconSoft = Palette.blueSoft,
  title,
  trailing,
  children,
  style,
}: {
  icon?: FeatherIconName;
  iconColor?: string;
  iconSoft?: string;
  title?: string;
  trailing?: ReactNode;
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.card, style]}>
      {title ? (
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {icon ? <IconTile icon={icon} color={iconColor} soft={iconSoft} size={30} iconSize={15} /> : null}
            <Text style={styles.title}>{title}</Text>
          </View>
          {trailing}
        </View>
      ) : null}
      {children}
    </View>
  );
}

// A single label/value row — the building block of "Informations" cards.
export function KeyValueRow({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <View style={styles.kvRow}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={[styles.kvValue, valueColor ? { color: valueColor } : null]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export function CardSeparator() {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  iconTile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  pillDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: FontSize.cardLabel + 1,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  kvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
  },
  kvLabel: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  kvValue: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: Spacing.md,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
});
