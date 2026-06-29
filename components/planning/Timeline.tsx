import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { PlanningAppointmentCard } from './PlanningAppointmentCard';
import { TravelCard } from './TravelCard';
import { AppointmentStatus, DayItem } from './types';

type Props = {
  items: DayItem[];
};

// Vertical distance from the top of an appointment row to the centre of its dot:
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

type LineMode = 'none' | 'full' | 'capTop' | 'capBottom';

type Row = {
  item: DayItem;
  index: number;
  lineMode: LineMode;
  isLastRow: boolean;
};

// One row of the timeline. Each row paints its own rail segment over its full
// height (gap included), so the segments join into one continuous line. The
// first and last appointment rows cap the rail exactly at their dot.
const TimelineRow = function TimelineRow({ row }: { row: Row }) {
  const { item, index, lineMode, isLastRow } = row;

  let lineStyle: object | null;
  switch (lineMode) {
    case 'none':
      lineStyle = null;
      break;
    case 'capTop':
      lineStyle = { top: DOT_CENTER, bottom: 0 };
      break;
    case 'capBottom':
      lineStyle = { top: 0, height: DOT_CENTER };
      break;
    default:
      lineStyle = { top: 0, bottom: 0 };
  }

  const rowStyle = [styles.row, !isLastRow ? { paddingBottom: ROW_GAP } : null];

  if (item.kind === 'travel') {
    return (
      <View style={rowStyle}>
        <View style={styles.gutter}>{lineStyle ? <View style={[styles.line, lineStyle]} /> : null}</View>
        <View style={styles.content}>
          <TravelCard travel={item.data} index={index} />
        </View>
      </View>
    );
  }

  const apt = item.data;
  return (
    <View style={rowStyle}>
      <View style={styles.gutter}>
        {lineStyle ? <View style={[styles.line, lineStyle]} /> : null}
        <Text style={[styles.timeLabel, { color: TIME_COLOR[apt.status] }]}>{apt.time}</Text>
        <View style={[styles.dot, { backgroundColor: DOT_COLOR[apt.status] }]} />
      </View>
      <View style={styles.content}>
        <PlanningAppointmentCard appointment={apt} index={index} />
      </View>
    </View>
  );
};

const MemoRow = memo(TimelineRow);

export function Timeline({ items }: Props) {
  const rows = useMemo<Row[]>(() => {
    const firstApptIdx = items.findIndex((i) => i.kind === 'appointment');
    let lastApptIdx = -1;
    items.forEach((i, idx) => {
      if (i.kind === 'appointment') lastApptIdx = idx;
    });
    const lastRow = items.length - 1;

    return items.map((item, index) => {
      const isFirstAppt = index === firstApptIdx;
      const isLastAppt = index === lastApptIdx;
      let lineMode: LineMode = 'full';
      if (isFirstAppt && isLastAppt) lineMode = 'none';
      else if (isLastAppt) lineMode = 'capBottom';
      else if (isFirstAppt) lineMode = 'capTop';
      return { item, index, lineMode, isLastRow: index === lastRow };
    });
  }, [items]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Row>) => <MemoRow row={item} />, []);
  const keyExtractor = useCallback((row: Row) => row.item.data.id, []);

  return (
    <FlatList
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      removeClippedSubviews
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 16,
    paddingBottom: 28,
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
