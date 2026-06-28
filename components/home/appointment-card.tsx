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
        <Text style={styles.client} numberOfLines={1}>
          Martin Dupont
        </Text>
        <Text style={styles.type} numberOfLines={1} ellipsizeMode="tail">
          Entretien chaudière
        </Text>
        <View style={styles.addressRow}>
          <Feather name="map" size={12} color={Palette.textTertiary} style={styles.mapIcon} />
          <Text style={styles.address} numberOfLines={2} ellipsizeMode="tail">
            15 rue des Lilas, 69006 Lyon
          </Text>
        </View>
      </View>

      <View style={styles.statusPill}>
        <Text style={styles.statusText} numberOfLines={1}>
          Prochain
        </Text>
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
    paddingVertical: 16,
    paddingHorizontal: 18,
    ...cardShadow,
  },
  timeColumn: {
    alignItems: 'center',
    width: 42,
  },
  time: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.blue,
    marginTop: 10,
    opacity: 0.85,
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  client: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  type: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textSecondary,
    marginTop: 3,
    letterSpacing: -0.1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
    gap: 5,
  },
  mapIcon: {
    marginTop: 1,
    opacity: 0.7,
  },
  address: {
    flex: 1,
    fontSize: 11,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: 0,
  },
  statusPill: {
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 3,
    marginLeft: Spacing.sm,
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.blue,
    letterSpacing: 0,
  },
});
