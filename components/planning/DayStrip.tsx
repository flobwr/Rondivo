import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { CalendarDay } from './types';

// Tall pill cards: day label on top, big date number, then up to three
// workload dots so a full day is visible at a glance. When the timeline
// scrolls, the strip compacts (dots fold away) to give the day more room.
const CELL_WIDTH = 56;
const CELL_GAP = 8;

type Props = {
  days: CalendarDay[];
  selectedIndex: number;
  onSelectDay: (index: number) => void;
  /** collapses the strip while the timeline is scrolled */
  compact?: boolean;
};

function DayCell({
  day,
  selected,
  compactValue,
  onPress,
}: {
  day: CalendarDay;
  selected: boolean;
  compactValue: Animated.Value;
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

  const padTop = compactValue.interpolate({ inputRange: [0, 1], outputRange: [11, 8] });
  const padBottom = compactValue.interpolate({ inputRange: [0, 1], outputRange: [9, 8] });
  const dotsHeight = compactValue.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const dotsOpacity = compactValue.interpolate({ inputRange: [0, 0.6, 1], outputRange: [1, 0, 0] });

  const dots = Math.min(day.count, 3);

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Animated.View
          style={[
            styles.cell,
            {
              backgroundColor: pillBg,
              paddingTop: padTop,
              paddingBottom: padBottom,
              transform: [{ scale: pillScale }],
            },
          ]}>
          <Animated.Text style={[styles.dayLabel, { color: labelColor }]}>{day.dayLabel}</Animated.Text>
          <Animated.Text style={[styles.dateNumber, { color: numberColor }]}>{day.date}</Animated.Text>

          <Animated.View style={[styles.dotRow, { height: dotsHeight, opacity: dotsOpacity }]}>
            {dots > 0
              ? Array.from({ length: dots }).map((_, i) => {
                  const dotColor = sel.interpolate({
                    inputRange: [0, 1],
                    outputRange: [Palette.blue, Palette.white],
                  });
                  return <Animated.View key={i} style={[styles.dot, { backgroundColor: dotColor }]} />;
                })
              : null}
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}

export function DayStrip({ days, selectedIndex, onSelectDay, compact = false }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const viewportW = useRef(Dimensions.get('window').width);
  const compactValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(compactValue, {
      toValue: compact ? 1 : 0,
      useNativeDriver: false, // animating layout
      friction: 9,
      tension: 120,
    }).start();
  }, [compact, compactValue]);

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
          compactValue={compactValue}
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
    paddingTop: 14,
    paddingBottom: 12,
    gap: CELL_GAP,
  },
  cell: {
    width: CELL_WIDTH,
    borderRadius: 20,
    alignItems: 'center',
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
    alignItems: 'center',
    overflow: 'hidden',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
