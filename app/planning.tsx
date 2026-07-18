import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DayStrip } from '@/components/planning/DayStrip';
import { EmptyState } from '@/components/planning/EmptyState';
import { ErrorState } from '@/components/planning/ErrorState';
import { LoadingState } from '@/components/planning/LoadingState';
import { PlanningHeader } from '@/components/planning/PlanningHeader';
import { Timeline } from '@/components/planning/Timeline';
import { Palette, ScreenFadeInDuration } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getWeekPlanning } from '@/services/planning';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlanningScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const fadeIn = useRef(new Animated.Value(0)).current;
  // Directional day transition: the day's content slides in from the side the
  // navigation came from, so switching days reads like flipping pages.
  const transition = useRef(new Animated.Value(1)).current;
  const directionRef = useRef(0);

  const fetchPlanning = useCallback(() => getWeekPlanning(), []);
  const { data: planning, status, refresh } = useAsyncItem(fetchPlanning);

  useEffect(() => {
    if (planning && selectedDay === null) setSelectedDay(planning.selectedDayIndex);
  }, [planning, selectedDay]);

  useEffect(() => {
    if (status === 'success') {
      Animated.timing(fadeIn, { toValue: 1, duration: ScreenFadeInDuration, useNativeDriver: true }).start();
    }
  }, [status, fadeIn]);

  const handleSelectDay = useCallback(
    (index: number) => {
      setSelectedDay((current) => {
        if (current === null || index === current) return current;
        directionRef.current = index > current ? 1 : -1;
        transition.setValue(0);
        Animated.spring(transition, { toValue: 1, useNativeDriver: true, friction: 10, tension: 90 }).start();
        return index;
      });
    },
    [transition]
  );

  const dayCount = planning?.days.length ?? 0;

  // Horizontal swipe anywhere on the day's content flips to the previous/next
  // day; the offsets keep it from ever fighting the vertical scroll.
  const swipeGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .activeOffsetX([-24, 24])
        .failOffsetY([-14, 14])
        .onEnd((e) => {
          if (selectedDay === null) return;
          const goNext = e.translationX <= -56 || e.velocityX <= -800;
          const goPrev = e.translationX >= 56 || e.velocityX >= 800;
          if (goNext && selectedDay < dayCount - 1) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleSelectDay(selectedDay + 1);
          } else if (goPrev && selectedDay > 0) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            handleSelectDay(selectedDay - 1);
          }
        }),
    [selectedDay, dayCount, handleSelectDay]
  );

  const slideX = transition.interpolate({
    inputRange: [0, 1],
    outputRange: [directionRef.current * 40, 0],
  });

  const scenario = planning && selectedDay !== null ? (planning.scenariosByDayIndex[selectedDay] ?? { items: [] }) : { items: [] };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          {/* Fixed header — title, month, add button and day strip stay put */}
          <PlanningHeader monthLabel={planning?.monthLabel ?? ''} onAdd={() => router.push('/appointment/new')} />
          <DayStrip
            days={planning?.days ?? []}
            selectedIndex={selectedDay ?? 0}
            onSelectDay={handleSelectDay}
          />

          {/* Scrollable content, always below the fixed header. Swipeable
              left/right to flip between days. */}
          <GestureDetector gesture={swipeGesture}>
            <Animated.View
              style={[styles.content, { opacity: transition, transform: [{ translateX: slideX }] }]}>
              {status === 'loading' ? (
                <LoadingState />
              ) : status === 'error' ? (
                <ErrorState onRetry={refresh} />
              ) : scenario.items.length > 0 ? (
                <Timeline key={selectedDay} items={scenario.items} nowMin={scenario.nowMin} />
              ) : (
                <EmptyState key={`empty-${selectedDay}`} onPlan={() => router.push('/appointment/new')} />
              )}
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </SafeAreaView>

      <BottomNav activeIndex={1} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
