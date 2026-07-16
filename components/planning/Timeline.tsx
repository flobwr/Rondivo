import { Feather } from '@expo/vector-icons';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { BreakRow, CompactRow, PastGroup } from './CompactRows';
import { DayAnalysis } from './dayMath';
import { InterventionCard } from './InterventionCard';
import { NextUpCard } from './NextUpCard';
import { STATUS_META, formatTime } from './status';
import { TravelLink } from './TravelLink';
import { BreakSlot, DayItem, Intervention, InterventionStatus, TravelLeg } from './types';

type Props = {
  items: DayItem[];
  analysis: DayAnalysis;
  nowMin?: number;
  onScrollY?: (y: number) => void;
};

const GUTTER_WIDTH = 36;
const ROW_GAP = 14;
const NOW_ROW_HEIGHT = 30;

// Vertical distance from the top of a row to the centre of its rail dot,
// per row kind.
const DOT_CENTER: Record<string, number> = {
  hero: 30,
  card: 26,
  compact: 19,
  group: 19,
  break: 17,
  now: NOW_ROW_HEIGHT / 2,
};

// ── Status dots ───────────────────────────────────────────────────────────────

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
  | { key: string; kind: 'group'; items: DayItem[] }
  | { key: string; kind: 'now'; timeLabel: string }
  | { key: string; kind: 'hero'; intervention: Intervention; travel: TravelLeg | null; nowMin: number }
  | { key: string; kind: 'card'; intervention: Intervention; index: number }
  | { key: string; kind: 'compact'; intervention: Intervention }
  | { key: string; kind: 'travel'; travel: TravelLeg; index: number }
  | { key: string; kind: 'break'; brk: BreakSlot };

type PositionedRow = Row & { lineMode: 'none' | 'full' | 'capTop' | 'capBottom'; isLastRow: boolean };

function mapPlainItem(item: DayItem, index: number): Row {
  if (item.kind === 'travel') {
    return { key: item.data.id, kind: 'travel', travel: item.data, index };
  }
  if (item.kind === 'break') {
    return { key: item.data.id, kind: 'break', brk: item.data };
  }
  return item.data.status === 'planned'
    ? { key: item.data.id, kind: 'card', intervention: item.data, index }
    : { key: item.data.id, kind: 'compact', intervention: item.data };
}

// A travel capsule only earns its row while the leg still has to be driven —
// once the day has moved past it, it's noise.
function isUpcomingLeg(items: DayItem[], index: number): boolean {
  const next = items
    .slice(index + 1)
    .find((i): i is Extract<DayItem, { kind: 'intervention' }> => i.kind === 'intervention');
  return next != null && (next.data.status === 'planned' || next.data.status === 'enRoute');
}

/**
 * Turns the chronological day into display rows. On a live day, everything
 * already behind the artisan collapses into one group so the screen always
 * opens on the next action (the hero); the leg feeding the hero is absorbed
 * into the hero card.
 */
function buildRows(items: DayItem[], analysis: DayAnalysis, nowMin?: number): Row[] {
  const { heroIndex, heroTravelIndex } = analysis;

  if (nowMin == null || heroIndex < 0) {
    return items
      .filter((item, i) => item.kind !== 'travel' || isUpcomingLeg(items, i))
      .map(mapPlainItem);
  }

  const rows: Row[] = [];

  const pastItems = items.slice(0, heroIndex).filter((item, i) => i !== heroTravelIndex);
  const pastRenderable = pastItems.filter((i) => i.kind !== 'travel');
  const hasPastInterventions = pastRenderable.some((i) => i.kind === 'intervention');
  if (hasPastInterventions) {
    rows.push({ key: 'past-group', kind: 'group', items: pastRenderable });
  } else {
    // no interventions to fold away — keep breaks visible chronologically
    pastRenderable.forEach((item, i) => rows.push(mapPlainItem(item, i)));
  }

  const heroItem = items[heroIndex] as Extract<DayItem, { kind: 'intervention' }>;
  const heroTravel =
    heroTravelIndex >= 0
      ? (items[heroTravelIndex] as Extract<DayItem, { kind: 'travel' }>).data
      : null;

  // The now marker anchors the hero in time — only while waiting to leave;
  // once en route / on site / working, the hero itself is "now".
  if (heroItem.data.status === 'planned') {
    rows.push({ key: 'now', kind: 'now', timeLabel: formatTime(nowMin) });
  }

  rows.push({
    key: heroItem.data.id,
    kind: 'hero',
    intervention: heroItem.data,
    travel: heroTravel,
    nowMin,
  });

  items.slice(heroIndex + 1).forEach((item, i) => {
    if (item.kind === 'travel' && !isUpcomingLeg(items, heroIndex + 1 + i)) return;
    rows.push(mapPlainItem(item, i + 1));
  });

  return rows;
}

// ── Rows rendering ────────────────────────────────────────────────────────────

// Each row paints its own rail segment over its full height (gap included) so
// the segments join into one continuous line; the first and last dotted rows
// cap the rail exactly at their dot.
function TimelineRow({ row }: { row: PositionedRow }) {
  let lineStyle: object | null;
  const dotCenter = DOT_CENTER[row.kind] ?? 26;
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
    case 'group':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {line}
            {dotAnchor(
              <View style={[styles.iconDot, { backgroundColor: Palette.greenSoft }]}>
                <Feather name="check" size={10} color={Palette.green} />
              </View>
            )}
          </View>
          <View style={styles.content}>
            <PastGroup items={row.items} />
          </View>
        </View>
      );

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

    case 'hero':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {line}
            {dotAnchor(<StatusDot status={row.intervention.status === 'planned' ? 'inProgress' : row.intervention.status} />)}
          </View>
          <View style={styles.content}>
            <NextUpCard intervention={row.intervention} travel={row.travel} nowMin={row.nowMin} />
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

    case 'compact':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {line}
            {dotAnchor(<StatusDot status={row.intervention.status} />)}
          </View>
          <View style={styles.content}>
            <CompactRow intervention={row.intervention} />
          </View>
        </View>
      );

    case 'break':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {line}
            {dotAnchor(
              <View style={styles.iconDotSmall}>
                <Feather name="coffee" size={9} color={Palette.textSecondary} />
              </View>
            )}
          </View>
          <View style={styles.content}>
            <BreakRow brk={row.brk} />
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

export function Timeline({ items, analysis, nowMin, onScrollY }: Props) {
  const rows = useMemo<PositionedRow[]>(() => {
    const base = buildRows(items, analysis, nowMin);
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
  }, [items, analysis, nowMin]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PositionedRow>) => <MemoRow row={item} />,
    []
  );
  const keyExtractor = useCallback((row: PositionedRow) => row.key, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollY?.(e.nativeEvent.contentOffset.y);
    },
    [onScrollY]
  );

  return (
    <FlatList
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      onScroll={handleScroll}
      scrollEventThrottle={32}
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
  iconDotSmall: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Palette.screen,
    backgroundColor: '#F1F3F8',
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
});
