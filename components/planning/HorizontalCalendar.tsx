import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { CalendarDay } from './types';

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
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  // dot color beneath the date
  let dotColor: string | null = null;
  if (day.hasUrgent) dotColor = Palette.orange;
  else if (day.hasAppointments) dotColor = Palette.blue;

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.cell, { transform: [{ scale }] }]}>
        <Text style={[styles.dayLabel, selected && styles.dayLabelSelected]}>
          {day.dayLabel}
        </Text>

        <View style={[styles.dateBubble, selected && styles.dateBubbleSelected]}>
          <Text style={[styles.dateNumber, selected && styles.dateNumberSelected]}>
            {day.date}
          </Text>
        </View>

        <View style={styles.dotRow}>
          {dotColor ? (
            <View style={[styles.dot, { backgroundColor: selected ? Palette.card : dotColor }]} />
          ) : (
            <View style={styles.dotPlaceholder} />
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

export function HorizontalCalendar({ days, selectedIndex, onSelectDay }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
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
      <View style={styles.divider} />
    </View>
  );
}

const CELL_WIDTH = 52;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 16,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screen - 4,
    gap: 0,
  },
  cell: {
    width: CELL_WIDTH,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  dayLabelSelected: {
    color: Palette.white,
  },
  dateBubble: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBubbleSelected: {
    backgroundColor: Palette.blue,
  },
  dateNumber: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  dateNumberSelected: {
    color: Palette.white,
    fontWeight: '700',
  },
  dotRow: {
    height: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotPlaceholder: {
    width: 6,
    height: 6,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginHorizontal: Spacing.screen,
    marginTop: 12,
  },
});
