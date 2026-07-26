import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { createThemedStyles, glowShadow, Palette, PressScale, SettleSpring, Spacing } from '@/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import { CalendarDay } from './types';

/**
 * The week, laid straight onto the page.
 *
 * There is deliberately NO container here — no card, no capsule, no track,
 * no rectangle of any kind. The day name, the date and the activity dot sit
 * directly on the app's paper, and the only thing that ever breaks that
 * surface is the round pill under the selected date. Adding a background
 * behind this strip would undo the whole composition.
 */
const CELL_WIDTH = 62;
const CELL_GAP = 14;
/** Diameter of the selected day's disc — a true circle, not a rounded box. */
const DISC = 48;

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
    outputRange: [`${Palette.blue}00`, Palette.blue],
  });
  const discScale = sel.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.06, 1],
  });
  // The selected day's NAME turns blue while its number goes onAccent inside
  // the disc — exactly the two-tone treatment in the reference.
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textSecondary, Palette.blue],
  });
  // `onAccent`, not white: on the dark papers Bleu Rondivo lightens to a
  // tint where white would fail contrast — onAccent flips dark to stay legible.
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textPrimary, Palette.onAccent],
  });
  const dotColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.insetDeep, Palette.blue],
  });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`${day.dayLabel} ${day.date}`}>
      <Animated.View style={[styles.cell, { transform: [{ scale: pressScale }] }]}>
        <Animated.Text style={[styles.dayLabel, { color: labelColor }]}>
          {day.dayLabel}
        </Animated.Text>

        <Animated.View
          style={[
            styles.disc,
            selected ? glowShadow : null,
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

export function DayStrip({ days, selectedIndex, onSelectDay }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const viewportW = useRef(Dimensions.get('window').width);

  // Keep the selected day centred horizontally on every change.
  useEffect(() => {
    const cellCenter = Spacing.screen + selectedIndex * (CELL_WIDTH + CELL_GAP) + CELL_WIDTH / 2;
    const x = Math.max(0, cellCenter - viewportW.current / 2);
    scrollRef.current?.scrollTo({ x, animated: true });
  }, [selectedIndex]);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      style={styles.strip}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      onLayout={(e: LayoutChangeEvent) => {
        viewportW.current = e.nativeEvent.layout.width;
      }}
      contentContainerStyle={styles.scrollContent}>
      {days.map((day, index) => (
        <DayCell
          key={`${day.dayLabel}-${day.date}`}
          day={day}
          selected={index === selectedIndex}
          onPress={() => onSelectDay(index)}
        />
      ))}
    </ScrollView>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  strip: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    // Vertical room for the selected disc's glow to fall without being
    // clipped by the ScrollView.
    paddingVertical: Spacing.sm,
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 13.5,
    fontWeight: '500',
    letterSpacing: -0.1,
    marginBottom: 10,
  },
  disc: {
    width: DISC,
    height: DISC,
    borderRadius: DISC / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    fontVariant: ['tabular-nums'],
  },
  dotSlot: {
    height: 6,
    marginTop: 10,
    justifyContent: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
}));
