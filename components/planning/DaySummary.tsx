import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { formatMinutes } from './status';
import { DayItem, DayWeather } from './types';

type Props = {
  items: DayItem[];
  weather?: DayWeather;
  /** future: automatic route optimisation */
  onOptimize?: () => void;
};

// One-glance summary of the day: workload on the first line, road + weather on
// the second. The "Optimiser" pill is the natural home of future route
// optimisation and live traffic.
export function DaySummary({ items, weather, onOptimize }: Props) {
  const pressScale = useRef(new Animated.Value(1)).current;

  const summary = useMemo(() => {
    let count = 0;
    let workMin = 0;
    let travelMin = 0;
    let travelKm = 0;
    for (const item of items) {
      if (item.kind === 'intervention' && item.data.status !== 'postponed') {
        count += 1;
        workMin += item.data.durationMin;
      } else if (item.kind === 'travel') {
        travelMin += item.data.minutes;
        travelKm += item.data.km;
      }
    }
    return { count, workMin, travelMin, travelKm };
  }, [items]);

  if (summary.count === 0) return null;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.94, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const kmLabel = summary.travelKm.toFixed(1).replace('.', ',');

  return (
    <View style={styles.row}>
      <View style={styles.textCol}>
        <Text style={styles.mainLine}>
          {summary.count} intervention{summary.count > 1 ? 's' : ''}
          <Text style={styles.mainLineMuted}> · {formatMinutes(summary.workMin)}</Text>
        </Text>
        <View style={styles.subLine}>
          <Feather name="truck" size={11} color={Palette.textTertiary} />
          <Text style={styles.subText}>
            {summary.travelMin} min · {kmLabel} km
          </Text>
          {weather ? (
            <>
              <Text style={styles.subSeparator}>·</Text>
              <Feather name={weather.icon} size={11} color={Palette.orange} />
              <Text style={styles.subText}>{weather.temp}</Text>
            </>
          ) : null}
        </View>
      </View>

      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <Pressable
          style={styles.optimizeButton}
          hitSlop={8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={onOptimize}>
          <Feather name="zap" size={12} color={Palette.blue} />
          <Text style={styles.optimizeLabel}>Optimiser</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 4,
    paddingBottom: 6,
  },
  textCol: {
    gap: 4,
  },
  mainLine: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  mainLineMuted: {
    fontWeight: '500',
    color: Palette.textSecondary,
  },
  subLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  subText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  subSeparator: {
    fontSize: 12.5,
    color: Palette.textTertiary,
  },
  optimizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.blueSoft,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  optimizeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.blue,
    letterSpacing: -0.2,
  },
});
