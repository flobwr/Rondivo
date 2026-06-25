import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

// Only the most urgent item is surfaced on the Home; everything else lives in
// the dedicated "Rappels" page reachable through the "Voir tout" affordance.
const REMINDER_COUNT = 2;
const NEXT_REMINDER = 'Appeler M. Dupont à 14:00';

export function RemindersCard() {
  const router = useRouter();

  return (
    <Pressable style={styles.card} onPress={() => router.push('/rappels')}>
      <View style={styles.iconTile}>
        <Ionicons name="notifications" size={22} color={Palette.purple} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.eyebrow}>RAPPELS</Text>
          {REMINDER_COUNT > 1 ? (
            <View style={styles.seeAll}>
              <Text style={styles.seeAllText}>Voir tout</Text>
              <Feather name="chevron-right" size={15} color={Palette.blue} />
            </View>
          ) : null}
        </View>

        <Text style={styles.title}>{REMINDER_COUNT} rappels aujourd&rsquo;hui</Text>

        <View style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText} numberOfLines={1} ellipsizeMode="tail">
            {NEXT_REMINDER}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const TILE = 48;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.tile,
    backgroundColor: Palette.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: Spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    letterSpacing: 1,
    color: Palette.purple,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    marginRight: 2,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  bullet: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
    marginRight: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.label,
    color: Palette.textSecondary,
  },
});
