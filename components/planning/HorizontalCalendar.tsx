import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FontSize, Overlay, Palette, Spacing } from '@/constants/design';
import { bubbleShadow } from '@/constants/shadow';
import { usePressScale } from '@/hooks/use-press-scale';
import { CalendarDay } from './types';

const CELL_WIDTH = 58;
const SCROLL_PAD = Spacing.screen - 8;

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
  // blue bubble appears to glide from one day to the next.
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

  const bubbleBg = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Overlay.blueTransparent, Palette.blue],
  });
  // subtle spring pop while the selection settles
  const bubbleScale = sel.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.07, 1],
  });
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textPrimary, Palette.white],
  });
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textTertiary, Palette.white],
  });
  const dotColor = baseDot
    ? sel.interpolate({ inputRange: [0, 1], outputRange: [baseDot, Palette.white] })
    : undefined;

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      {/* outer: native press scale */}
      <Animated.View style={[styles.cell, { transform: [{ scale: pressScale }] }]}>
        <Animated.Text style={[styles.dayLabel, { color: labelColor }]}>
          {day.dayLabel}
        </Animated.Text>

        {/* inner: JS-driven colour crossfade + spring pop */}
        <Animated.View
          style={[
            styles.dateBubble,
            selected ? bubbleShadow : null,
            { backgroundColor: bubbleBg, transform: [{ scale: bubbleScale }] },
          ]}>
          <Animated.Text style={[styles.dateNumber, { color: numberColor }]}>
            {day.date}
          </Animated.Text>
        </Animated.View>

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
    const cellCenter = SCROLL_PAD + selectedIndex * CELL_WIDTH + CELL_WIDTH / 2;
    const x = Math.max(0, cellCenter - viewportW.current / 2);
    scrollRef.current?.scrollTo({ x, animated: true });
  }, [selectedIndex]);

  return (
    <View style={styles.wrapper}>
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
  wrapper: {
    paddingTop: 22,
    paddingBottom: 22,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen - 8,
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  dateBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: FontSize.body,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  dotRow: {
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 9,
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
