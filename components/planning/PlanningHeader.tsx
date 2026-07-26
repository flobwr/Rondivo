import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { useTheme } from '@/contexts/theme';
import {
  getElevation,
  Numeric,
  PressScale,
  Radius,
  Size,
  Spacing,
  Type,
  type PaletteShape,
} from '@/theme';

type Props = {
  /** The month the week belongs to — e.g. "Juillet 2026". */
  monthLabel: string;
  /** The one grounding fact about the selected day. Never a second title. */
  summary: string;
  loading?: boolean;
  onAdd?: () => void;
};

/** Diameter of the small "+" badge cut into the action disc. */
const BADGE = 18;
const BADGE_RING = 2;

/**
 * Where the badge sits on the disc — derived, not eyeballed.
 *
 * Home's notification badge rides its well with its centre at 1.043 × the
 * well's radius, on the 45° diagonal: astride the edge, most of it outside,
 * its paper ring cutting a clean notch. Reproducing that RATIO (rather than
 * copying Home's `-3`) is what makes a badge read as belonging to its disc
 * instead of stuck onto it, at any disc size.
 */
const BADGE_ORBIT = 1.043;
const BADGE_INSET = Math.round(
  ((Size.roundAction / 2) * BADGE_ORBIT) / Math.SQRT2 + BADGE / 2 - Size.roundAction / 2
);

/**
 * The add action, in the same object family as Home's itinerary button: one
 * perfectly round Bleu Rondivo disc at `Size.roundAction`, lifted on the
 * shared `whisper` tier — the same light every other control on the paper
 * casts. The glyph is a filled calendar rather than a bare "+", and the "+"
 * itself is a badge cut into the disc with a paper-coloured ring, the same
 * vocabulary as Home's notification count.
 */
function AddInterventionWell({ onPress }: { onPress?: () => void }) {
  const { palette, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(resolvedTheme);

  return (
    <PressableScale
      onPress={onPress}
      to={PressScale.control}
      accessibilityLabel="Ajouter une intervention"
      style={[styles.action, elevation.whisper]}>
      <Feather name="calendar" size={20} color={palette.onAccent} />
      <View style={styles.badge}>
        <Feather name="plus" size={11} color={palette.blue} />
      </View>
    </PressableScale>
  );
}

/**
 * Planning's masthead — the same composition as Home's, part for part.
 *
 * Home is: one title in `Type.masthead`, one grounding line under it, one
 * round action beside it, all on bare paper. Planning is now the same three
 * parts with the same metrics — the month where the greeting is, the day's
 * one fact where the status line is, the add action where the wells are.
 * That is what makes the two screens read as one app; the month used to be a
 * 44 pt all-caps slab, which is a different typographic species from
 * anything else in Rondivo.
 *
 * There is deliberately no eyebrow: the month IS the title, and a small
 * "PLANNING" above it would only label a screen the dock already names.
 */
export function PlanningHeader({ monthLabel, summary, loading = false, onAdd }: Props) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.row}>
      <View style={styles.texts}>
        {loading ? (
          <>
            <SkeletonBlock height={30} radius={10} style={styles.titleSkeleton} />
            <SkeletonBlock height={14} radius={6} style={styles.summarySkeleton} />
          </>
        ) : (
          <>
            <Text
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}>
              {monthLabel}
            </Text>
            <Text style={styles.summary} numberOfLines={1}>
              {summary}
            </Text>
          </>
        )}
      </View>

      <AddInterventionWell onPress={onAdd} />
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.md,
      paddingHorizontal: Spacing.screen,
      paddingTop: Spacing.lg,
      paddingBottom: Spacing.lg,
    },
    texts: {
      flex: 1,
    },
    title: {
      ...Type.masthead,
      color: palette.textPrimary,
    },
    // Same slot, same offset as Home's status line: one fact, never a tally
    // of everything on the screen.
    summary: {
      ...Type.subhead,
      color: palette.textSecondary,
      marginTop: 6,
      ...Numeric,
    },
    // Sized to occupy exactly the two text slots above (40 + 26), so nothing
    // moves when the real month lands.
    titleSkeleton: {
      width: '62%',
      marginTop: 5,
      marginBottom: 5,
    },
    summarySkeleton: {
      width: '40%',
      marginTop: 9,
      marginBottom: 3,
    },
    action: {
      width: Size.roundAction,
      height: Size.roundAction,
      borderRadius: Radius.pill,
      backgroundColor: palette.blue,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badge: {
      position: 'absolute',
      bottom: -BADGE_INSET,
      right: -BADGE_INSET,
      width: BADGE,
      height: BADGE,
      borderRadius: Radius.pill,
      borderWidth: BADGE_RING,
      borderColor: palette.screen,
      backgroundColor: palette.float,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
