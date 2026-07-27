import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactElement, memo, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { Animated, FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';

import { Numeric, Radius, SettleSpring, Spacing, Type, type PaletteShape } from '@/theme';
import { useTheme } from '@/contexts/theme';
import { useBottomDockClearance } from '@/components/ui/BottomDock';
import { openMapsTo } from '@/utils/openMaps';
import { InterventionCard } from './InterventionCard';
import { getStatusMeta, formatTime } from './status';
import {
  BRANCH_LEN,
  DOT_CENTER,
  DOT_SIZE,
  GUTTER_WIDTH,
  LIST_PADDING_H,
  NOW_ROW_HEIGHT,
  RAIL_WEIGHT,
  ROW_GAP,
  SEGMENT_LEN,
} from './timeline-metrics';
import { TravelLink } from './TravelLink';
import { BreakSlot, DayItem, Intervention, InterventionStatus, TravelLeg } from './types';

type Props = {
  items: DayItem[];
  /** minutes since midnight on a live day — places the "Maintenant" marker */
  nowMin?: number;
  /**
   * Everything above the first row — the masthead and the week. It scrolls
   * WITH the day on purpose: the Planning is one single sheet of paper, so a
   * card must never slide underneath the day strip.
   */
  header?: ReactElement;
  /** Stands in for the rows when the day has none (loading / error / free day). */
  placeholder?: ReactElement;
  /**
   * Identifies the day on screen. When it changes the list returns to its top
   * and the new day slides in — a new day always starts at its top.
   */
  dayKey?: string | number | null;
  /** Which way the day came from: 1 forward, -1 back, 0 no travel. */
  direction?: number;
};

/** How far a day slides in from, in points. */
const SLIDE = 40;

const ACTIVE_STATUSES: InterventionStatus[] = ['enRoute', 'arrived', 'inProgress'];

// ── Status dots ───────────────────────────────────────────────────────────────
// The rail is the day's progress made visible: soft filled circles behind you,
// a pulsing beacon on the active job, hollow dots ahead.

/**
 * The active job's marker: a solid core inside a soft halo of the same ink.
 *
 * It used to pulse on a 1.4 s infinite loop. Nothing else in the app loops,
 * the motion charter says so in as many words ("nothing loops for show"), and
 * a heartbeat next to the one card the user is already looking at adds no
 * information — it only makes the screen restless and keeps a JS-driven
 * animation running for as long as the Planning is open. The halo alone marks
 * the beacon; the card's tint and lift do the rest.
 */
function BeaconDot({ color, styles }: { color: string; styles: TimelineStyles }) {
  return (
    <View style={styles.beaconWrapper}>
      <View style={[styles.beaconHalo, { backgroundColor: color }]} />
      <View style={[styles.beaconCore, { backgroundColor: color }]} />
    </View>
  );
}

function StatusDot({ status, styles }: { status: InterventionStatus; styles: TimelineStyles }) {
  const { palette } = useTheme();
  const meta = getStatusMeta(palette)[status];

  if (meta.dot === 'pulse') return <BeaconDot color={meta.color} styles={styles} />;

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
  | { key: string; kind: 'travel'; travel: TravelLeg; index: number; destinationAddress?: string }
  | { key: string; kind: 'break'; brk: BreakSlot }
  | { key: string; kind: 'now'; timeLabel: string };

/**
 * `showSegment` replaces what used to be a continuous vertical rail threading
 * the whole day: a tiny discrete tick now appears only between two
 * back-to-back dotted rows (an intervention, a break, the "now" marker) with
 * no travel leg between them. The common case — every job separated by a
 * trajet — stays completely silent; the travel capsule alone carries the
 * sequence, and the timeline never competes with the cards for attention.
 */
type PositionedRow = Row & { showSegment: boolean; isLastRow: boolean };

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
      // A travel leg's destination is the next intervention in the day — the
      // one this trip is actually taking the artisan to.
      const next = items.slice(index + 1).find((i) => i.kind === 'intervention');
      const destinationAddress = next?.kind === 'intervention' ? next.data.address : undefined;
      rows.push({ key: item.data.id, kind: 'travel', travel: item.data, index, destinationAddress });
    } else {
      rows.push({ key: item.data.id, kind: 'break', brk: item.data });
    }
  });

  return rows;
}

// ── Rows rendering ────────────────────────────────────────────────────────────

function TimelineRow({ row, onPressIntervention }: { row: PositionedRow; onPressIntervention: (id: string) => void }) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const dotCenter = DOT_CENTER[row.kind] ?? DOT_CENTER.card;
  const rowStyle = [styles.row, !row.isLastRow ? { paddingBottom: ROW_GAP } : null];
  const segment = row.showSegment ? <View style={styles.segment} /> : null;

  const dotAnchor = (child: React.ReactNode) => (
    <View style={[styles.dotAnchor, { top: dotCenter - DOT_SIZE / 2 }]}>{child}</View>
  );
  // The short horizontal hand-off from a dot to its row's content — every
  // dotted row (card / break / now) gets one; travel rows stay dot-less and
  // branch-less, the capsule alone carrying the sequence.
  const branch = <View style={[styles.branch, { top: dotCenter - RAIL_WEIGHT / 2 }]} />;

  switch (row.kind) {
    case 'now':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {dotAnchor(
              <View style={styles.nowDotHalo}>
                <View style={styles.nowDot} />
              </View>
            )}
          </View>
          <View style={styles.nowContent}>
            {branch}
            <Text style={styles.nowLabel}>Maintenant</Text>
            <View style={styles.nowLine} />
            <Text style={[styles.nowTime, Numeric]}>{row.timeLabel}</Text>
          </View>
          {segment}
        </View>
      );

    case 'card':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {dotAnchor(<StatusDot status={row.intervention.status} styles={styles} />)}
          </View>
          <View style={styles.content}>
            {branch}
            <InterventionCard
              intervention={row.intervention}
              index={row.index}
              onPress={() => onPressIntervention(row.intervention.id)}
            />
          </View>
          {segment}
        </View>
      );

    case 'break':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>
            {dotAnchor(
              <View style={styles.breakDot}>
                <Feather name="coffee" size={9} color={palette.textSecondary} />
              </View>
            )}
          </View>
          <View style={styles.breakContent}>
            {branch}
            <Text style={styles.breakLabel}>{row.brk.label}</Text>
            <Text style={[styles.breakTime, Numeric]}>
              {row.brk.start} – {row.brk.end}
            </Text>
          </View>
          {segment}
        </View>
      );

    default:
      return (
        <View style={rowStyle}>
          <View style={styles.gutter} />
          <View style={styles.content}>
            <TravelLink
              travel={row.travel}
              index={row.index}
              onNavigate={row.destinationAddress ? () => openMapsTo(row.destinationAddress!) : undefined}
            />
          </View>
        </View>
      );
  }
}

const MemoRow = memo(TimelineRow);

export function Timeline({ items, nowMin, header, placeholder, dayKey, direction = 0 }: Props) {
  const router = useRouter();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const dockClearance = useBottomDockClearance(0);
  const listRef = useRef<FlatList<PositionedRow>>(null);

  // The day transition lives here, not in the screen, and starts in a LAYOUT
  // effect — i.e. once the new day's rows are mounted and attached to the
  // value. Driven from the screen instead, the animation began while React was
  // still rendering: rows and placeholders that mounted after it had started
  // attached at the value's initial frame and were never repainted, leaving a
  // whole day at opacity 0. Starting it after the commit is what makes it
  // correct for content that mounts in the same breath.
  const enter = useRef(new Animated.Value(1)).current;
  const settled = useRef(false);

  useLayoutEffect(() => {
    // First day on screen fades in with the page; only day CHANGES slide.
    if (!settled.current) {
      settled.current = true;
      return;
    }
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    enter.setValue(0);
    // JS-driven on purpose: a virtualized row that mounts later (on scroll,
    // after the spring has settled) reads the live value this way, where a
    // native-driven one would attach to a stale frame.
    Animated.spring(enter, { toValue: 1, useNativeDriver: false, ...SettleSpring }).start();
  }, [dayKey, enter]);

  const contentStyle = useMemo(
    () => ({
      opacity: enter,
      transform: [
        {
          translateX: enter.interpolate({
            inputRange: [0, 1],
            outputRange: [direction * SLIDE, 0],
          }),
        },
      ],
    }),
    [enter, direction]
  );

  const rows = useMemo<PositionedRow[]>(() => {
    const base = buildRows(items, nowMin);
    const hasDot = (r: Row) => r.kind !== 'travel';

    return base.map((row, index) => {
      const next = base[index + 1];
      const showSegment = hasDot(row) && !!next && hasDot(next);
      return { ...row, showSegment, isLastRow: index === base.length - 1 };
    });
  }, [items, nowMin]);

  const onPressIntervention = useCallback(
    (id: string) => router.push({ pathname: '/intervention/[id]', params: { id } }),
    [router]
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<PositionedRow>) => (
      <Animated.View style={contentStyle}>
        <MemoRow row={item} onPressIntervention={onPressIntervention} />
      </Animated.View>
    ),
    [onPressIntervention, contentStyle]
  );
  const keyExtractor = useCallback((row: PositionedRow) => row.key, []);

  const empty = placeholder ? (
    <Animated.View style={contentStyle}>{placeholder}</Animated.View>
  ) : null;

  return (
    <FlatList
      ref={listRef}
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={header ? <View style={styles.header}>{header}</View> : null}
      ListEmptyComponent={empty}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        // With a header, the air above the first row belongs to the header
        // block, which owns the whole gap under the week.
        header ? styles.listContentWithHeader : null,
        { paddingBottom: dockClearance },
      ]}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
    />
  );
}

type TimelineStyles = ReturnType<typeof createStyles>;

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    listContent: {
      paddingHorizontal: LIST_PADDING_H,
      // Same unit as the gap between rows: the air above the first card equals
      // the air between every card after it — one grid, no exception for the
      // top of the list.
      paddingTop: ROW_GAP,
    },
    listContentWithHeader: {
      paddingTop: 0,
    },
    // The masthead and the week carry their own gutter and must run the full
    // width of the page, so the header opts out of the list's padding instead
    // of being indented twice.
    header: {
      marginHorizontal: -LIST_PADDING_H,
    },
    row: {
      flexDirection: 'row',
    },
    gutter: {
      width: GUTTER_WIDTH,
    },
    // A small discrete tick — never a rail — bridging two back-to-back dotted
    // rows. Centred in the row's own bottom gap, well clear of both dots, and
    // drawn at the same hairline weight as the branches so every mark the rail
    // makes has one thickness.
    segment: {
      position: 'absolute',
      left: (GUTTER_WIDTH - RAIL_WEIGHT) / 2,
      bottom: (ROW_GAP - SEGMENT_LEN) / 2,
      width: RAIL_WEIGHT,
      height: SEGMENT_LEN,
      borderRadius: Radius.pill,
      backgroundColor: palette.insetDeep,
    },
    content: {
      flex: 1,
      position: 'relative',
      paddingLeft: BRANCH_LEN,
    },
    branch: {
      position: 'absolute',
      left: 0,
      width: BRANCH_LEN,
      height: RAIL_WEIGHT,
      borderRadius: Radius.pill,
      backgroundColor: palette.insetDeep,
    },
    dotAnchor: {
      position: 'absolute',
      left: (GUTTER_WIDTH - DOT_SIZE) / 2,
      width: DOT_SIZE,
      height: DOT_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // dots
    iconDot: {
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: Radius.pill,
      borderWidth: 3,
      borderColor: palette.screen,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hollowHalo: {
      width: 16,
      height: 16,
      borderRadius: Radius.pill,
      backgroundColor: palette.screen,
      alignItems: 'center',
      justifyContent: 'center',
    },
    hollowDot: {
      width: 11,
      height: 11,
      borderRadius: Radius.pill,
      backgroundColor: palette.card,
      borderWidth: 2,
      borderColor: palette.insetDeep,
    },
    beaconWrapper: {
      width: DOT_SIZE,
      height: DOT_SIZE,
      alignItems: 'center',
      justifyContent: 'center',
    },
    beaconHalo: {
      position: 'absolute',
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: Radius.pill,
      // Held at the low end of what the pulse used to reach, so the beacon reads
      // as a halo rather than a second, heavier dot.
      opacity: 0.22,
    },
    beaconCore: {
      width: 15,
      height: 15,
      borderRadius: Radius.pill,
      borderWidth: 3,
      borderColor: palette.screen,
    },
    breakDot: {
      width: 20,
      height: 20,
      borderRadius: Radius.pill,
      borderWidth: 2,
      borderColor: palette.screen,
      backgroundColor: palette.inset,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // "Maintenant" marker
    nowDotHalo: {
      width: 13,
      height: 13,
      borderRadius: Radius.pill,
      backgroundColor: palette.screen,
      alignItems: 'center',
      justifyContent: 'center',
    },
    nowDot: {
      width: 7,
      height: 7,
      borderRadius: Radius.pill,
      backgroundColor: palette.blue,
    },
    nowContent: {
      flex: 1,
      height: NOW_ROW_HEIGHT,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      position: 'relative',
      paddingLeft: BRANCH_LEN,
    },
    nowLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: palette.blue,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
    },
    nowLine: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: palette.blue,
      opacity: 0.35,
    },
    nowTime: {
      fontSize: 11.5,
      fontWeight: '600',
      color: palette.blue,
      letterSpacing: -0.1,
    },

    // break row
    breakContent: {
      flex: 1,
      minHeight: 34,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      position: 'relative',
      paddingLeft: BRANCH_LEN,
    },
    breakLabel: {
      ...Type.footnote,
      flex: 1,
      fontWeight: '600',
      color: palette.textSecondary,
    },
    breakTime: {
      ...Type.caption,
      color: palette.textTertiary,
      letterSpacing: -0.2,
    },
  });
}
