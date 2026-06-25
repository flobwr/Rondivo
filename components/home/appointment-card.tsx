import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export function AppointmentCard() {
  return (
    <Pressable style={styles.card}>
      <View style={styles.timeColumn}>
        <Text style={styles.time}>10:30</Text>
        <View style={styles.dot} />
      </View>

      <View style={styles.info}>
        <Text style={styles.client}>Martin Dupont</Text>
        <Text style={styles.type}>Entretien chaudière</Text>
        <View style={styles.addressRow}>
          <Feather name="map" size={14} color={Palette.textTertiary} />
          <Text style={styles.address}>15 rue des Lilas, 69006 Lyon</Text>
        </View>
      </View>

      <View style={styles.statusPill}>
        <Text style={styles.statusText}>En route</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  timeColumn: {
    alignItems: 'center',
    width: 52,
  },
  time: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.blue,
    marginTop: 12,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  client: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  type: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
    marginTop: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  address: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
  },
  statusPill: {
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginLeft: Spacing.md,
    alignSelf: 'center',
  },
  statusText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.blue,
  },
});
