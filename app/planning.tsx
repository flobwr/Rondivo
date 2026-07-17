import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DayStrip } from '@/components/planning/DayStrip';
import { EmptyState } from '@/components/planning/EmptyState';
import { ErrorState } from '@/components/planning/ErrorState';
import { LoadingState } from '@/components/planning/LoadingState';
import { PlanningHeader } from '@/components/planning/PlanningHeader';
import { Timeline } from '@/components/planning/Timeline';
import { parseTime } from '@/components/planning/status';
import { CalendarDay, DayScenario } from '@/components/planning/types';
import { Palette } from '@/constants/design';

// ── Mock data ─────────────────────────────────────────────────────────────────
// Each day is a self-consistent scenario: `nowMin` makes it "live" and places
// the "Maintenant" marker in the timeline.

const CALENDAR_DAYS: CalendarDay[] = [
  { date: 29, dayLabel: 'Lun' },
  { date: 30, dayLabel: 'Mar' },
  { date: 1, dayLabel: 'Mer' },
  { date: 2, dayLabel: 'Jeu' },
  { date: 3, dayLabel: 'Ven' },
  { date: 4, dayLabel: 'Sam' },
  { date: 5, dayLabel: 'Dim' },
];

const SELECTED_DAY_INDEX = 2; // Wednesday the 1st — "today"

// Wednesday, 13:32 — morning done, lunch over, afternoon ahead.
const WEDNESDAY: DayScenario = {
  nowMin: parseTime('13:32'),
  items: [
    {
      kind: 'intervention',
      data: {
        id: 'mer-1',
        start: '08:00',
        end: '09:00',
        durationMin: 60,
        client: 'Martin Faure',
        type: 'Entretien chaudière',
        address: 'Av. Félix Faure, 69003 Lyon',
        status: 'done',
      },
    },
    { kind: 'travel', data: { id: 'mer-t1', minutes: 12, km: 4.2, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'mer-2',
        start: '09:15',
        end: '10:15',
        durationMin: 60,
        client: 'Claire Dubois',
        type: 'Remplacement mitigeur',
        address: '12 rue de Sèze, 69006 Lyon',
        status: 'done',
      },
    },
    { kind: 'travel', data: { id: 'mer-t2', minutes: 8, km: 2.8, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'mer-3',
        start: '10:30',
        end: '12:00',
        durationMin: 90,
        client: 'Sophie Bernard',
        type: 'Fuite sous évier',
        address: '8 rue Molière, 69003 Lyon',
        status: 'done',
      },
    },
    { kind: 'break', data: { id: 'mer-b1', start: '12:00', end: '13:30', label: 'Pause déjeuner' } },
    { kind: 'travel', data: { id: 'mer-t3', minutes: 14, km: 6.1, traffic: 'dense' } },
    {
      kind: 'intervention',
      data: {
        id: 'mer-4',
        start: '14:00',
        end: '16:00',
        durationMin: 120,
        client: 'Marie Lefebvre',
        type: 'Panne tableau électrique',
        address: '3 place Bellecour, 69002 Lyon',
        status: 'planned',
      },
    },
    { kind: 'travel', data: { id: 'mer-t4', minutes: 9, km: 3.4, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'mer-5',
        start: '16:30',
        end: '17:15',
        durationMin: 45,
        client: 'Jean Moreau',
        type: 'Pose radiateur',
        address: '23 cours Gambetta, 69004 Lyon',
        status: 'planned',
      },
    },
    {
      kind: 'intervention',
      data: {
        id: 'mer-6',
        start: '17:30',
        end: '18:15',
        durationMin: 45,
        client: 'Lucas Marchand',
        type: 'Détartrage cumulus',
        address: '19 rue Paul Bert, 69003 Lyon',
        status: 'cancelled',
      },
    },
    {
      kind: 'intervention',
      data: {
        id: 'mer-7',
        start: '18:30',
        end: '19:15',
        durationMin: 45,
        client: 'Hugo Petit',
        type: 'Ballon d’eau chaude',
        address: '5 rue Duguesclin, 69006 Lyon',
        status: 'postponed',
      },
    },
  ],
};

// Thursday, 09:25 — first job started at 08:30, still in progress.
const THURSDAY: DayScenario = {
  nowMin: parseTime('09:25'),
  items: [
    {
      kind: 'intervention',
      data: {
        id: 'jeu-1',
        start: '08:30',
        end: '10:30',
        durationMin: 120,
        client: 'Paul Rousseau',
        type: 'Diagnostic chauffage',
        address: '14 rue Garibaldi, 69003 Lyon',
        status: 'inProgress',
      },
    },
    { kind: 'travel', data: { id: 'jeu-t1', minutes: 16, km: 5.8, traffic: 'dense' } },
    {
      kind: 'intervention',
      data: {
        id: 'jeu-2',
        start: '11:00',
        end: '12:00',
        durationMin: 60,
        client: 'Léa Fontaine',
        type: 'Fuite radiateur',
        address: '26 rue de Créqui, 69006 Lyon',
        status: 'planned',
      },
    },
    { kind: 'break', data: { id: 'jeu-b1', start: '12:00', end: '13:00', label: 'Pause déjeuner' } },
    { kind: 'travel', data: { id: 'jeu-t2', minutes: 11, km: 4.0, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'jeu-3',
        start: '13:30',
        end: '15:00',
        durationMin: 90,
        client: 'Anne Girard',
        type: 'Remplacement thermostat',
        address: '7 rue des Remparts, 69001 Lyon',
        status: 'planned',
      },
    },
  ],
};

// Friday, 08:35 — on the road towards the first job.
const FRIDAY: DayScenario = {
  nowMin: parseTime('08:35'),
  items: [
    { kind: 'travel', data: { id: 'ven-t1', minutes: 17, km: 8.3, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'ven-1',
        start: '09:00',
        end: '10:00',
        durationMin: 60,
        client: 'Karim Haddad',
        type: 'Mise en service PAC',
        address: '31 av. Berthelot, 69008 Lyon',
        status: 'enRoute',
      },
    },
  ],
};

const MONDAY: DayScenario = {
  items: [
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
      },
    },
  ],
};

const TUESDAY: DayScenario = {
  items: [
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
      },
    },
    { kind: 'travel', data: { id: 'mar-t2', minutes: 9, km: 3.1, traffic: 'fluid' } },
    {
      kind: 'intervention',
      data: {
        id: 'mar-3',
        start: '14:00',
        end: '15:30',
        durationMin: 90,
        client: 'Iris Weiss',
        type: 'Entretien chaudière',
        address: '11 rue Bugeaud, 69006 Lyon',
        status: 'done',
      },
    },
  ],
};

const DAY_DATA: Record<number, DayScenario> = {
  0: MONDAY,
  1: TUESDAY,
  2: WEDNESDAY,
  3: THURSDAY,
  4: FRIDAY,
  5: { items: [] },
  6: { items: [] },
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

  const scenario = DAY_DATA[selectedDay] ?? { items: [] };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          {/* Fixed header — title, add button and day strip stay put */}
          <PlanningHeader />
          <DayStrip
            days={CALENDAR_DAYS}
            selectedIndex={selectedDay}
            onSelectDay={handleSelectDay}
          />

          {/* Scrollable content, always below the fixed header */}
          <View style={styles.content}>
            {status === 'loading' ? (
              <LoadingState />
            ) : status === 'error' ? (
              <ErrorState onRetry={handleRetry} />
            ) : scenario.items.length > 0 ? (
              <Timeline key={selectedDay} items={scenario.items} nowMin={scenario.nowMin} />
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
