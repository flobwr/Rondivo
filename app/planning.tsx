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
import { ROW_GAP } from '@/components/planning/timeline-metrics';
import { createThemedStyles, Palette, SettleSpring, Spacing, Timing } from '@/theme';
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
  // Height of the floating composition, measured rather than guessed: it is
  // what holds the day's first card clear of the week at rest, and it changes
  // with the user's text size.
  const [compositionHeight, setCompositionHeight] = useState(0);
  const fadeIn = useRef(new Animated.Value(0)).current;
  // Directional day transition: the day's content slides in from the side the
  // navigation came from, so switching days reads like flipping pages.
  const transition = useRef(new Animated.Value(1)).current;
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
        directionRef.current = index > current ? 1 : -1;
        transition.setValue(0);
        Animated.spring(transition, { toValue: 1, useNativeDriver: true, ...SettleSpring }).start();
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

  const scenario =
    planning && selectedDay !== null
      ? (planning.scenariosByDayIndex[selectedDay] ?? { items: [] })
      : { items: [] };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          {/* The day owns the WHOLE page and scrolls from the very top of it,
              passing behind the composition above. Swipeable left/right to
              flip between days. */}
          <GestureDetector gesture={swipeGesture}>
            <Animated.View
              style={[styles.flex, { opacity: transition, transform: [{ translateX: slideX }] }]}>
              {isLoading ? (
                <View style={{ paddingTop: compositionHeight }}>
                  <LoadingState />
                </View>
              ) : status === 'error' ? (
                <View style={{ paddingTop: compositionHeight }}>
                  <ErrorState onRetry={refresh} />
                </View>
              ) : scenario.items.length > 0 ? (
                <Timeline
                  key={selectedDay}
                  items={scenario.items}
                  nowMin={scenario.nowMin}
                  topInset={compositionHeight}
                />
              ) : (
                <View style={{ paddingTop: compositionHeight }}>
                  <EmptyState
                    key={`empty-${selectedDay}`}
                    onPlan={() => router.push('/appointment/new')}
                  />
                </View>
              )}
            </Animated.View>
          </GestureDetector>

          {/* The composition floats above the day, and the page passes through
              it from one exact line: the bottom of the masthead.

              ABOVE that line — the month, its grounding line, the add action —
              the paper is solid, so nothing scrolls through the title.
              BELOW it the week has NO surface whatsoever: not a card, not a
              capsule, not a scrim, not even a band of paper. Cards travel
              BETWEEN the week and the page and stay fully visible as they pass
              behind the dates, which is only possible because the glyphs are
              the only thing that exists down there.

              `box-none` so the day scrolls under the empty space between the
              dates; only the cells and the add action take a touch. */}
          <View
            style={styles.composition}
            pointerEvents="box-none"
            onLayout={(e) => setCompositionHeight(e.nativeEvent.layout.height)}>
            <View style={styles.masthead}>
              <PlanningHeader
                monthLabel={planning?.monthLabel ?? ''}
                summary={summarise(scenario)}
                loading={isLoading}
                onAdd={() => router.push('/appointment/new')}
              />
            </View>
            <View style={styles.calendar}>
              <DayStrip
                days={planning?.days ?? []}
                selectedIndex={selectedDay ?? 0}
                onSelectDay={handleSelectDay}
              />
            </View>
          </View>
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
  // The one gap between the week and the day below it. `Timeline` already
  // opens on ROW_GAP, so this holds back only the remainder — the two
  // together land the strip exactly one `section` above the first card,
  // which is the same air the Home puts between its own sections. It is part
  // of the measured height, so it holds whether the day is at rest or not.
  calendar: {
    paddingBottom: Spacing.section - ROW_GAP,
  },
  // Floating, and deliberately without `backgroundColor`: only the masthead
  // inside it is opaque, so the page shows through from the week down.
  composition: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  // Solid paper — the exact colour of the page, so the boundary is invisible
  // while nothing is moving. This is where the transparency starts: the day
  // passes behind the week below it and is hidden behind the title above it.
  masthead: {
    backgroundColor: Palette.screen,
  },
}));
