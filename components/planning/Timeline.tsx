import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { InterventionCard } from './InterventionCard';
import { STATUS_META } from './status';
import { TravelLink } from './TravelLink';
import { DayItem, InterventionStatus } from './types';

type Props = {
  items: DayItem[];
};

const GUTTER_WIDTH = 36;
// Vertical distance from the top of an intervention row to the centre of its
// dot: card padding (16) + half the start-time line height (10).
const DOT_CENTER = 26;
const ROW_GAP = 14;
const NOW_ROW_HEIGHT = 30;

// ── Status dots (ref 2) ───────────────────────────────────────────────────────
// done / active states get a soft-filled circle with an icon, upcoming jobs a
// small hollow dot, and the in-progress job a pulsing blue beacon. Every dot
// wears a screen-coloured ring so the rail breaks cleanly around it.

function PulseDot() {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const ringScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.5] });
  const ringOpacity = pulse.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.3, 0.1, 0] });

  return (
    <View style={styles.pulseWrapper}>
      <Animated.View
        style={[styles.pulseRing, { opacity: ringOpacity, transform: [{ scale: ringScale }] }]}
      />
      <View style={styles.pulseCore} />
    </View>
  );
}

function StatusDot({ status }: { status: InterventionStatus }) {
  const meta = STATUS_META[status];

  if (meta.dot === 'pulse') return <PulseDot />;

  if (meta.dot === 'hollow') {
    return (
      <View style={styles.hollowHalo}>
        <View style={styles.hollowDot} />
      </View>
    );
  }

  return (
    <View style={[styles.iconDot, { backgroundColor: meta.soft }]}>
      {meta.dotIcon ? <Feather name={meta.dotIcon} size={11} color={meta.color} /> : null}
    </View>
  );
}

// ── Rows ──────────────────────────────────────────────────────────────────────

type LineMode = 'none' | 'full' | 'capTop' | 'capBottom';

type Row = {
  item: DayItem;
  index: number;
  lineMode: LineMode;
  isLastRow: boolean;
};

// Each row paints its own rail segment over its full height (gap included) so
// the segments join into one continuous line; the first and last dotted rows
// cap the rail exactly at their dot.
function TimelineRow({ row }: { row: Row }) {
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

  if (item.kind === 'now') {
    // "Maintenant" marker (ref 1's Now divider), pinned to the rail.
    return (
      <View style={rowStyle}>
        <View style={styles.gutter}>
          {lineStyle ? <View style={[styles.line, lineStyle]} /> : null}
          <View style={styles.nowDotHalo}>
            <View style={styles.nowDot} />
          </View>
        </View>
        <View style={styles.nowContent}>
          <Text style={styles.nowLabel}>Maintenant</Text>
          <View style={styles.nowLine} />
        </View>
      </View>
    );
  }

  if (item.kind === 'travel') {
    return (
      <View style={rowStyle}>
        <View style={styles.gutter}>
          {lineStyle ? <View style={[styles.line, lineStyle]} /> : null}
        </View>
        <View style={styles.content}>
          <TravelLink travel={item.data} index={index} />
        </View>
      </View>
    );
  }

  return (
    <View style={rowStyle}>
      <View style={styles.gutter}>
        {lineStyle ? <View style={[styles.line, lineStyle]} /> : null}
        <View style={styles.dotAnchor}>
          <StatusDot status={item.data.status} />
        </View>
      </View>
      <View style={styles.content}>
        <InterventionCard intervention={item.data} index={index} />
      </View>
    </View>
  );
}

const MemoRow = memo(TimelineRow);

export function Timeline({ items }: Props) {
  const rows = useMemo<Row[]>(() => {
    const hasDot = (i: DayItem) => i.kind !== 'travel';
    const firstDotIdx = items.findIndex(hasDot);
    let lastDotIdx = -1;
    items.forEach((i, idx) => {
      if (hasDot(i)) lastDotIdx = idx;
    });
    const lastRow = items.length - 1;

    return items.map((item, index) => {
      const isFirst = index === firstDotIdx;
      const isLast = index === lastDotIdx;
      let lineMode: LineMode = 'full';
      if (isFirst && isLast) lineMode = 'none';
      else if (isLast) lineMode = 'capBottom';
      else if (isFirst) lineMode = 'capTop';
      return { item, index, lineMode, isLastRow: index === lastRow };
    });
  }, [items]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<Row>) => <MemoRow row={item} />, []);
  const keyExtractor = useCallback(
    (row: Row) => (row.item.kind === 'now' ? row.item.id : row.item.data.id),
    []
  );

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
    paddingTop: 12,
    paddingBottom: 32,
  },
  row: {
    flexDirection: 'row',
  },
  gutter: {
    width: GUTTER_WIDTH,
  },
  line: {
    position: 'absolute',
    left: GUTTER_WIDTH / 2 - 1,
    width: 2,
    borderRadius: 1,
    backgroundColor: '#E3E7ED',
  },
  content: {
    flex: 1,
  },
  dotAnchor: {
    position: 'absolute',
    top: DOT_CENTER - 13,
    left: GUTTER_WIDTH / 2 - 13,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // dots
  iconDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: Palette.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hollowHalo: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Palette.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hollowDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Palette.card,
    borderWidth: 2,
    borderColor: '#CBD3DF',
  },
  pulseWrapper: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.blue,
  },
  pulseCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Palette.blue,
    borderWidth: 3,
    borderColor: Palette.screen,
  },

  // "Maintenant" marker
  nowDotHalo: {
    position: 'absolute',
    top: NOW_ROW_HEIGHT / 2 - 7,
    left: GUTTER_WIDTH / 2 - 7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Palette.screen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.blue,
  },
  nowContent: {
    height: NOW_ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  nowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  nowLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.blue,
    opacity: 0.35,
  },
});
