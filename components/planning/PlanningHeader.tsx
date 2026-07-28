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
  /** The selected day, written out — "MERCREDI 1 JUILLET". Home's date slot. */
  eyebrow: string;
  /** The month the week belongs to — e.g. "Juillet 2026". */
  monthLabel: string;
  /** The one grounding fact about the selected day. Never a second title. */
  summary: string;
  loading?: boolean;
  onAdd?: () => void;
};

/**
 * The add action — the same object as Home's itinerary button, at the same
 * size, on the same paper, casting the same light.
 *
 * One glyph, optically centred, and nothing else. It used to be a calendar
 * with a small "+" badge cut into the edge of the disc: two shapes competing
 * beside a 34 pt masthead, and the badge read as stuck ONTO the disc rather
 * than as part of it. A round action in Rondivo carries exactly one mark —
 * Home's itinerary disc carries an arrow, this one carries a plus.
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
      // `whisper` — the tier every round control in the app sits on, Home's
      // itinerary button included. Same depth, same light, same object family.
      style={[styles.action, elevation.whisper]}>
      {/* 22, where Home's arrow is 19: Feather's plus fills its whole box
          while the navigation glyph fills about four fifths of its own, so
          matching the numbers would leave the two discs looking differently
          weighted. Matched optically, not numerically. */}
      <Feather name="plus" size={22} color={palette.onAccent} />
    </PressableScale>
  );
}

/**
 * Planning's masthead — Home's composition, part for part.
 *
 * Home is: a small-caps date eyebrow with the round controls beside it, then
 * the day's headline in the largest type on the screen, then ONE grounding
 * line. Planning is now the same three parts at the same metrics — the
 * selected day where the date is, the month where the greeting is, the day's
 * one fact where the status line is, the add action where the wells are.
 *
 * That structure is the point. A masthead is not a big word: it is a headline
 * that has something small above it and something small under it, with air
 * measured from Home. Set on its own with an action floating beside it, the
 * month read as one very large piece of text rather than as the top of a page.
 *
 * There is deliberately no "PLANNING" eyebrow: the month IS the title, and a
 * label above it would only name a screen the dock already names.
 */
export function PlanningHeader({
  eyebrow,
  monthLabel,
  summary,
  loading = false,
  onAdd,
}: Props) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {loading ? (
          <SkeletonBlock height={12} radius={6} style={styles.eyebrowSkeleton} />
        ) : (
          <Text style={styles.eyebrow} numberOfLines={1}>
            {eyebrow}
          </Text>
        )}

        <AddInterventionWell onPress={onAdd} />
      </View>

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
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.screen,
      paddingTop: Spacing.lg,
      // The same air Home puts between its masthead and the first thing under
      // it — the week is a section of this page, not a strip bolted to the
      // title.
      paddingBottom: Spacing.section,
    },
    // Home's eyebrow row, to the token: the date on the left, the round
    // control(s) on the right, vertically centred on each other.
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: Spacing.md,
    },
    eyebrow: {
      ...Type.caption,
      flexShrink: 1,
      color: palette.textTertiary,
      fontWeight: '700',
      letterSpacing: 1.4,
      ...Numeric,
    },
    // The masthead ramp is shared with Home's greeting — see `Type.masthead`.
    // 18 above it and 6 under it are Home's own numbers, not new ones.
    title: {
      ...Type.masthead,
      color: palette.textPrimary,
      marginTop: 18,
    },
    summary: {
      ...Type.subhead,
      color: palette.textSecondary,
      marginTop: 6,
      ...Numeric,
    },
    // Each skeleton occupies exactly its real slot, so nothing moves when the
    // week lands.
    eyebrowSkeleton: {
      width: '46%',
      marginVertical: 4,
    },
    titleSkeleton: {
      width: '62%',
      marginTop: 23,
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
  });
}
