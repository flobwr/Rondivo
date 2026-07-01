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

// Slim single-card summary of the next visit. Everything on three tight lines
// plus one "Ouvrir" button — no travel-departure block, no big padding.
export function NextAppointmentCard({ appointment, onOpen }: Props) {
  if (!appointment) return null;

  const shortDate = appointment.dateLabel.replace(/^\w+\s/, ''); // drop weekday word

  return (
    <View style={styles.card}>
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

      <PressableScale onPress={onOpen} to={0.94} style={styles.button} accessibilityLabel="Ouvrir dans le planning">
        <Text style={styles.buttonText}>Ouvrir</Text>
        <Feather name="chevron-right" size={14} color={Palette.blue} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 14,
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
    marginTop: 3,
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 3,
    letterSpacing: -0.1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 10,
  },
  buttonText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
