import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { compactAddress } from '@/components/home/format';
import { Appointment } from '@/components/home/types';
import { PressableScale } from '@/components/ui/PressableScale';
import { useTheme } from '@/contexts/theme';
import {
  getElevation,
  getStatusInk,
  Numeric,
  Radius,
  Spacing,
  Type,
  type PaletteShape,
} from '@/theme';

/** Maps the free-form status label to an ink — green for confirmed/done,
 *  neutral for cancelled/postponed outcomes, blue for everything else. */
function statusTone(status: string, palette: PaletteShape): { ink: string; dot: string } {
  const statusInk = getStatusInk(palette);
  const normalized = status.toLowerCase();
  if (normalized.startsWith('confirm') || normalized.startsWith('termin')) {
    return { ink: statusInk.green, dot: palette.green };
  }
  if (normalized.startsWith('annul') || normalized.startsWith('report')) {
    return { ink: palette.textSecondary, dot: palette.textTertiary };
  }
  return { ink: statusInk.blue, dot: palette.blue };
}

/**
 * One remaining stop of the day. The hour sits in a pressed time chip —
 * the schedule reads down the left edge like a timetable — and the status
 * is a dot + ink word, never a loud pill.
 */
export function ScheduleCard({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const { palette, scheme, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette, scheme), [palette, scheme]);
  const elevation = getElevation(resolvedTheme);
  const tone = appointment.status ? statusTone(appointment.status, palette) : null;

  return (
    <PressableScale
      to={0.98}
      style={[styles.card, elevation.card]}
      onPress={() => router.push({ pathname: '/intervention/[id]', params: { id: appointment.id } })}
      accessibilityLabel={`${appointment.time}, ${appointment.client}, ${appointment.type}`}>
      <View style={styles.timeChip}>
        <Text style={[styles.time, Numeric]}>{appointment.time}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.client} numberOfLines={1}>
          {appointment.client}
        </Text>
        <Text style={styles.type} numberOfLines={1}>
          {appointment.type}
        </Text>
        <View style={styles.addressRow}>
          <Feather name="map-pin" size={11} color={palette.textTertiary} />
          <Text style={styles.address} numberOfLines={1}>
            {compactAddress(appointment.address)}
          </Text>
        </View>
      </View>

      {appointment.status && tone ? (
        <View style={styles.status}>
          <View style={[styles.statusDot, { backgroundColor: tone.dot }]} />
          <Text style={[styles.statusText, { color: tone.ink }]} numberOfLines={1}>
            {appointment.status}
          </Text>
        </View>
      ) : null}
    </PressableScale>
  );
}

function createStyles(palette: PaletteShape, scheme: 'light' | 'dark') {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
      backgroundColor: palette.card,
      borderRadius: Radius.card,
      paddingVertical: 14,
      paddingHorizontal: 14,
      ...(scheme === 'dark'
        ? { borderWidth: StyleSheet.hairlineWidth, borderColor: palette.border }
        : null),
    },
    // The same chip Planning's intervention cards carry — one object, one
    // token, so the two schedules read as the same list.
    timeChip: {
      backgroundColor: palette.inset,
      borderRadius: Radius.control,
      paddingHorizontal: Spacing.sm,
      paddingVertical: 5,
    },
    time: {
      fontSize: 14,
      fontWeight: '700',
      letterSpacing: -0.2,
      color: palette.textPrimary,
    },
    info: {
      flex: 1,
      paddingTop: 1,
    },
    client: {
      ...Type.bodyStrong,
      fontWeight: '700',
      color: palette.textPrimary,
    },
    type: {
      ...Type.footnote,
      fontWeight: '500',
      color: palette.textSecondary,
      marginTop: 2,
    },
    addressRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      marginTop: 5,
    },
    address: {
      flex: 1,
      fontSize: 12.5,
      lineHeight: 16,
      color: palette.textTertiary,
    },
    status: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingTop: 3,
      maxWidth: '40%',
    },
    statusDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: -0.1,
      flexShrink: 1,
    },
  });
}
