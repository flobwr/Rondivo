import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItemInfo, StyleSheet, Text, View } from 'react-native';

import { createThemedStyles, Palette } from '@/theme';
import { useTheme } from '@/contexts/theme';
import { useBottomDockClearance } from '@/components/ui/BottomDock';
import { openMapsTo } from '@/utils/openMaps';
import { InterventionCard } from './InterventionCard';
import { getStatusMeta, formatTime } from './status';
import {
  BRANCH_LEN,
  DOT_CENTER,
  GUTTER_WIDTH,
  LIST_PADDING_H,
  NOW_ROW_HEIGHT,
  ROW_GAP,
} from './timeline-metrics';
import { TravelLink } from './TravelLink';
import { BreakSlot, DayItem, Intervention, InterventionStatus, TravelLeg } from './types';

type Props = {
  items: DayItem[];
  /** minutes since midnight on a live day — places the "Maintenant" marker */
  nowMin?: number;
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
function BeaconDot({ color }: { color: string }) {
  return (
    <View style={styles.beaconWrapper}>
      <View style={[styles.beaconHalo, { backgroundColor: color }]} />
      <View style={[styles.beaconCore, { backgroundColor: color }]} />
    </View>
  );
}

function StatusDot({ status }: { status: InterventionStatus }) {
  const { palette } = useTheme();
  const meta = getStatusMeta(palette)[status];

  if (meta.dot === 'pulse') return <BeaconDot color={meta.color} />;

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
  const dotCenter = DOT_CENTER[row.kind] ?? 28;
  const rowStyle = [styles.row, !row.isLastRow ? { paddingBottom: ROW_GAP } : null];
  const segment = row.showSegment ? <View style={styles.segment} /> : null;

  const dotAnchor = (child: React.ReactNode) => (
    <View style={[styles.dotAnchor, { top: dotCenter - 13 }]}>{child}</View>
  );
  // The short horizontal hand-off from a dot to its row's content — every
  // dotted row (card / break / now) gets one; travel rows stay dot-less and
  // branch-less, the capsule alone carrying the sequence.
  const branch = <View style={[styles.branch, { top: dotCenter - 1 }]} />;

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
            <Text style={styles.nowTime}>{row.timeLabel}</Text>
          </View>
          {segment}
        </View>
      );

    case 'card':
      return (
        <View style={rowStyle}>
          <View style={styles.gutter}>{dotAnchor(<StatusDot status={row.intervention.status} />)}</View>
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
                <Feather name="coffee" size={9} color={Palette.textSecondary} />
              </View>
            )}
          </View>
          <View style={styles.breakContent}>
            {branch}
            <Text style={styles.breakLabel}>{row.brk.label}</Text>
            <Text style={styles.breakTime}>
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

export function Timeline({ items, nowMin }: Props) {
  const router = useRouter();
  const dockClearance = useBottomDockClearance(0);

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
    ({ item }: ListRenderItemInfo<PositionedRow>) => <MemoRow row={item} onPressIntervention={onPressIntervention} />,
    [onPressIntervention]
  );
  const keyExtractor = useCallback((row: PositionedRow) => row.key, []);

  return (
    <FlatList
      data={rows}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.listContent, { paddingBottom: dockClearance }]}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
    />
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  listContent: {
    paddingHorizontal: LIST_PADDING_H,
    paddingTop: 32,
  },
  row: {
    flexDirection: 'row',
  },
  gutter: {
    width: GUTTER_WIDTH,
  },
  // A small discrete tick — never a rail — bridging two back-to-back dotted
  // rows. Centred in the row's own bottom gap, well clear of both dots.
  segment: {
    position: 'absolute',
    left: GUTTER_WIDTH / 2 - 1,
    bottom: (ROW_GAP - 10) / 2,
    width: 2,
    height: 10,
    borderRadius: 1,
    backgroundColor: Palette.insetDeep,
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
    height: 2,
    borderRadius: 1,
    backgroundColor: Palette.insetDeep,
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
    borderColor: Palette.insetDeep,
  },
  beaconWrapper: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beaconHalo: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    // Held at the low end of what the pulse used to reach, so the beacon reads
    // as a halo rather than a second, heavier dot.
    opacity: 0.22,
  },
  beaconCore: {
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
    backgroundColor: Palette.inset,
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
    position: 'relative',
    paddingLeft: BRANCH_LEN,
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
    position: 'relative',
    paddingLeft: BRANCH_LEN,
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
}));
