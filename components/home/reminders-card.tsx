import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const NEXT_REMINDER = 'Appeler M. Dupont à 14:00';

export function RemindersCard() {
  const router = useRouter();

  return (
    <Pressable style={styles.card} onPress={() => router.push('/rappels')}>
      <View style={styles.iconTile}>
        <Ionicons name="notifications" size={20} color={Palette.purple} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.eyebrow}>RAPPELS</Text>
          <View style={styles.seeAll}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Feather name="chevron-right" size={14} color={Palette.blue} />
          </View>
        </View>

        <Text style={styles.reminder} numberOfLines={1} ellipsizeMode="tail">
          {NEXT_REMINDER}
        </Text>
      </View>
    </Pressable>
  );
}

const TILE = 42;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 14,
    paddingHorizontal: 16,
    ...cardShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.tile,
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
  reminder: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginTop: 5,
  },
});
