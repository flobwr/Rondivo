import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { STATUS_META } from './status';
import { BreakSlot, DayItem, Intervention } from './types';

// ── Compact intervention row ──────────────────────────────────────────────────
// Past, cancelled and postponed jobs don't deserve a full card: one quiet line
// keeps the day scannable. Tapping still opens the detail (future: historique).

type CompactRowProps = {
  intervention: Intervention;
  /** show the small status glyph inline (used inside the past group, which has no rail dots) */
  showGlyph?: boolean;
  onPress?: () => void;
};

function CompactRowBase({ intervention, showGlyph, onPress }: CompactRowProps) {
  const meta = STATUS_META[intervention.status];
  const cancelled = intervention.status === 'cancelled';
  const showLabel = intervention.status === 'postponed' || intervention.status === 'cancelled';

  return (
    <Pressable style={styles.compactRow} onPress={onPress}>
      {showGlyph ? (
        <View style={[styles.glyph, { backgroundColor: meta.soft }]}>
          <Feather name={meta.dotIcon ?? 'check'} size={9} color={meta.color} />
        </View>
      ) : null}
      <Text style={styles.compactTime}>{intervention.start}</Text>
      <Text
        style={[styles.compactClient, cancelled ? styles.compactClientCancelled : null]}
        numberOfLines={1}>
        {intervention.client}
      </Text>
      {showLabel ? (
        <Text style={[styles.compactStatus, { color: meta.color }]}>{meta.label}</Text>
      ) : null}
    </Pressable>
  );
}

export const CompactRow = memo(CompactRowBase);

// ── Past group ────────────────────────────────────────────────────────────────
// Everything already behind the artisan collapses into one line so the screen
// always opens on what's next. Expands for the recap (future: historique).

type PastGroupProps = {
  items: DayItem[];
};

function PastGroupBase({ items }: PastGroupProps) {
  const [expanded, setExpanded] = useState(false);

  const interventions = items.filter(
    (i): i is Extract<DayItem, { kind: 'intervention' }> => i.kind === 'intervention'
  );
  const doneCount = interventions.filter((i) => i.data.status === 'done').length;
  const cancelledCount = interventions.filter((i) => i.data.status === 'cancelled').length;

  let label = `${doneCount} intervention${doneCount > 1 ? 's' : ''} terminée${doneCount > 1 ? 's' : ''}`;
  if (cancelledCount > 0) {
    label += ` · ${cancelledCount} annulée${cancelledCount > 1 ? 's' : ''}`;
  }

  const toggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((e) => !e);
  };

  return (
    <View>
      <Pressable style={styles.groupHeader} onPress={toggle}>
        <Text style={styles.groupLabel}>{label}</Text>
        <Feather
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={Palette.textTertiary}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.groupBody}>
          {items.map((item) => {
            if (item.kind === 'intervention') {
              return <CompactRow key={item.data.id} intervention={item.data} showGlyph />;
            }
            if (item.kind === 'break') {
              return <BreakRow key={item.data.id} brk={item.data} inset />;
            }
            return null; // driven travel legs are noise once the day has moved on
          })}
        </View>
      ) : null}
    </View>
  );
}

export const PastGroup = memo(PastGroupBase);

// ── Break row ─────────────────────────────────────────────────────────────────

type BreakRowProps = {
  brk: BreakSlot;
  /** rendered inside the past group (no rail dot next to it) */
  inset?: boolean;
};

function BreakRowBase({ brk, inset }: BreakRowProps) {
  return (
    <View style={styles.breakRow}>
      {inset ? (
        <View style={styles.glyphNeutral}>
          <Feather name="coffee" size={9} color={Palette.textSecondary} />
        </View>
      ) : null}
      <Text style={styles.breakLabel}>{brk.label}</Text>
      <Text style={styles.breakTime}>
        {brk.start} – {brk.end}
      </Text>
    </View>
  );
}

export const BreakRow = memo(BreakRowBase);

const styles = StyleSheet.create({
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 38,
  },
  glyph: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glyphNeutral: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F1F3F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactTime: {
    width: 42,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
    fontVariant: ['tabular-nums'],
  },
  compactClient: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.2,
  },
  compactClientCancelled: {
    color: Palette.textTertiary,
    textDecorationLine: 'line-through',
  },
  compactStatus: {
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 38,
  },
  groupLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.2,
  },
  groupBody: {
    paddingBottom: 2,
  },
  breakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 34,
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
