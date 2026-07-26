import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet } from 'react-native';

import { createThemedStyles, Palette, PressScale, SettleSpring, Spacing } from '@/theme';
import { usePressScale } from '@/hooks/use-press-scale';
import { CalendarDay } from './types';

// Tall pill cells straight from the reference: day name on top, big date
// number below, selected day filled with the brand blue. No enclosing card —
// the strip floats directly on the header's paper, straight under the large
// title, with only the selected pill breaking the surface.
const CELL_WIDTH = 66;
const CELL_GAP = 10;

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
  // One animated value drives the whole crossfade so the blue pill appears to
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

  const pillBg = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.card, Palette.blue],
  });
  const pillScale = sel.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.04, 1],
  });
  // Selected text uses `onAccent`, not white: on the dark papers Bleu Rondivo
  // lightens to a tint, where white would fail contrast — onAccent flips dark
  // to stay legible on the pill.
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textSecondary, Palette.onAccent],
  });
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textPrimary, Palette.onAccent],
  });
  // The day name stays a touch quieter than the date on the selected pill.
  const labelOpacity = sel.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Animated.View
          style={[styles.cell, { backgroundColor: pillBg, transform: [{ scale: pillScale }] }]}>
          <Animated.Text style={[styles.dayLabel, { color: labelColor, opacity: labelOpacity }]}>{day.dayLabel}</Animated.Text>
          <Animated.Text style={[styles.dateNumber, { color: numberColor }]}>{day.date}</Animated.Text>
        </Animated.View>
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
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingVertical: 4,
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_WIDTH,
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  dayLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 4,
  },
}));
