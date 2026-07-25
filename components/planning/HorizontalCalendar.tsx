import { useEffect, useRef } from 'react';
import { Animated, Dimensions, LayoutChangeEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { FontSize, FontWeight, LetterSpacing, Overlay, Palette, Radius, Spacing } from '@/constants/design';
import { PressScale, Spring } from '@/constants/motion';
import { usePressScale } from '@/hooks/use-press-scale';
import { CalendarDay } from './types';

const CELL_WIDTH = 50;
const SCROLL_PAD = Spacing.screen - 5;
/** Selected-day bubble. */
const BUBBLE = 40;
/** "This day has work" marker. */
const DOT = 5;
const DOT_ROW_HEIGHT = 10;

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
    to: PressScale.icon,
  });
  // Single animated value drives the whole selected/unselected crossfade so the
  // blue bubble appears to glide from one day to the next. A spring, not a
  // curve: the selection follows the finger, so it belongs to the touch side of
  // the motion system.
  const sel = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(sel, {
      toValue: selected ? 1 : 0,
      useNativeDriver: false, // animating colours
      ...Spring.selection,
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
  // Only the number sits *inside* the blue bubble, so only the number turns
  // white. The label and the dot stay on the page background: the selected day
  // is emphasised with the brand blue, never with white-on-white.
  const numberColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textPrimary, Palette.white],
  });
  const labelColor = sel.interpolate({
    inputRange: [0, 1],
    outputRange: [Palette.textTertiary, Palette.blue],
  });

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
          {baseDot ? (
            <View style={[styles.dot, { backgroundColor: baseDot }]} />
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
    paddingBottom: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Palette.border,
  },
  scrollContent: {
    paddingHorizontal: SCROLL_PAD,
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: 'center',
    paddingVertical: 2,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: FontWeight.semibold,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  dateBubble: {
    width: BUBBLE,
    height: BUBBLE,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateNumber: {
    fontSize: FontSize.body,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.snug,
  },
  dotRow: {
    height: DOT_ROW_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
  },
  dot: {
    width: DOT,
    height: DOT,
    borderRadius: DOT / 2,
  },
  dotPlaceholder: {
    width: DOT,
    height: DOT,
  },
});
