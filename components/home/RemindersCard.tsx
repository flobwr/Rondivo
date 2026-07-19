import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import { getElevation, Numeric, Radius, Type, type PaletteShape } from '@/theme';

const WELL = 40;

/**
 * Reminders, at a glance — one quiet sheet: a bell in a pressed well, the
 * next reminder as the headline, and a monochrome ink pill for the count.
 * No colour: reminders inform, they don't alarm.
 */
export function RemindersCard({
  nextReminder,
  count = 0,
}: {
  nextReminder: string | null;
  /** Total pending reminders — shown as the ink counter pill. */
  count?: number;
}) {
  const router = useRouter();
  const { palette, scheme, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette, scheme), [palette, scheme]);
  const elevation = getElevation(resolvedTheme);

  const isEmpty = !nextReminder;

  return (
    <PressableScale
      to={0.98}
      style={[styles.card, elevation.card]}
      onPress={() => router.push('/rappels')}
      accessibilityLabel={isEmpty ? 'Rappels, aucun rappel' : `Rappels, ${count} en attente`}>
      <View style={[styles.well, elevation.whisper]}>
        <Feather name="bell" size={17} color={isEmpty ? palette.textTertiary : palette.textPrimary} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.eyebrow}>RAPPELS</Text>
          {count > 0 ? (
            <View style={styles.countPill}>
              <Text style={[styles.countText, Numeric]}>{count}</Text>
            </View>
          ) : null}
        </View>
        <Text style={[styles.headline, isEmpty && styles.headlineEmpty]} numberOfLines={1}>
          {nextReminder ?? 'Aucun rappel en attente'}
        </Text>
      </View>

      <Feather name="chevron-right" size={18} color={palette.textTertiary} />
    </PressableScale>
  );
}

function createStyles(palette: PaletteShape, scheme: 'light' | 'dark') {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: palette.card,
      borderRadius: Radius.card,
      paddingVertical: 16,
      paddingHorizontal: 18,
      ...(scheme === 'dark'
        ? { borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border }
        : null),
    },
    well: {
      width: WELL,
      height: WELL,
      // A full disc — the same shape as every other icon well in the DS
      // (HomeHeader's bell, QuickActionsRow's discs), not a one-off squircle.
      borderRadius: Radius.pill,
      backgroundColor: palette.inset,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7,
    },
    eyebrow: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.1,
      color: palette.textTertiary,
    },
    countPill: {
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      paddingHorizontal: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: palette.textPrimary,
    },
    countText: {
      fontSize: 11,
      fontWeight: '700',
      color: palette.screen,
    },
    headline: {
      ...Type.subhead,
      fontWeight: '600',
      color: palette.textPrimary,
      marginTop: 3,
    },
    headlineEmpty: {
      fontWeight: '400',
      color: palette.textTertiary,
    },
  });
}
