import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { type NextAppointment } from '@/data/client-details';
import { PressableScale, TintIcon } from './primitives';

type Props = {
  appointment: NextAppointment;
  onOpen: () => void;
};

// Slim single-line-per-row summary of the next visit. No big CTA — just a small
// discreet chevron button on the right, so the card breathes.
export function NextAppointmentCard({ appointment, onOpen }: Props) {
  if (!appointment) return null;

  const shortDate = appointment.dateLabel.replace(/^\w+\s/, ''); // drop weekday word

  return (
    <PressableScale onPress={onOpen} to={0.98} style={styles.card} accessibilityLabel="Ouvrir le rendez-vous dans le planning">
      <TintIcon icon="calendar" tint="blue" size={38} />

      <View style={styles.texts}>
        <Text style={styles.eyebrow}>PROCHAIN RENDEZ-VOUS</Text>
        <Text style={styles.title} numberOfLines={1}>
          {appointment.title}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {shortDate} · {appointment.time} · {appointment.travelMinutes} min · {appointment.distanceKm} km
        </Text>
      </View>

      <View style={styles.chevron}>
        <Feather name="chevron-right" size={18} color={Palette.blue} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  texts: {
    flex: 1,
  },
  eyebrow: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    color: Palette.blue,
  },
  title: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 2,
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  chevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
