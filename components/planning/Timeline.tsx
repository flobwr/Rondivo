import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo, useState } from 'react';
import { LayoutChangeEvent, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Numeric, Radius, Spacing, Type, type PaletteShape } from '@/theme';
import { useTheme } from '@/contexts/theme';
import { useBottomDockClearance } from '@/components/ui/BottomDock';
import { LivingCard } from '@/components/ui/living';
import { openMapsTo } from '@/utils/openMaps';
import { InterventionCard } from './InterventionCard';
import { InterventionDetail } from './InterventionDetail';
import { getStatusMeta, formatTime } from './status';
import {
  BRANCH_LEN,
  DOT_CENTER,
  DOT_SIZE,
  GUTTER_WIDTH,
  LIST_PADDING_H,
  NOW_ROW_HEIGHT,
  RAIL_CLEARANCE,
  RAIL_WEIGHT,
  ROW_GAP,
  SEGMENT_GAP,
  SEGMENT_LEN,
} from './timeline-metrics';
import { TravelLink } from './TravelLink';
import { BreakSlot, DayItem, Intervention, InterventionStatus, TravelLeg } from './types';

type Props = {
  items: DayItem[];
  /** minutes since midnight on a live day — places the "Maintenant" marker */
  nowMin?: number;
  /**
   * Height of the floating composition the day scrolls behind. The list spans
   * the whole page — that is what lets a card pass between the week and the
   * paper, still visible — so the air above the first row has to be reserved
   * inside the scrolling content rather than by the layout above it.
   */
  topInset?: number;
};

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

type PositionedRow = Row & { isLastRow: boolean };

/** Rows that carry a marker on the rail — everything except a travel leg. */
function hasDot(row: Row): boolean {
  return row.kind !== 'travel';
}

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
            {/* The one living card in the app so far. Tapping it does not
                navigate: the card itself grows into its detail and comes back
                to this exact row. The full record is still one tap away from
                inside it. */}
            <LivingCard
              detail={({ close }) => (
                <InterventionDetail
                  intervention={row.intervention}
                  onClose={close}
                  onOpenRecord={() => {
                    close();
                    onPressIntervention(row.intervention.id);
                  }}
                />
              )}>
              {(open, atRest) => (
                <InterventionCard
                  intervention={row.intervention}
                  index={row.index}
                  onPress={open}
                  atRest={atRest}
                />
              )}
            </LivingCard>
          </View>
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

export function Timeline({ items, nowMin, topInset = 0 }: Props) {
  const router = useRouter();
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const dockClearance = useBottomDockClearance(0);
  // Where each row sits inside the stack — the rail is drawn from measured
  // positions rather than assumed ones, because a day's rows have four
  // different heights and any of them can wrap.
  const [offsets, setOffsets] = useState<Record<string, number>>({});

  const rows = useMemo<PositionedRow[]>(() => {
    const base = buildRows(items, nowMin);
    return base.map((row, index) => ({ ...row, isLastRow: index === base.length - 1 }));
  }, [items, nowMin]);

  const onPressIntervention = useCallback(
    (id: string) => router.push({ pathname: '/intervention/[id]', params: { id } }),
    [router]
  );

  const handleRowLayout = useCallback(
    (key: string) => (event: LayoutChangeEvent) => {
      const { y } = event.nativeEvent.layout;
      setOffsets((previous) => (previous[key] === y ? previous : { ...previous, [key]: y }));
    },
    []
  );

  /**
   * The rail, computed once for the whole day.
   *
   * Drawing it per row is what made it irregular: every row restarts the
   * rhythm at its own top edge, so the marks bunch or gap at each boundary and
   * the eye catches it immediately. Measured end to end, the pitch is constant
   * from the first marker to the last whatever happens in between.
   */
  const rail = useMemo(() => {
    const dotted = rows.filter(hasDot);
    if (dotted.length < 2) return null;

    const first = dotted[0];
    const last = dotted[dotted.length - 1];
    const firstY = offsets[first.key];
    const lastY = offsets[last.key];
    if (firstY === undefined || lastY === undefined) return null;

    const top = firstY + (DOT_CENTER[first.kind] ?? DOT_CENTER.card) + RAIL_CLEARANCE;
    const bottom = lastY + (DOT_CENTER[last.kind] ?? DOT_CENTER.card) - RAIL_CLEARANCE;
    const height = bottom - top;
    const pitch = SEGMENT_LEN + SEGMENT_GAP;
    if (height < pitch) return null;

    return { top, height, count: Math.floor((height + SEGMENT_GAP) / pitch) };
  }, [rows, offsets]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.listContent,
        { paddingTop: ROW_GAP + topInset, paddingBottom: dockClearance },
      ]}>
      <View style={styles.stack}>
        {rail ? (
          <View pointerEvents="none" style={[styles.rail, { top: rail.top, height: rail.height }]}>
            {Array.from({ length: rail.count }, (_, index) => (
              <View key={index} style={styles.segment} />
            ))}
          </View>
        ) : null}

        {rows.map((row) => (
          <View key={row.key} onLayout={handleRowLayout(row.key)}>
            <MemoRow row={row} onPressIntervention={onPressIntervention} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

type TimelineStyles = ReturnType<typeof createStyles>;

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    // The top padding is applied inline: `ROW_GAP` — the same unit as the gap
    // between rows, so the air above the first card equals the air between
    // every card after it — plus the height of the composition the day scrolls
    // behind.
    listContent: {
      paddingHorizontal: LIST_PADDING_H,
    },
    // The rows and the rail share one coordinate space; the rail is the first
    // child so every marker paints over it, and each dot form carries a ring
    // in the paper's own colour — that is what breaks the rhythm cleanly
    // around a dot instead of stopping it short of one.
    stack: {
      position: 'relative',
    },
    row: {
      flexDirection: 'row',
    },
    gutter: {
      width: GUTTER_WIDTH,
    },
    // The day's spine: short marks at a fixed pitch, running the whole day
    // from the first marker to the last. Never a continuous line — a bar down
    // the side of the screen competes with the cards; a rhythm does not.
    rail: {
      position: 'absolute',
      left: (GUTTER_WIDTH - RAIL_WEIGHT) / 2,
      width: RAIL_WEIGHT,
      alignItems: 'center',
      justifyContent: 'center',
      gap: SEGMENT_GAP,
    },
    segment: {
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
