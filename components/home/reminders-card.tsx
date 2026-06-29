import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

// null = aucun rappel actif
const NEXT_REMINDER: string | null = 'Créer la facture de M. Dupont.';

const TILE = 38;

export function RemindersCard() {
  const router = useRouter();

  if (!NEXT_REMINDER) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>Aucun rappel.</Text>
      </View>
    );
  }

  return (
    <Pressable style={styles.card} onPress={() => router.push('/rappels')}>
      <View style={styles.iconTile}>
        <Ionicons name="notifications" size={19} color={Palette.purple} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.eyebrow}>RAPPELS</Text>
          <View style={styles.seeAll}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Feather name="chevron-right" size={13} color={Palette.blue} />
          </View>
        </View>

        <Text style={styles.reminder} numberOfLines={1} ellipsizeMode="tail">
          {NEXT_REMINDER}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
