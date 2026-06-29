import { useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { EmptyState } from '@/components/planning/EmptyState';
import { HorizontalCalendar } from '@/components/planning/HorizontalCalendar';
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

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlanningScreen() {
  const [selectedDay, setSelectedDay] = useState(SELECTED_DAY_INDEX);
  const [headerH, setHeaderH] = useState(60);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [fadeIn]);

  const handleSelectDay = (index: number) => {
    if (index === selectedDay) return;
    setSelectedDay(index); // Timeline is keyed on the day → it re-enters with stagger
  };

  const currentItems = DAY_DATA[selectedDay] ?? [];

  // Collapsing title: the big "Planning" header fades and reclaims its height
  // as the user scrolls, so the calendar slides up and stays reachable.
  const titleHeight = scrollY.interpolate({
    inputRange: [0, headerH],
    outputRange: [headerH, 0],
    extrapolate: 'clamp',
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, headerH * 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          {/* Collapsing title */}
          <Animated.View style={{ height: titleHeight, opacity: titleOpacity, overflow: 'hidden' }}>
            <View
              onLayout={(e: LayoutChangeEvent) => {
                const h = e.nativeEvent.layout.height;
                if (h > 0 && Math.abs(h - headerH) > 1) setHeaderH(h);
              }}>
              <PlanningHeader monthLabel="JUIN 2025" />
            </View>
          </Animated.View>

          {/* Sticky calendar */}
          <HorizontalCalendar
            days={CALENDAR_DAYS}
            selectedIndex={selectedDay}
            onSelectDay={handleSelectDay}
          />

          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: false,
            })}>
            {currentItems.length > 0 ? (
              <Timeline key={selectedDay} items={currentItems} />
            ) : (
              <EmptyState key={`empty-${selectedDay}`} />
            )}
          </Animated.ScrollView>
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
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 28,
  },
});
