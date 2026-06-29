import { StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { PlanningAppointmentCard } from './PlanningAppointmentCard';
import { TravelCard } from './TravelCard';
import { AppointmentStatus, DayItem } from './types';

type Props = {
  items: DayItem[];
};

// Vertical distance from the top of an appointment row to the centre of its dot.
// paddingTop (14) + time label lineHeight (16) + marginBottom (6) + dot radius (8).
const DOT_CENTER = 44;
const ROW_GAP = 14;

const TIME_COLOR: Record<AppointmentStatus, string> = {
  done: Palette.textTertiary,
  inProgress: Palette.blue,
  urgent: Palette.orange,
  normal: Palette.textSecondary,
};

const DOT_COLOR: Record<AppointmentStatus, string> = {
  done: Palette.green,
  inProgress: Palette.blue,
  urgent: Palette.orange,
  normal: Palette.textTertiary,
};

export function Timeline({ items }: Props) {
  const firstApptIdx = items.findIndex((i) => i.kind === 'appointment');
  let lastApptIdx = -1;
  items.forEach((i, idx) => {
    if (i.kind === 'appointment') lastApptIdx = idx;
  });
  const lastRowIdx = items.length - 1;

  return (
    <View style={styles.container}>
      {items.map((item, idx) => {
        // The rail segment for this row. Capped at the first/last dot so the
        // line never overshoots above the first time or below the last.
        const isFirstAppt = idx === firstApptIdx;
        const isLastAppt = idx === lastApptIdx;
        let lineStyle: object | null;
        if (isFirstAppt && isLastAppt) {
          lineStyle = null; // single appointment — no rail needed
        } else if (isLastAppt) {
          lineStyle = { top: 0, height: DOT_CENTER };
        } else if (isFirstAppt) {
          lineStyle = { top: DOT_CENTER, bottom: 0 };
        } else {
          lineStyle = { top: 0, bottom: 0 };
        }

        const rowStyle = [styles.row, idx !== lastRowIdx ? { paddingBottom: ROW_GAP } : null];

        if (item.kind === 'travel') {
          return (
            <View key={item.data.id} style={rowStyle}>
              <View style={styles.gutter}>
                {lineStyle ? <View style={[styles.line, lineStyle]} /> : null}
              </View>
              <View style={styles.content}>
                <TravelCard travel={item.data} index={idx} />
              </View>
            </View>
          );
        }

        const apt = item.data;
        return (
          <View key={apt.id} style={rowStyle}>
            <View style={styles.gutter}>
              {lineStyle ? <View style={[styles.line, lineStyle]} /> : null}
              <Text style={[styles.timeLabel, { color: TIME_COLOR[apt.status] }]}>{apt.time}</Text>
              <View style={[styles.dot, { backgroundColor: DOT_COLOR[apt.status] }]} />
            </View>
            <View style={styles.content}>
              <PlanningAppointmentCard appointment={apt} index={idx} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen,
  },
  row: {
    flexDirection: 'row',
  },
  gutter: {
    width: 50,
    alignItems: 'center',
    paddingTop: 14,
  },
  line: {
    position: 'absolute',
    left: 24, // (gutter 50 / 2) - (line 2 / 2)
    width: 2,
    borderRadius: 1,
    backgroundColor: Palette.border,
  },
  timeLabel: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: Palette.screen, // halo so the rail breaks cleanly around the dot
  },
  content: {
    flex: 1,
  },
});
