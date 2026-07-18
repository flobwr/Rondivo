import { Feather, Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PressableScale } from '@/components/ui/PressableScale';
import { cardShadow, FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/theme';

const TILE = 38;

export function RemindersCard({
  nextReminder,
  count = 0,
  palette = Palette,
}: {
  nextReminder: string | null;
  /** Total pending reminders — shown as a small counter next to the eyebrow. */
  count?: number;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const router = useRouter();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const isEmpty = !nextReminder;

  return (
    <PressableScale
      onPress={() => router.push('/rappels')}
      to={0.98}
      style={styles.card}
      accessibilityLabel={isEmpty ? 'Rappels, aucun rappel' : `Rappels, ${count} en attente`}>
      <View style={[styles.iconTile, isEmpty ? styles.iconTileEmpty : null]}>
        <Ionicons
          name={isEmpty ? 'notifications-outline' : 'notifications'}
          size={19}
          color={isEmpty ? palette.textTertiary : palette.blue}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Rappels</Text>
          {count > 1 ? (
            <View style={styles.countPill}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.reminder, isEmpty ? styles.reminderEmpty : null]} numberOfLines={1} ellipsizeMode="tail">
          {nextReminder ?? 'Aucun rappel en attente'}
        </Text>
      </View>

      <Feather name="chevron-right" size={18} color={palette.textTertiary} style={styles.chevron} />
    </PressableScale>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: Palette.border,
      paddingVertical: 14,
      paddingHorizontal: 16,
      ...cardShadow,
    },
    iconTile: {
      width: TILE,
      height: TILE,
      borderRadius: 12,
      backgroundColor: Palette.blueSoft,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    iconTileEmpty: {
      backgroundColor: Palette.iconButtonBg,
    },
    content: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    title: {
      fontSize: FontSize.cardLabel,
      fontWeight: '600',
      color: Palette.textPrimary,
      letterSpacing: -0.2,
    },
    countPill: {
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: Palette.blueSoft,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 5,
    },
    countText: {
      fontSize: 11,
      fontWeight: '700',
      color: Palette.blue,
      fontVariant: ['tabular-nums'],
    },
    reminder: {
      fontSize: FontSize.label,
      fontWeight: '500',
      color: Palette.textPrimary,
      marginTop: 3,
      letterSpacing: -0.1,
    },
    reminderEmpty: {
      fontWeight: '400',
      color: Palette.textTertiary,
    },
    chevron: {
      marginLeft: Spacing.sm,
      opacity: 0.7,
    },
  });
}
