import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { type NextAppointment } from '@/data/client-details';
import { PressableScale, TintIcon } from './primitives';

type Props = {
  appointment: NextAppointment;
  onOpenPlanning: () => void;
};

function MetaRow({ icon, label }: { icon: React.ComponentProps<typeof Feather>['name']; label: string }) {
  return (
    <View style={styles.metaRow}>
      <Feather name={icon} size={14} color={Palette.textTertiary} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  );
}

export function NextAppointmentCard({ appointment, onOpenPlanning }: Props) {
  if (!appointment) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <TintIcon icon="calendar" tint="blue" size={38} />
          <View style={styles.headerTexts}>
            <Text style={styles.eyebrow}>PROCHAIN RENDEZ-VOUS</Text>
            <Text style={styles.empty}>Aucun rendez-vous planifié</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <TintIcon icon="calendar" tint="blue" size={38} />
        <View style={styles.headerTexts}>
          <Text style={styles.eyebrow}>PROCHAIN RENDEZ-VOUS</Text>
          <Text style={styles.title} numberOfLines={1}>
            {appointment.title}
          </Text>
        </View>
      </View>

      <Text style={styles.date}>
        {appointment.dateLabel} à {appointment.time}
      </Text>

      <View style={styles.metaGrid}>
        <MetaRow
          icon="navigation"
          label={`${appointment.travelMinutes} min (${appointment.distanceKm} km)`}
        />
        <MetaRow icon="clock" label={`Départ conseillé : ${appointment.recommendedDeparture}`} />
      </View>

      <PressableScale onPress={onOpenPlanning} to={0.97} style={styles.button} accessibilityLabel="Ouvrir dans le planning">
        <Feather name="calendar" size={16} color={Palette.blue} />
        <Text style={styles.buttonText}>Ouvrir dans le planning</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTexts: {
    flex: 1,
  },
  eyebrow: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Palette.blue,
  },
  title: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: 3,
    letterSpacing: -0.2,
  },
  empty: {
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 3,
  },
  date: {
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 14,
    letterSpacing: -0.1,
  },
  metaGrid: {
    marginTop: 12,
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.tile,
    paddingVertical: 13,
    marginTop: Spacing.lg,
  },
  buttonText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.2,
  },
});
