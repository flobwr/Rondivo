import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { PlanningAppointmentCard } from './PlanningAppointmentCard';
import { TravelCard } from './TravelCard';
import { AppointmentStatus, DayItem } from './types';

type Props = {
  items: DayItem[];
};

// Rhymes with the calendar's cell width so the two components share the same
// horizontal rhythm.
const GUTTER = 46;
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

type Row = {
  item: DayItem;
  index: number;
  /** A small discrete tick under the dot — only between two back-to-back
   * appointments with no travel leg separating them. Everywhere else (the
   * common case) the timeline stays silent and lets the cards + travel
   * capsules carry the sequence on their own. */
  showSegment: boolean;
  isLastRow: boolean;
};

const TimelineRow = function TimelineRow({ row }: { row: Row }) {
  const { item, index, showSegment, isLastRow } = row;
  const rowStyle = [styles.row, !isLastRow ? { paddingBottom: ROW_GAP } : null];

  if (item.kind === 'travel') {
    return (
      <View style={rowStyle}>
        <View style={styles.gutter} />
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
        <Text style={[styles.timeLabel, { color: TIME_COLOR[apt.status] }]}>{apt.time}</Text>
        <View style={[styles.dot, { backgroundColor: DOT_COLOR[apt.status] }]} />
        {showSegment ? <View style={styles.segment} /> : null}
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
    const lastRow = items.length - 1;
    return items.map((item, index) => {
      const next = items[index + 1];
      const showSegment = item.kind === 'appointment' && !!next && next.kind === 'appointment';
      return { item, index, showSegment, isLastRow: index === lastRow };
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
    paddingTop: 4,
    paddingBottom: 28,
  },
  row: {
    flexDirection: 'row',
  },
  gutter: {
    width: GUTTER,
    alignItems: 'center',
    paddingTop: 14,
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
  },
  segment: {
    width: 2,
    height: 10,
    borderRadius: 1,
    backgroundColor: Palette.border,
    marginTop: 6,
  },
  content: {
    flex: 1,
  },
});
