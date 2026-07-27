import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DayStrip } from '@/components/planning/DayStrip';
import { EmptyState } from '@/components/planning/EmptyState';
import { ErrorState } from '@/components/planning/ErrorState';
import { LoadingState } from '@/components/planning/LoadingState';
import { PlanningHeader } from '@/components/planning/PlanningHeader';
import { Timeline } from '@/components/planning/Timeline';
import { DayScenario } from '@/components/planning/types';
import { createThemedStyles, Palette, Spacing, Timing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getWeekPlanning } from '@/services/planning';

/**
 * The masthead's grounding line — the ONE fact about the selected day, in
 * the same slot Home puts its departure status. A count of jobs and the road
 * between them; never a tally of everything on screen.
 */
function summarise(scenario: DayScenario): string {
  const jobs = scenario.items.filter((item) => item.kind === 'intervention').length;
  // Not "Journée libre" — that is the empty state's own headline three
  // centimetres below, and the masthead must never echo it.
  if (jobs === 0) return 'Aucune intervention';

  const km = scenario.items.reduce(
    (total, item) => (item.kind === 'travel' ? total + item.data.km : total),
    0
  );
  const label = `${jobs} intervention${jobs > 1 ? 's' : ''}`;
  if (km === 0) return label;

  const kmLabel = km.toLocaleString('fr-FR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return `${label} · ${kmLabel} km`;
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlanningScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const fadeIn = useRef(new Animated.Value(0)).current;
  // Directional day transition: the day's content slides in from the side the
  // navigation came from, so switching days reads like flipping pages. Only
  // the direction is decided here — `Timeline` runs the animation.
  const directionRef = useRef(0);

  const fetchPlanning = useCallback(() => getWeekPlanning(), []);
  const { data: planning, status, refresh } = useAsyncItem(fetchPlanning);
  const isLoading = status === 'loading';

  useEffect(() => {
    if (planning && selectedDay === null) setSelectedDay(planning.selectedDayIndex);
  }, [planning, selectedDay]);

  // The screen fades in on mount, skeleton included — it used to wait for the
  // data, which held the whole page at opacity 0 and made the loading state
  // (header, day strip and card placeholders alike) invisible.
  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, useNativeDriver: true, ...Timing.content }).start();
  }, [fadeIn]);

  const handleSelectDay = useCallback(
    (index: number) => {
      setSelectedDay((current) => {
        if (current === null || index === current) return current;
        // The slide itself belongs to `Timeline`, which starts it once the new
        // day's rows are mounted; here we only record which way we travelled.
        directionRef.current = index > current ? 1 : -1;
        return index;
      });
    },
    []
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

  const scenario =
    planning && selectedDay !== null
      ? (planning.scenariosByDayIndex[selectedDay] ?? { items: [] })
      : { items: [] };

  // The month, its grounding line, the add action and the week — drawn
  // straight on the paper. No card, no capsule, no background, and no
  // rectangle of any kind behind them; the air under the week is owned here
  // rather than baked into either component. This whole block scrolls WITH the
  // day, exactly as Home's own header does, which is what makes the top of the
  // screen one continuous sheet instead of a header and a content pane meeting
  // on a line.
  const header = (
    <View>
      <PlanningHeader
        monthLabel={planning?.monthLabel ?? ''}
        summary={summarise(scenario)}
        loading={isLoading}
        onAdd={() => router.push('/appointment/new')}
      />
      <View style={styles.calendar}>
        <DayStrip
          days={planning?.days ?? []}
          selectedIndex={selectedDay ?? 0}
          onSelectDay={handleSelectDay}
        />
      </View>
    </View>
  );

  const placeholder = isLoading ? (
    <LoadingState />
  ) : status === 'error' ? (
    <ErrorState onRetry={refresh} />
  ) : (
    <EmptyState key={`empty-${selectedDay}`} onPlan={() => router.push('/appointment/new')} />
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          {/* One scroll for the whole page. Swipeable left/right to flip days. */}
          <GestureDetector gesture={swipeGesture}>
            <Timeline
              items={isLoading || status === 'error' ? [] : scenario.items}
              nowMin={scenario.nowMin}
              header={header}
              placeholder={placeholder}
              dayKey={selectedDay}
              direction={directionRef.current}
            />
          </GestureDetector>
        </Animated.View>
      </SafeAreaView>

      <BottomDock activeIndex={1} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
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
  // The one gap between the week and the day below it, owned entirely by the
  // header block now that it scrolls inside the list: the strip sits exactly
  // one `section` above the first card, the same air the Home puts between its
  // own sections. It belongs to the paper, not to a calendar surface.
  calendar: {
    paddingBottom: Spacing.section,
  },
}));
