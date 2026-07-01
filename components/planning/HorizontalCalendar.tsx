import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { CalendarDay } from './types';

const CELL_WIDTH = 50;
const SCROLL_PAD = Spacing.screen - 5;

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
  const pressScale = useRef(new Animated.Value(1)).current;
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

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.92, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const baseDot = day.hasUrgent ? Palette.orange : day.hasAppointments ? Palette.blue : null;

  const bubbleBg = sel.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(37, 99, 235, 0)', Palette.blue],
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
  // The label sits above the bubble on the screen background, not inside it —
  // unlike the date number, it must never crossfade to white or it disappears.
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textTertiary, Palette.textPrimary],
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
          style={[styles.dateBubble, { backgroundColor: bubbleBg, transform: [{ scale: bubbleScale }] }]}>
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
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen - 5,
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  dateBubble: {
    width: 40,
    height: 40,
    borderRadius: 14,
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
    marginTop: 5,
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
