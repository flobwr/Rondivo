import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DayStrip } from '@/components/planning/DayStrip';
import { DaySummary } from '@/components/planning/DaySummary';
import { EmptyState } from '@/components/planning/EmptyState';
import { ErrorState } from '@/components/planning/ErrorState';
import { LoadingState } from '@/components/planning/LoadingState';
import { PlanningHeader } from '@/components/planning/PlanningHeader';
import { Timeline } from '@/components/planning/Timeline';
import { CalendarDay, DayItem, DayWeather } from '@/components/planning/types';
import { Palette } from '@/constants/design';

// ── Mock data ─────────────────────────────────────────────────────────────────

const CALENDAR_DAYS: CalendarDay[] = [
  { date: 29, dayLabel: 'Lun', count: 2, hasUrgent: false },
  { date: 30, dayLabel: 'Mar', count: 2, hasUrgent: false },
  { date: 1, dayLabel: 'Mer', count: 5, hasUrgent: true },
  { date: 2, dayLabel: 'Jeu', count: 2, hasUrgent: false },
  { date: 3, dayLabel: 'Ven', count: 1, hasUrgent: false },
  { date: 4, dayLabel: 'Sam', count: 0, hasUrgent: false },
  { date: 5, dayLabel: 'Dim', count: 0, hasUrgent: false },
];

const SELECTED_DAY_INDEX = 2; // Wednesday the 1st — "today"

const WEDNESDAY_ITEMS: DayItem[] = [
  {
    kind: 'intervention',
    data: {
      id: 'apt-1',
      start: '08:00',
      end: '09:00',
      durationMin: 60,
      client: 'Martin Faure',
      type: 'Entretien chaudière',
      address: 'Av. Félix Faure, 69003 Lyon',
      status: 'done',
      priority: 'normal',
    },
  },
  { kind: 'travel', data: { id: 'travel-1', minutes: 12, km: 4.2, traffic: 'fluid' } },
  {
    kind: 'intervention',
    data: {
      id: 'apt-2',
      start: '09:15',
      end: '10:15',
      durationMin: 60,
      client: 'Claire Dubois',
      type: 'Remplacement mitigeur',
      address: '12 rue de Sèze, 69006 Lyon',
      status: 'done',
      priority: 'normal',
    },
  },
  { kind: 'travel', data: { id: 'travel-2', minutes: 8, km: 2.8, traffic: 'fluid' } },
  { kind: 'now', id: 'now' },
  {
    kind: 'intervention',
    data: {
      id: 'apt-3',
      start: '10:30',
      end: '12:00',
      durationMin: 90,
      client: 'Sophie Bernard',
      type: 'Fuite sous évier',
      address: '8 rue Molière, 69003 Lyon',
      status: 'inProgress',
      priority: 'normal',
    },
  },
  { kind: 'travel', data: { id: 'travel-3', minutes: 18, km: 6.1, traffic: 'dense' } },
  {
    kind: 'intervention',
    data: {
      id: 'apt-4',
      start: '14:00',
      end: '16:00',
      durationMin: 120,
      client: 'Marie Lefebvre',
      type: 'Panne tableau électrique',
      address: '3 place Bellecour, 69002 Lyon',
      status: 'planned',
      priority: 'urgent',
    },
  },
  { kind: 'travel', data: { id: 'travel-4', minutes: 9, km: 3.4, traffic: 'fluid' } },
  {
    kind: 'intervention',
    data: {
      id: 'apt-5',
      start: '16:30',
      end: '17:30',
      durationMin: 60,
      client: 'Jean Moreau',
      type: 'Pose radiateur',
      address: '23 cours Gambetta, 69004 Lyon',
      status: 'planned',
      priority: 'high',
    },
  },
  {
    kind: 'intervention',
    data: {
      id: 'apt-6',
      start: '17:45',
      end: '18:30',
      durationMin: 45,
      client: 'Hugo Petit',
      type: 'Ballon d’eau chaude',
      address: '5 rue Duguesclin, 69006 Lyon',
      status: 'postponed',
      priority: 'normal',
    },
  },
];

const DAY_DATA: Record<number, DayItem[]> = {
  0: [
    {
      kind: 'intervention',
      data: {
        id: 'lun-1',
        start: '09:00',
        end: '10:30',
        durationMin: 90,
        client: 'Louis Garnier',
        type: 'Détartrage chauffe-eau',
        address: '18 rue Vendôme, 69006 Lyon',
        status: 'done',
        priority: 'normal',
      },
    },
    { kind: 'travel', data: { id: 'lun-t1', minutes: 14, km: 5.0, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'lun-2',
        start: '11:00',
        end: '12:00',
        durationMin: 60,
        client: 'Emma Riva',
        type: 'Entretien chaudière',
        address: '2 quai Claude Bernard, 69007 Lyon',
        status: 'done',
        priority: 'normal',
      },
    },
  ],
  1: [
    {
      kind: 'intervention',
      data: {
        id: 'mar-1',
        start: '08:30',
        end: '10:00',
        durationMin: 90,
        client: 'Nadia Benali',
        type: 'Recherche de fuite',
        address: '40 rue de la Charité, 69002 Lyon',
        status: 'done',
        priority: 'normal',
      },
    },
    { kind: 'travel', data: { id: 'mar-t1', minutes: 10, km: 3.6, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'mar-2',
        start: '10:30',
        end: '11:30',
        durationMin: 60,
        client: 'Théo Lambert',
        type: 'Remplacement thermostat',
        address: '7 rue des Remparts, 69001 Lyon',
        status: 'done',
        priority: 'normal',
      },
    },
  ],
  2: WEDNESDAY_ITEMS,
  3: [
    {
      kind: 'intervention',
      data: {
        id: 'jeu-1',
        start: '09:00',
        end: '11:00',
        durationMin: 120,
        client: 'Paul Rousseau',
        type: 'Diagnostic chauffage',
        address: '14 rue Garibaldi, 69003 Lyon',
        status: 'arrived',
        priority: 'normal',
      },
    },
    { kind: 'travel', data: { id: 'jeu-t1', minutes: 16, km: 5.8, traffic: 'dense' } },
    {
      kind: 'intervention',
      data: {
        id: 'jeu-2',
        start: '11:30',
        end: '12:30',
        durationMin: 60,
        client: 'Léa Fontaine',
        type: 'Fuite radiateur',
        address: '26 rue de Créqui, 69006 Lyon',
        status: 'planned',
        priority: 'normal',
      },
    },
  ],
  4: [
    {
      kind: 'intervention',
      data: {
        id: 'ven-1',
        start: '08:30',
        end: '09:30',
        durationMin: 60,
        client: 'Karim Haddad',
        type: 'Mise en service PAC',
        address: '31 av. Berthelot, 69008 Lyon',
        status: 'enRoute',
        priority: 'normal',
      },
    },
  ],
  5: [],
  6: [],
};

const DAY_WEATHER: Record<number, DayWeather> = {
  0: { icon: 'sun', temp: '19°' },
  1: { icon: 'cloud', temp: '17°' },
  2: { icon: 'sun', temp: '21°' },
  3: { icon: 'cloud-rain', temp: '15°' },
  4: { icon: 'sun', temp: '22°' },
};

type Status = 'loading' | 'error' | 'loaded';

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlanningScreen() {
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
          {/* Fixed header — title, month, day strip and summary stay put */}
          <PlanningHeader monthLabel="Juin 2025" />
          <DayStrip
            days={CALENDAR_DAYS}
            selectedIndex={selectedDay}
            onSelectDay={handleSelectDay}
          />
          {status === 'loaded' ? (
            <DaySummary
              key={`summary-${selectedDay}`}
              items={currentItems}
              weather={DAY_WEATHER[selectedDay]}
            />
          ) : null}

          {/* Scrollable content, always below the fixed header */}
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
