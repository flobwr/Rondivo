import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { Shimmer } from '@/components/ui/Shimmer';
import { useTheme } from '@/contexts/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import {
  getElevation,
  Numeric,
  PressScale,
  Radius,
  SettleSpring,
  Size,
  Spacing,
  Type,
  type PaletteShape,
} from '@/theme';
import { CalendarDay } from './types';

/**
 * The week, laid straight onto the page.
 *
 * There is deliberately NO container here — no card, no capsule, no track,
 * no rectangle of any kind. The day name, the date and the activity dot sit
 * directly on the app's paper, and the only thing that ever breaks that
 * surface is the round disc under the selected date. Adding a background
 * behind this strip would undo the whole composition.
 *
 * It does not scroll either. A week is seven columns and the screen is wide
 * enough for seven columns, so they divide the gutter-to-gutter width evenly:
 * the strip ends exactly where the masthead's title starts and ends, which is
 * what makes the calendar read as part of the page rather than a widget
 * parked on it. A horizontally scrolling strip could only ever show five of
 * the seven days, which reads as a cropped week.
 */

/** How many day columns the strip lays out while its week is still loading. */
const WEEK = 7;

type Props = {
  days: CalendarDay[];
  selectedIndex: number;
  onSelectDay: (index: number) => void;
};

function DayCell({
  day,
  selected,
  onPress,
}: {
  day: CalendarDay;
  selected: boolean;
  onPress: () => void;
}) {
  const { palette, resolvedTheme } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);
  const elevation = getElevation(resolvedTheme);
  const {
    scale: pressScale,
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  } = usePressScale({ to: PressScale.icon });
  // One animated value drives the whole crossfade so the blue disc appears to
  // glide from one day to the next. A spring, not a curve: the selection
  // follows the finger.
  const sel = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(sel, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false, // animating colours
      ...SettleSpring,
    }).start();
  }, [selected, sel]);

  // Crossfades from a fully transparent version of the same ink to solid
  // blue — unselected days carry no fill at all, so a hue-only interpolation
  // (e.g. card → blue) would flash a visible disc on the very first frame.
  const discBg = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [`${palette.blue}00`, palette.blue],
  });
  const discScale = sel.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.06, 1],
  });
  // The selected day's NAME turns blue while its number goes onAccent inside
  // the disc — exactly the two-tone treatment in the reference.
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.textSecondary, palette.blue],
  });
  // `onAccent`, not white: on the dark papers Bleu Rondivo lightens to a
  // tint where white would fail contrast — onAccent flips dark to stay legible.
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.textPrimary, palette.onAccent],
  });
  const dotColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.insetDeep, palette.blue],
  });

  return (
    <Pressable
      style={styles.cell}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${day.dayLabel} ${day.date}`}>
      <Animated.View style={[styles.cellInner, { transform: [{ scale: pressScale }] }]}>
        <Animated.Text style={[styles.dayLabel, { color: labelColor }]}>
          {day.dayLabel}
        </Animated.Text>

        <Animated.View
          style={[
            styles.disc,
            // The selected disc carries the same whisper of lift as every
            // other round control in the app — Home's wells, Home's itinerary
            // button. No brand-coloured halo: a blue surface casts the same
            // light as a white one.
            selected ? elevation.whisper : null,
            { backgroundColor: discBg, transform: [{ scale: discScale }] },
          ]}>
          <Animated.Text style={[styles.dateNumber, { color: numberColor }]}>
            {day.date}
          </Animated.Text>
        </Animated.View>

        {/* Activity dot — present only on days that actually hold work, so
            the row of dots reads as information, not decoration. The empty
            view keeps every cell the same height either way. */}
        <View style={styles.dotSlot}>
          {day.hasInterventions ? (
            <Animated.View style={[styles.dot, { backgroundColor: dotColor }]} />
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

/** The strip's own silhouette while the week loads — same grid, no content. */
function DayCellSkeleton() {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.cell}>
      <View style={styles.cellInner}>
        <Shimmer style={styles.labelSkeleton} />
        <Shimmer style={styles.disc} />
        <View style={styles.dotSlot} />
      </View>
    </View>
  );
}

export function DayStrip({ days, selectedIndex, onSelectDay }: Props) {
  const { palette } = useTheme();
  const styles = useMemo(() => createStyles(palette), [palette]);

  return (
    <View style={styles.strip}>
      {days.length === 0
        ? Array.from({ length: WEEK }, (_, i) => <DayCellSkeleton key={i} />)
        : days.map((day, index) => (
            <DayCell
              key={`${day.dayLabel}-${day.date}`}
              day={day}
              selected={index === selectedIndex}
              onPress={() => onSelectDay(index)}
            />
          ))}
    </View>
  );
}

function createStyles(palette: PaletteShape) {
  return StyleSheet.create({
    strip: {
      flexDirection: 'row',
      // The same gutter as the masthead and the timeline: one vertical axis
      // runs down the whole screen.
      paddingHorizontal: Spacing.screen,
    },
    cell: {
      flex: 1,
    },
    cellInner: {
      alignItems: 'center',
    },
    dayLabel: {
      ...Type.footnote,
      fontWeight: '500',
      marginBottom: Spacing.sm,
    },
    labelSkeleton: {
      width: 26,
      height: 10,
      borderRadius: 5,
      marginTop: 4,
      marginBottom: Spacing.md,
    },
    disc: {
      width: Size.well,
      height: Size.well,
      borderRadius: Radius.pill,
      alignItems: 'center',
      justifyContent: 'center',
    },
    dateNumber: {
      ...Type.heading,
      fontWeight: '700',
      ...Numeric,
    },
    dotSlot: {
      height: 5,
      marginTop: Spacing.sm,
      justifyContent: 'center',
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: Radius.pill,
    },
  });
}
