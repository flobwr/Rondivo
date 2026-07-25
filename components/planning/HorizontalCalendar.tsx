import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { BorderWidth, Overlay, Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { usePressScale } from '@/hooks/use-press-scale';
import { CalendarDay } from './types';

// Cell width and the card's own horizontal padding — the whole strip lives
// inside one soft-layer card so the calendar reads as a single component,
// not a row of independent day pills floating on the screen.
const CELL_WIDTH = 46;
const CARD_PAD_H = 8;

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
  const { scale: pressScale, onPressIn: handlePressIn, onPressOut: handlePressOut } = usePressScale({
    to: 0.92,
  });
  // Single animated value drives the whole selected/unselected crossfade so the
  // highlight appears to glide from one day to the next.
  const sel = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(sel, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false, // animating colours
      friction: 8,
      tension: 140,
    }).start();
  }, [selected, sel]);

  const baseDot = day.hasUrgent ? Palette.orange : day.hasAppointments ? Palette.blue : null;

  // The whole cell — not just the date number — becomes the selection surface,
  // so a selected day reads as one integrated shape instead of a bubble
  // floating inside a separate cell.
  const cellBg = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Overlay.blueTransparent, Palette.blue],
  });
  const cellScale = sel.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.05, 1] });
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textTertiary, Palette.white],
  });
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textPrimary, Palette.white],
  });
  const dotColor = baseDot
    ? sel.interpolate({ inputRange: [0, 1], outputRange: [baseDot, Palette.white] })
    : undefined;

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.cell,
          { backgroundColor: cellBg, transform: [{ scale: Animated.multiply(pressScale, cellScale) }] },
        ]}>
        <Animated.Text style={[styles.dayLabel, { color: labelColor }]}>{day.dayLabel}</Animated.Text>
        <Animated.Text style={[styles.dateNumber, { color: numberColor }]}>{day.date}</Animated.Text>

        <View style={styles.dotRow}>
          {dotColor ? (
            <Animated.View style={[styles.dot, { backgroundColor: dotColor }]} />
          ) : (
            <View style={styles.dotPlaceholder} />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function HorizontalCalendar({ days, selectedIndex, onSelectDay }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const viewportW = useRef(Dimensions.get('window').width);

  // Keep the selected day centred horizontally on every change.
  useEffect(() => {
    const cellCenter = CARD_PAD_H + selectedIndex * CELL_WIDTH + CELL_WIDTH / 2;
    const x = Math.max(0, cellCenter - viewportW.current / 2);
    scrollRef.current?.scrollTo({ x, animated: true });
  }, [selectedIndex]);

  return (
    <View style={styles.card}>
      <ScrollView
        ref={scrollRef}
        horizontal
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
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.screen,
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.card,
    backgroundColor: Palette.card,
    borderWidth: BorderWidth.thin,
    borderColor: Palette.border,
    paddingVertical: 12,
    ...actionShadow,
  },
  scrollContent: {
    paddingHorizontal: CARD_PAD_H,
  },
  cell: {
    width: CELL_WIDTH,
    borderRadius: Radius.tile,
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  dotRow: {
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
  },
});
