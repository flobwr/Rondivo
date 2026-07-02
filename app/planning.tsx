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
import { CalendarDay, DayItem } from '@/components/planning/types';
import { Palette } from '@/constants/design';

// ── Mock data ─────────────────────────────────────────────────────────────────

const CALENDAR_DAYS: CalendarDay[] = [
  { date: 29, dayLabel: 'LUN', hasAppointments: true, hasUrgent: false },
  { date: 30, dayLabel: 'MAR', hasAppointments: true, hasUrgent: false },
  { date: 1, dayLabel: 'MER', hasAppointments: true, hasUrgent: false },
  { date: 2, dayLabel: 'JEU', hasAppointments: true, hasUrgent: true },
  { date: 3, dayLabel: 'VEN', hasAppointments: true, hasUrgent: false },
  { date: 4, dayLabel: 'SAM', hasAppointments: false, hasUrgent: false },
  { date: 5, dayLabel: 'DIM', hasAppointments: false, hasUrgent: false },
];

const SELECTED_DAY_INDEX = 2; // Wednesday the 1st

const WEDNESDAY_ITEMS: DayItem[] = [
  {
    kind: 'appointment',
    data: {
      id: 'apt-1',
      time: '08:00',
      duration: '1h00',
      client: 'Martin Faure',
      type: 'Entretien chaudière',
      address: 'Av. Félix Faure, 69003 Lyon',
      status: 'done',
    },
  },
  { kind: 'travel', data: { id: 'travel-1', minutes: 12, km: 4.2 } },
  {
    kind: 'appointment',
    data: {
      id: 'apt-2',
      time: '10:30',
      duration: '1h30',
      client: 'Sophie Bernard',
      type: 'Fuite sous évier',
      address: '8 rue Molière, 69003 Lyon',
      status: 'inProgress',
    },
  },
  { kind: 'travel', data: { id: 'travel-2', minutes: 18, km: 6.1 } },
  {
    kind: 'appointment',
    data: {
      id: 'apt-3',
      time: '13:30',
      duration: '2h00',
      client: 'Jean Moreau',
      type: 'Installation radiateur',
      address: '23 cours Gambetta, 69004 Lyon',
      status: 'normal',
    },
  },
  { kind: 'travel', data: { id: 'travel-3', minutes: 7, km: 2.3 } },
  {
    kind: 'appointment',
    data: {
      id: 'apt-4',
      time: '16:00',
      duration: '1h30',
      client: 'Marie Lefebvre',
      type: 'Tableau électrique',
      address: '3 place Bellecour, 69002 Lyon',
      status: 'urgent',
    },
  },
];

const DAY_DATA: Record<number, DayItem[]> = {
  0: [],
  1: [],
  2: WEDNESDAY_ITEMS,
  3: [
    {
      kind: 'appointment',
      data: {
        id: 'apt-j1',
        time: '09:00',
        duration: '2h00',
        client: 'Paul Rousseau',
        type: 'Diagnostic chauffage',
        address: '14 rue Garibaldi, 69003 Lyon',
        status: 'normal',
      },
    },
  ],
  4: [],
  5: [],
  6: [],
};

type Status = 'loading' | 'error' | 'loaded';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlanningScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(SELECTED_DAY_INDEX);
  const [status, setStatus] = useState<Status>('loading');
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => setStatus('loaded'), 850);
    Animated.timing(fadeIn, { toValue: 1, duration: 280, useNativeDriver: true }).start();
    return () => clearTimeout(t);
  }, [fadeIn]);

  const handleSelectDay = useCallback((index: number) => {
    setSelectedDay(index);
  }, []);

  const handleRetry = useCallback(() => {
    setStatus('loading');
    const t = setTimeout(() => setStatus('loaded'), 700);
    return () => clearTimeout(t);
  }, []);

  const currentItems = DAY_DATA[selectedDay] ?? [];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          {/* Fixed header — title, month, add button, calendar all stay put */}
          <PlanningHeader monthLabel="JUIN 2025" onAdd={() => router.push('/appointment/new')} />
          <HorizontalCalendar
            days={CALENDAR_DAYS}
            selectedIndex={selectedDay}
            onSelectDay={handleSelectDay}
          />

          {/* Scrollable content, always starts below the fixed header */}
          <View style={styles.content}>
            {status === 'loading' ? (
              <LoadingState />
            ) : status === 'error' ? (
              <ErrorState onRetry={handleRetry} />
            ) : currentItems.length > 0 ? (
              <Timeline key={selectedDay} items={currentItems} />
            ) : (
              <EmptyState key={`empty-${selectedDay}`} />
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
