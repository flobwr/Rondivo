import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { Palette, Radius, Spacing, getStatusInk, type PaletteShape } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export type Appointment = {
  id: string;
  time: string;
  client: string;
  type: string;
  address: string;
  status?: string;
};

type AppointmentCardProps = {
  appointment: Appointment;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
};

/** Maps the free-form status label to a tone — greens for confirmed/done,
 *  neutral grey for cancelled/postponed outcomes, blue for everything else. */
function statusTone(status: string, palette: PaletteShape): { ink: string; soft: string } {
  const statusInk = getStatusInk(palette);
  const normalized = status.toLowerCase();
  if (normalized.startsWith('confirm') || normalized.startsWith('termin')) {
    return { ink: statusInk.green, soft: palette.greenSoft };
  }
  if (normalized.startsWith('annul') || normalized.startsWith('report')) {
    return { ink: palette.textSecondary, soft: palette.iconButtonBg };
  }
  return { ink: statusInk.blue, soft: palette.blueSoft };
}

export function AppointmentCard({ appointment, palette = Palette }: AppointmentCardProps) {
  const router = useRouter();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const tone = appointment.status ? statusTone(appointment.status, palette) : null;

  return (
    <PressableScale
      to={0.98}
      onPress={() => router.push({ pathname: '/intervention/[id]', params: { id: appointment.id } })}
      accessibilityLabel={`${appointment.time}, ${appointment.client}, ${appointment.type}`}
      style={styles.card}>
      <View style={styles.timeColumn}>
        <Text style={styles.time}>{appointment.time}</Text>
        <View style={styles.dot} />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.client} numberOfLines={1}>
            {appointment.client}
          </Text>
          {appointment.status && tone ? (
            <View style={[styles.statusPill, { backgroundColor: tone.soft }]}>
              <Text style={[styles.statusText, { color: tone.ink }]} numberOfLines={1}>
                {appointment.status}
              </Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.type} numberOfLines={1} ellipsizeMode="tail">
          {appointment.type}
        </Text>

        <View style={styles.addressRow}>
          <Feather name="map-pin" size={11} color={palette.textTertiary} />
          <Text style={styles.address} numberOfLines={1} ellipsizeMode="tail">
            {appointment.address}
          </Text>
        </View>
      </View>
    </PressableScale>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      paddingVertical: 14,
      paddingHorizontal: 16,
      ...cardShadow,
    },
    timeColumn: {
      alignItems: 'center',
      width: 44,
      paddingTop: 1,
    },
    time: {
      fontSize: 15.5,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.3,
      fontVariant: ['tabular-nums'],
    },
    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      backgroundColor: Palette.blue,
      marginTop: 8,
      opacity: 0.8,
    },
    info: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    client: {
      flex: 1,
      fontSize: 16.5,
      fontWeight: '700',
      color: Palette.textPrimary,
      letterSpacing: -0.3,
    },
    type: {
      fontSize: 13.5,
      fontWeight: '500',
      color: Palette.textSecondary,
      marginTop: 3,
      letterSpacing: -0.1,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
      gap: 5,
    },
    address: {
      flex: 1,
      fontSize: 12.5,
      fontWeight: '400',
      color: Palette.textTertiary,
      letterSpacing: 0,
    },
    statusPill: {
      borderRadius: Radius.pill,
      paddingHorizontal: 9,
      paddingVertical: 3,
      flexShrink: 0,
    },
    statusText: {
      fontSize: 11.5,
      fontWeight: '700',
      letterSpacing: -0.1,
    },
  });
}
