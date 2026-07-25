import { Feather } from '@expo/vector-icons';
import { memo, useEffect, useRef, type ReactNode } from 'react';
import { Animated, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { createThemedStyles, cardShadow, FontSize, Palette, Radius, Spacing, StaggerRowCap, StaggerRowDelay, Timing } from '@/theme';
import { FeatherIconName } from '../types';
import { DocumentsTone } from '../palette';

// Red-toned statuses ("Impayée", "En retard", "Refusé", "Action requise"…)
// carry real financial/urgency weight — they shouldn't have the same visual
// footprint as "Brouillon" or "Nouveau client". Detected from the color
// itself so every call site gets this automatically, no per-status flag to
// remember to pass.
const CRITICAL_TONES: string[] = [Palette.red, DocumentsTone.red.color];

/**
 * Shared building blocks for the whole Documents module (Factures, Devis,
 * Rapports, Contrats, Photos, Imports) — every list/detail screen imports
 * from here so cards, pills and section chrome stay pixel-identical across
 * sub-modules, matching the pattern already used by clients/detail/primitives.
 */

export { PressableScale } from '@/components/ui/PressableScale';

export const IconTile = memo(function IconTile({
  icon,
  color,
  soft,
  size = 33,
  iconSize = 15,
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

// DS rule: vivid accents are dot fills, not text — text on a wash must use
// the matching text-safe ink (see theme/palette.ts). Call sites keep passing
// the vivid value; the pill swaps in the ink for the label itself.
const TEXT_SAFE_INK: Record<string, string> = {
  [Palette.green]: Palette.greenInk,
  [Palette.orange]: Palette.orangeInk,
  [Palette.red]: Palette.redInk,
};

export const StatusPill = memo(function StatusPill({
  label,
  color,
  soft,
}: {
  label: string;
  color: string;
  soft: string;
}) {
  const critical = CRITICAL_TONES.includes(color);
  const ink = TEXT_SAFE_INK[color] ?? color;
  return (
    <View style={[styles.pill, { backgroundColor: soft }, critical && { borderWidth: 1, borderColor: color }]}>
      <View style={[styles.pillDot, { backgroundColor: color }]} />
      <Text style={[styles.pillText, { color: ink, fontWeight: critical ? '700' : '600' }]} numberOfLines={1}>
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

// Subtle staggered fade/rise used when a list first appears or a filter
// changes the visible rows — kept short (≈200ms) so it reads as premium
// polish rather than a loading delay.
export function FadeInItem({ index = 0, children }: { index?: number; children: ReactNode }) {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    enter.setValue(0);
    Animated.timing(enter, {
      toValue: 1,
      delay: Math.min(index, StaggerRowCap) * StaggerRowDelay,
      useNativeDriver: true,
      ...Timing.quick,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  return <Animated.View style={{ opacity: enter, transform: [{ translateY }] }}>{children}</Animated.View>;
}

const styles = createThemedStyles(() => StyleSheet.create({
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
    paddingVertical: 3,
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
}));
