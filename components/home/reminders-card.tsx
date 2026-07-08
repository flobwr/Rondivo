import { Feather, Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PressableScale } from '@/components/ui/PressableScale';
import { FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const TILE = 38;

export function RemindersCard({
  nextReminder,
  palette = Palette,
}: {
  nextReminder: string | null;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const router = useRouter();
  const styles = useMemo(() => createStyles(palette), [palette]);

  if (!nextReminder) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>Aucun rappel.</Text>
      </View>
    );
  }

  return (
    <PressableScale
      onPress={() => router.push('/rappels')}
      to={0.98}
      style={styles.card}
      accessibilityLabel="Rappels">
      <View style={styles.iconTile}>
        <Ionicons name="notifications" size={19} color={palette.purple} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.eyebrow}>RAPPELS</Text>
          <View style={styles.seeAll}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Feather name="chevron-right" size={13} color={palette.blue} />
          </View>
        </View>

        <Text style={styles.reminder} numberOfLines={1} ellipsizeMode="tail">
          {nextReminder}
        </Text>
      </View>
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
      paddingVertical: 13,
      paddingHorizontal: 18,
      ...cardShadow,
    },
    iconTile: {
      width: TILE,
      height: TILE,
      borderRadius: 12,
      backgroundColor: Palette.purpleSoft,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    content: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    eyebrow: {
      fontSize: FontSize.tiny,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: Palette.purple,
    },
    seeAll: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      opacity: 0.7,
    },
    seeAllText: {
      fontSize: 12,
      fontWeight: '500',
      color: Palette.blue,
    },
    reminder: {
      fontSize: FontSize.label,
      fontWeight: '500',
      color: Palette.textPrimary,
      marginTop: 4,
      letterSpacing: -0.1,
    },
    emptyCard: {
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      paddingVertical: 16,
      paddingHorizontal: 18,
      ...cardShadow,
    },
    emptyText: {
      fontSize: FontSize.label,
      fontWeight: '400',
      color: Palette.textTertiary,
      letterSpacing: -0.1,
    },
  });
}
