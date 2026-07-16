import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { DayAnalysis } from './dayMath';
import { formatMinutes, formatTime } from './status';
import { DayWeather, InterventionStatus } from './types';

type Props = {
  analysis: DayAnalysis;
  weather?: DayWeather;
  /** future: automatic route optimisation */
  onOptimize?: () => void;
};

const SEGMENT_COLOR: Partial<Record<InterventionStatus, string>> = {
  done: Palette.blue,
  enRoute: '#9DBDF7',
  arrived: '#9DBDF7',
  inProgress: '#9DBDF7',
};

// The day at a glance: a segmented progress bar (one segment per
// intervention) and the three numbers an artisan actually needs — progress,
// estimated end of day, kilometres left — plus a punctuality verdict.
export function JourneyBar({ analysis, weather, onOptimize }: Props) {
  const pressScale = useRef(new Animated.Value(1)).current;

  if (analysis.actionableTotal === 0) return null;

  const allDone = analysis.doneCount === analysis.actionableTotal;
  const inFlight = analysis.live && analysis.heroIndex >= 0;

  let statsLine: string;
  if (inFlight) {
    const kmLabel = analysis.remainingKm.toFixed(1).replace('.', ',');
    const endLabel = analysis.endMin != null ? formatTime(analysis.endMin) : '—';
    statsLine = `${analysis.doneCount}/${analysis.actionableTotal} · Fin prévue ~${endLabel} · ${kmLabel} km restants`;
  } else if (allDone) {
    const kmLabel = analysis.travelKm.toFixed(1).replace('.', ',');
    statsLine = `${analysis.actionableTotal} intervention${analysis.actionableTotal > 1 ? 's' : ''} · ${formatMinutes(analysis.workMin)} · ${kmLabel} km`;
  } else {
    statsLine = `${analysis.actionableTotal} intervention${analysis.actionableTotal > 1 ? 's' : ''} · ${formatMinutes(analysis.workMin)} de travail · ${formatMinutes(analysis.travelMin)} de route`;
  }

  let chip: { label: string; color: string; bg: string } | null = null;
  if (allDone) {
    chip = { label: 'Journée terminée', color: Palette.green, bg: Palette.greenSoft };
  } else if (inFlight) {
    chip =
      analysis.lateMin > 0
        ? { label: `≈ ${analysis.lateMin} min de retard`, color: Palette.orange, bg: Palette.orangeSoft }
        : { label: 'À l’heure', color: Palette.green, bg: Palette.greenSoft };
  }

  const showOptimize = inFlight && analysis.doneCount < analysis.actionableTotal;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.88, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        <View style={styles.segments}>
          {analysis.segments.map((status, i) => (
            <View
              key={i}
              style={[styles.segment, { backgroundColor: SEGMENT_COLOR[status] ?? '#E4E8F0' }]}
            />
          ))}
        </View>
        {showOptimize ? (
          <Animated.View style={{ transform: [{ scale: pressScale }] }}>
            <Pressable
              style={styles.optimizeButton}
              hitSlop={10}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={onOptimize}>
              <Feather name="zap" size={12} color={Palette.blue} />
            </Pressable>
          </Animated.View>
        ) : null}
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.stats} numberOfLines={1}>
          {statsLine}
        </Text>
        {weather ? (
          <View style={styles.weather}>
            <Feather name={weather.icon} size={11} color={Palette.orange} />
            <Text style={styles.weatherLabel}>{weather.temp}</Text>
          </View>
        ) : null}
        {chip ? (
          <View style={[styles.chip, { backgroundColor: chip.bg }]}>
            <Text style={[styles.chipLabel, { color: chip.color }]}>{chip.label}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 2,
    paddingBottom: 10,
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  segments: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  optimizeButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stats: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.2,
  },
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  weatherLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
