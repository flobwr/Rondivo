import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { PlanningAppointmentCard } from './PlanningAppointmentCard';
import { TravelCard } from './TravelCard';
import { AppointmentStatus, DayItem } from './types';

type Props = {
  items: DayItem[];
};

const GUTTER_WIDTH = 40;
const DOT_SIZE = 26;
const BRANCH_LEN = 14;
const GUTTER_TOP = 12;
const ROW_GAP = 20;

// Vertical distance from the top of a row to the centre of its dot.
const DOT_CENTER = GUTTER_TOP + DOT_SIZE / 2;

type DotStyle = {
  icon?: React.ComponentProps<typeof Feather>['name'];
  bg: string;
  border: string;
  color: string;
};

const DOT_STYLE: Record<AppointmentStatus, DotStyle> = {
  done: { icon: 'check', bg: Palette.greenSoft, border: Palette.green, color: Palette.green },
  inProgress: { icon: 'arrow-right', bg: Palette.blueSoft, border: Palette.blue, color: Palette.blue },
  urgent: { icon: 'alert-circle', bg: Palette.orangeSoft, border: Palette.orange, color: Palette.orange },
  normal: { bg: Palette.card, border: Palette.border, color: Palette.textTertiary },
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
// first and last appointment rows cap the rail exactly at their dot. Every
// appointment dot sprouts a short horizontal branch that hands off to its card.
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
  const dot = DOT_STYLE[apt.status];

  return (
    <View style={rowStyle}>
      <View style={styles.gutter}>
        {lineStyle ? <View style={[styles.line, lineStyle]} /> : null}
        <View style={[styles.dot, { backgroundColor: dot.bg, borderColor: dot.border }]}>
          {dot.icon ? <Feather name={dot.icon} size={12} color={dot.color} /> : null}
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.branch} />
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
    paddingTop: 20,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
  },
  gutter: {
    width: GUTTER_WIDTH,
    alignItems: 'center',
    paddingTop: GUTTER_TOP,
  },
  line: {
    position: 'absolute',
    left: GUTTER_WIDTH / 2 - 1,
    width: 2,
    borderRadius: 1,
    backgroundColor: Palette.border,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    position: 'relative',
    paddingLeft: BRANCH_LEN,
  },
  branch: {
    position: 'absolute',
    top: DOT_CENTER - 1,
    left: 0,
    width: BRANCH_LEN,
    height: 2,
    borderRadius: 1,
    backgroundColor: Palette.border,
  },
});
