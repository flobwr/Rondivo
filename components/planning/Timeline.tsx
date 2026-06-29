import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { DayItem, AppointmentStatus } from './types';
import { PlanningAppointmentCard } from './PlanningAppointmentCard';
import { TravelCard } from './TravelCard';

type Props = {
  items: DayItem[];
};

const TIME_DOT_COLOR: Record<AppointmentStatus, string> = {
  done: Palette.green,
  inProgress: Palette.blue,
  urgent: Palette.orange,
  normal: Palette.textTertiary,
};

const TIME_COLOR: Record<AppointmentStatus, string> = {
  done: Palette.textTertiary,
  inProgress: Palette.blue,
  urgent: Palette.orange,
  normal: Palette.textSecondary,
};

export function Timeline({ items }: Props) {
  // Group consecutive appointments by their position, interleave travel legs
  const appointmentItems = items.filter((i) => i.kind === 'appointment');
  const lastIndex = appointmentItems.length - 1;
  let aptCount = 0;

  return (
    <View style={styles.container}>
      {items.map((item, idx) => {
        if (item.kind === 'travel') {
          return <TravelCard key={item.data.id} travel={item.data} />;
        }

        const apt = item.data;
        const isLast = aptCount === lastIndex;
        const dotColor = TIME_DOT_COLOR[apt.status];
        const timeColor = TIME_COLOR[apt.status];
        aptCount++;

        return (
          <View key={apt.id} style={styles.row}>
            {/* Left: time column with vertical line */}
            <View style={styles.timeCol}>
              <Text style={[styles.timeLabel, { color: timeColor }]}>{apt.time}</Text>
              <View style={[styles.timelineDot, { backgroundColor: dotColor }]} />
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            {/* Right: card */}
            <View style={styles.cardWrapper}>
              <PlanningAppointmentCard appointment={apt} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: Spacing.screen,
    paddingRight: Spacing.screen,
    marginBottom: 0,
  },
  timeCol: {
    width: 54,
    alignItems: 'center',
    paddingTop: 16,
  },
  timeLabel: {
    fontSize: FontSize.small,
    fontWeight: '600',
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  timelineDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: Palette.border,
    marginTop: 4,
    // Extend line downward past the card — handled by marginBottom on cardWrapper
    minHeight: 60,
  },
  cardWrapper: {
    flex: 1,
    marginBottom: 10,
    // Extra space so travel cards sit nicely between
    paddingBottom: 4,
  },
});
