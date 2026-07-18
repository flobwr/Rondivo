import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet } from 'react-native';

import { actionShadow, Palette, Spacing } from '@/theme';
import { CalendarDay } from './types';

// Tall pill cards straight from the reference: day name on top, big date
// number below, selected day filled with the brand blue.
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
  const pressScale = useRef(new Animated.Value(1)).current;
  // One animated value drives the whole crossfade so the blue pill appears to
  // glide from one day to the next.
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
    Animated.spring(pressScale, { toValue: 0.93, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const pillBg = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.card, Palette.blue],
  });
  const pillScale = sel.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.04, 1],
  });
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textSecondary, 'rgba(255,255,255,0.85)'],
  });
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textPrimary, Palette.white],
  });

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Animated.View
          style={[styles.cell, { backgroundColor: pillBg, transform: [{ scale: pillScale }] }]}>
          <Animated.Text style={[styles.dayLabel, { color: labelColor }]}>{day.dayLabel}</Animated.Text>
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

const styles = StyleSheet.create({
  strip: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 16,
    paddingBottom: 28,
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_WIDTH,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: 15,
    ...actionShadow,
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
});
