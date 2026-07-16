import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { CalendarDay } from './types';

// Tall pill cards, straight from both references: day label on top, big date
// number, then up to three workload dots so a full day is visible at a glance.
const CELL_WIDTH = 56;
const CELL_GAP = 8;

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
    outputRange: [Palette.textTertiary, 'rgba(255,255,255,0.8)'],
  });
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textPrimary, Palette.white],
  });

  const dots = Math.min(day.count, 3);

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Animated.View style={[styles.cell, { backgroundColor: pillBg, transform: [{ scale: pillScale }] }]}>
          <Animated.Text style={[styles.dayLabel, { color: labelColor }]}>{day.dayLabel}</Animated.Text>
          <Animated.Text style={[styles.dateNumber, { color: numberColor }]}>{day.date}</Animated.Text>

          <View style={styles.dotRow}>
            {dots === 0 ? (
              <View style={styles.dotPlaceholder} />
            ) : (
              Array.from({ length: dots }).map((_, i) => {
                const urgent = day.hasUrgent && i === 0;
                const dotColor = sel.interpolate({
                  inputRange: [0, 1],
                  outputRange: [urgent ? Palette.red : Palette.blue, Palette.white],
                });
                return <Animated.View key={i} style={[styles.dot, { backgroundColor: dotColor }]} />;
              })
            )}
          </View>
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
    paddingVertical: 14,
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_WIDTH,
    borderRadius: 20,
    alignItems: 'center',
    paddingTop: 11,
    paddingBottom: 9,
    ...actionShadow,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  dateNumber: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 3,
  },
  dotRow: {
    flexDirection: 'row',
    gap: 3,
    height: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  dotPlaceholder: {
    width: 4,
    height: 4,
  },
});
