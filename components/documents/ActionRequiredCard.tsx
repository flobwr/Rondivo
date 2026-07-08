import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { DocumentsTone } from './palette';
import { ActionItem } from './types';

const TILE = 28;

function ActionRow({
  item,
  onPress,
  styles,
  palette,
}: {
  item: ActionItem;
  onPress?: () => void;
  styles: ReturnType<typeof createStyles>;
  palette: PaletteShape;
}) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const tone = DocumentsTone[item.tone];

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.985, useNativeDriver: true, friction: 7, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.row, { transform: [{ scale: pressScale }] }]}>
        <View style={[styles.iconTile, { backgroundColor: tone.soft }]}>
          <Feather name={item.icon} size={14} color={tone.color} />
        </View>
        <Text style={styles.rowText} numberOfLines={3} ellipsizeMode="tail">
          {item.text}
        </Text>
        <Feather name="chevron-right" size={17} color={palette.textTertiary} />
      </Animated.View>
    </Pressable>
  );
}

export function ActionRequiredCard({
  items,
  onItemPress,
  palette = Palette,
}: {
  items: ActionItem[];
  onItemPress?: (item: ActionItem) => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const styles = useMemo(() => createStyles(palette), [palette]);

  if (items.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyRow}>
          <View style={[styles.iconTile, { backgroundColor: palette.greenSoft }]}>
            <Feather name="check" size={15} color={palette.green} />
          </View>
          <Text style={styles.emptyText}>Tout est à jour.</Text>
        </View>
      </View>
    );
  }

  const subtitle = items.length === 1 ? '1 action aujourd’hui' : `${items.length} actions aujourd’hui`;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>À traiter</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.rows}>
        {items.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <ActionRow item={item} onPress={() => onItemPress?.(item)} styles={styles} palette={palette} />
          </View>
        ))}
      </View>
    </View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      paddingTop: 16,
      paddingBottom: 5,
      paddingHorizontal: Spacing.lg,
      ...cardShadow,
    },
    header: {
      paddingBottom: 14,
    },
    headerTitle: {
      fontSize: FontSize.section,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.4,
    },
    headerSubtitle: {
      fontSize: FontSize.small,
      fontWeight: '500',
      color: Palette.textTertiary,
      letterSpacing: -0.1,
      marginTop: 2,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Palette.border,
      marginHorizontal: -Spacing.lg,
    },
    rows: {
      paddingTop: 2,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 10,
      gap: Spacing.md,
    },
    iconTile: {
      width: TILE,
      height: TILE,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    rowText: {
      flex: 1,
      fontSize: FontSize.body,
      fontWeight: '600',
      color: Palette.textPrimary,
      letterSpacing: -0.2,
    },
    separator: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: Palette.border,
    },
    emptyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      gap: Spacing.md,
    },
    emptyText: {
      fontSize: FontSize.body,
      fontWeight: '500',
      color: Palette.textSecondary,
      letterSpacing: -0.1,
    },
  });
}
