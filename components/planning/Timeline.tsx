import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/ui';
import { useBottomNavSpace } from '@/components/navigation/bottom-nav';
import { FontSize, FontWeight, LetterSpacing, Opacity, Palette, Spacing } from '@/constants/design';
import { PlanningAppointmentCard } from './PlanningAppointmentCard';
import { STATUS_VISUAL } from './status';
import {
  DOT_CENTER,
  DOT_SIZE,
  GUTTER_PADDING_TOP,
  GUTTER_WIDTH,
  RAIL_LEFT,
  RAIL_WIDTH,
  ROW_GAP,
  TIME_GAP,
  TIME_LINE_HEIGHT,
} from './timeline-metrics';
import { TravelCard } from './TravelCard';
import type { DayItem } from './types';

type Props = {
  items: DayItem[];
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
  const rail = lineStyle ? <View style={[styles.line, lineStyle]} /> : null;

  if (item.kind === 'travel') {
    return (
      <View style={rowStyle}>
        <View style={styles.gutter}>{rail}</View>
        <View style={styles.content}>
          <TravelCard travel={item.data} index={index} />
        </View>
      </View>
    );
  }

  const appointment = item.data;
  const status = STATUS_VISUAL[appointment.status];

  return (
    <View style={rowStyle}>
      <View style={styles.gutter}>
        {rail}
        {/* The rail stays at full strength; only the marker steps back, so a
            finished appointment recedes without breaking the day's line. */}
        <View style={status.muted ? styles.markerMuted : null}>
          <AppText style={[styles.timeLabel, { color: status.color }]}>{appointment.time}</AppText>
          <View style={[styles.dot, { backgroundColor: status.color }]} />
        </View>
      </View>
      <View style={styles.content}>
        <PlanningAppointmentCard appointment={appointment} index={index} />
      </View>
    </View>
  );
};

const MemoRow = memo(TimelineRow);

export function Timeline({ items }: Props) {
  const bottomNavSpace = useBottomNavSpace();

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
      contentContainerStyle={[styles.listContent, { paddingBottom: bottomNavSpace + Spacing.lg }]}
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
    paddingTop: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
  },
  gutter: {
    width: GUTTER_WIDTH,
    alignItems: 'center',
    paddingTop: GUTTER_PADDING_TOP,
  },
  line: {
    position: 'absolute',
    left: RAIL_LEFT,
    width: RAIL_WIDTH,
    borderRadius: RAIL_WIDTH / 2,
    backgroundColor: Palette.border,
  },
  markerMuted: {
    opacity: Opacity.soft,
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: FontSize.small,
    lineHeight: TIME_LINE_HEIGHT,
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.cozy,
    marginBottom: TIME_GAP,
    textAlign: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 3,
    borderColor: Palette.screen, // halo so the rail breaks cleanly around the dot
    alignSelf: 'center',
  },
  content: {
    flex: 1,
  },
});
