import { Feather, Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const REMINDERS = ['Appeler M. Dupont à 14:00', 'Commander la pièce pour demain'];

export function RemindersCard() {
  return (
    <Pressable style={styles.card}>
      <View style={styles.iconTile}>
        <Ionicons name="notifications" size={22} color={Palette.purple} />
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>RAPPELS</Text>
        <Text style={styles.title}>2 rappels aujourd&rsquo;hui</Text>
        {REMINDERS.map((reminder) => (
          <View key={reminder} style={styles.bulletRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{reminder}</Text>
          </View>
        ))}
      </View>

      <Feather name="chevron-right" size={22} color={Palette.textTertiary} />
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
    paddingVertical: Spacing.cardPadding + 2,
    paddingHorizontal: Spacing.cardPadding,
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
  eyebrow: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    letterSpacing: 1,
    color: Palette.purple,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 6,
    marginBottom: 10,
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: 7,
  },
  bullet: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
    marginRight: 7,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: FontSize.label,
    color: Palette.textSecondary,
    lineHeight: 22,
  },
});
