import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useRef, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { TINT_COLORS, type FeatherIconName, type Tint } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

/**
 * Shared building blocks for the client detail screen. Keeping these here means
 * every section card shares the exact same radius, shadow, spacing and header
 * rhythm — no card ends up looking "heavier" than another.
 */

// A press wrapper that reuses the app-wide spring + haptic feel.
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

// Small rounded icon tile used in every card header + row.
export const TintIcon = memo(function TintIcon({
  icon,
  tint = 'blue',
  size = 38,
  iconSize = 18,
}: {
  icon: FeatherIconName;
  tint?: Tint;
  size?: number;
  iconSize?: number;
}) {
  const { color, soft } = TINT_COLORS[tint];
  return (
    <View
      style={[
        primitives.tile,
        { width: size, height: size, borderRadius: size <= 30 ? 10 : 12, backgroundColor: soft },
      ]}>
      <Feather name={icon} size={iconSize} color={color} />
    </View>
  );
});

// The one, canonical section card. Header (icon + title + optional trailing),
// body, and an optional "see all" footer link.
export function SectionCard({
  icon,
  iconTint = 'blue',
  title,
  trailing,
  footerLabel,
  onFooterPress,
  children,
  style,
}: {
  icon?: FeatherIconName;
  iconTint?: Tint;
  title?: string;
  trailing?: ReactNode;
  footerLabel?: string;
  onFooterPress?: () => void;
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[primitives.card, style]}>
      {title ? (
        <View style={primitives.header}>
          <View style={primitives.headerLeft}>
            {icon ? <TintIcon icon={icon} tint={iconTint} size={30} iconSize={15} /> : null}
            <Text style={primitives.title}>{title}</Text>
          </View>
          {trailing}
        </View>
      ) : null}

      {children}

      {footerLabel ? (
        <>
          <View style={primitives.footerSeparator} />
          <PressableScale
            onPress={onFooterPress}
            to={0.96}
            style={primitives.footer}
            accessibilityLabel={footerLabel}>
            <Text style={primitives.footerText}>{footerLabel}</Text>
            <Feather name="chevron-right" size={15} color={Palette.blue} />
          </PressableScale>
        </>
      ) : null}
    </View>
  );
}

export function CardSeparator() {
  return <View style={primitives.separator} />;
}

const primitives = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  footerSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginTop: Spacing.md,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingTop: Spacing.md,
    paddingBottom: 2,
  },
  footerText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
