import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { InterventionCard } from './InterventionCard';
import { STATUS_META, formatTime } from './status';
import { TravelLink } from './TravelLink';
import { BreakSlot, DayItem, Intervention, InterventionStatus, TravelLeg } from './types';

type Props = {
  items: DayItem[];
  /** minutes since midnight on a live day — places the "Maintenant" marker */
  nowMin?: number;
};

const GUTTER_WIDTH = 36;
const ROW_GAP = 20;
const NOW_ROW_HEIGHT = 30;
const LIST_PADDING_H = 20;

// Vertical distance from the top of a row to the centre of its rail dot.
const DOT_CENTER: Record<string, number> = {
  card: 22,
  break: 17,
  now: NOW_ROW_HEIGHT / 2,
};

const ACTIVE_STATUSES: InterventionStatus[] = ['enRoute', 'arrived', 'inProgress'];

// ── Status dots ───────────────────────────────────────────────────────────────
// The rail is the day's progress made visible: soft filled circles behind you,
// a pulsing beacon on the active job, hollow dots ahead.

function PulseDot({ color }: { color: string }) {
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
        style={[
          styles.pulseRing,
          { backgroundColor: color, opacity: ringOpacity, transform: [{ scale: ringScale }] },
        ]}
      />
      <View style={[styles.pulseCore, { backgroundColor: color }]} />
    </View>
  );
}

function StatusDot({ status }: { status: InterventionStatus }) {
  const meta = STATUS_META[status];

  if (meta.dot === 'pulse') return <PulseDot color={meta.color} />;

  if (meta.dot === 'hollow') {
    return (
      <View style={styles.hollowHalo}>
        <View style={styles.hollowDot} />
      </View>
    );
  }

  return (
    <View style={[styles.iconDot, { backgroundColor: meta.soft }]}>
      {meta.dotIcon ? <Feather name={meta.dotIcon} size={10} color={meta.color} /> : null}
    </View>
  );
}

// ── Row model ─────────────────────────────────────────────────────────────────

type Row =
  | { key: string; kind: 'card'; intervention: Intervention; index: number }
  | { key: string; kind: 'travel'; travel: TravelLeg; index: number }
  | { key: string; kind: 'break'; brk: BreakSlot }
  | { key: string; kind: 'now'; timeLabel: string };

type PositionedRow = Row & { lineMode: 'none' | 'full' | 'capTop' | 'capBottom'; isLastRow: boolean };

/** The intervention "now" points at: the active one, else the next planned. */
function findNowIndex(items: DayItem[]): number {
  const active = items.findIndex(
    (i) => i.kind === 'intervention' && ACTIVE_STATUSES.includes(i.data.status)
  );
  if (active !== -1) return active;
  return items.findIndex((i) => i.kind === 'intervention' && i.data.status === 'planned');
}

function buildRows(items: DayItem[], nowMin?: number): Row[] {
  const nowIndex = nowMin != null ? findNowIndex(items) : -1;
  const rows: Row[] = [];

  items.forEach((item, index) => {
    if (index === nowIndex) {
      rows.push({ key: 'now', kind: 'now', timeLabel: formatTime(nowMin as number) });
    }
    if (item.kind === 'intervention') {
      rows.push({ key: item.data.id, kind: 'card', intervention: item.data, index });
    } else if (item.kind === 'travel') {
      rows.push({ key: item.data.id, kind: 'travel', travel: item.data, index });
    } else {
      rows.push({ key: item.data.id, kind: 'break', brk: item.data });
    }
  });

  return rows;
}

// ── Rows rendering ────────────────────────────────────────────────────────────

// Each row paints its own rail segment over its full height (gap included) so
// the segments join into one continuous line running the whole day; the first
// and last dotted rows cap the rail exactly at their dot.
function TimelineRow({ row }: { row: PositionedRow }) {
  let lineStyle: object | null;
  const dotCenter = DOT_CENTER[row.kind] ?? 28;
  switch (row.lineMode) {
    case 'none':
      lineStyle = null;
      break;
    case 'capTop':
      lineStyle = { top: dotCenter, bottom: 0 };
      break;
    case 'capBottom':
      lineStyle = { top: 0, height: dotCenter };
      break;
    default:
      lineStyle = { top: 0, bottom: 0 };
  }

  const rowStyle = [styles.row, !row.isLastRow ? { paddingBottom: ROW_GAP } : null];
  const line = lineStyle ? <View style={[styles.line, lineStyle]} /> : null;

  const dotAnchor = (child: React.ReactNode) => (
    <View style={[styles.dotAnchor, { top: dotCenter - 13 }]}>{child}</View>
  );

  switch (row.kind) {
    case 'now':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {line}
            {dotAnchor(
              <View style={styles.nowDotHalo}>
                <View style={styles.nowDot} />
              </View>
            )}
          </View>
          <View style={styles.nowContent}>
            <Text style={styles.nowLabel}>Maintenant</Text>
            <View style={styles.nowLine} />
            <Text style={styles.nowTime}>{row.timeLabel}</Text>
          </View>
        </View>
      );

    case 'card':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {line}
            {dotAnchor(<StatusDot status={row.intervention.status} />)}
          </View>
          <View style={styles.content}>
            <InterventionCard intervention={row.intervention} index={row.index} />
          </View>
        </View>
      );

    case 'break':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {line}
            {dotAnchor(
              <View style={styles.breakDot}>
                <Feather name="coffee" size={9} color={Palette.textSecondary} />
              </View>
            )}
          </View>
          <View style={styles.breakContent}>
            <Text style={styles.breakLabel}>{row.brk.label}</Text>
            <Text style={styles.breakTime}>
              {row.brk.start} – {row.brk.end}
            </Text>
          </View>
        </View>
      );

    default:
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>{line}</View>
          <View style={styles.content}>
            <TravelLink travel={row.travel} index={row.index} />
          </View>
        </View>
      );
  }
}

const MemoRow = memo(TimelineRow);

export function Timeline({ items, nowMin }: Props) {
  const rows = useMemo<PositionedRow[]>(() => {
    const base = buildRows(items, nowMin);
    const hasDot = (r: Row) => r.kind !== 'travel';
    const firstDotIdx = base.findIndex(hasDot);
    let lastDotIdx = -1;
    base.forEach((r, idx) => {
      if (hasDot(r)) lastDotIdx = idx;
    });

    return base.map((row, index) => {
      const isFirst = index === firstDotIdx;
      const isLast = index === lastDotIdx;
      let lineMode: PositionedRow['lineMode'] = 'full';
      if (isFirst && isLast) lineMode = 'none';
      else if (isLast) lineMode = 'capBottom';
      else if (isFirst) lineMode = 'capTop';
      return { ...row, lineMode, isLastRow: index === base.length - 1 };
    });
  }, [items, nowMin]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PositionedRow>) => <MemoRow row={item} />,
    []
  );
  const keyExtractor = useCallback((row: PositionedRow) => row.key, []);

  return (
    <FlatList
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: LIST_PADDING_H,
    paddingTop: 32,
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
  },
  pulseCore: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: Palette.screen,
  },
  breakDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Palette.screen,
    backgroundColor: '#F1F3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // "Maintenant" marker
  nowDotHalo: {
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
    flex: 1,
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
  nowTime: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.blue,
    letterSpacing: -0.1,
    fontVariant: ['tabular-nums'],
  },

  // break row
  breakContent: {
    flex: 1,
    minHeight: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  breakLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.2,
  },
  breakTime: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
});
