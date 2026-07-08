import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { EmptyState } from '@/components/planning/EmptyState';
import { ErrorState } from '@/components/planning/ErrorState';
import { HorizontalCalendar } from '@/components/planning/HorizontalCalendar';
import { LoadingState } from '@/components/planning/LoadingState';
import { PlanningHeader } from '@/components/planning/PlanningHeader';
import { Timeline } from '@/components/planning/Timeline';
import { ScreenFadeInDuration } from '@/constants/animation';
import { Palette } from '@/constants/design';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getWeekPlanning } from '@/services/planning';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlanningScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const fadeIn = useRef(new Animated.Value(0)).current;

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

  const handleSelectDay = useCallback((index: number) => {
    setSelectedDay(index);
  }, []);

  const currentItems = planning && selectedDay !== null ? (planning.itemsByDayIndex[selectedDay] ?? []) : [];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          {/* Fixed header — title, month, add button, calendar all stay put */}
          <PlanningHeader monthLabel={planning?.monthLabel ?? ''} onAdd={() => router.push('/appointment/new')} />
          <HorizontalCalendar
            days={planning?.days ?? []}
            selectedIndex={selectedDay ?? 0}
            onSelectDay={handleSelectDay}
          />

          {/* Scrollable content, always starts below the fixed header */}
          <View style={styles.content}>
            {status === 'loading' ? (
              <LoadingState />
            ) : status === 'error' ? (
              <ErrorState onRetry={refresh} />
            ) : currentItems.length > 0 ? (
              <Timeline key={selectedDay} items={currentItems} />
            ) : (
              <EmptyState key={`empty-${selectedDay}`} onPlan={() => router.push('/appointment/new')} />
            )}
          </View>
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
