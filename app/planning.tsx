import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
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
import { createThemedStyles, Palette, paperFade, SettleSpring, Spacing, Timing } from '@/theme';
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

/** Paper held solid over the first quarter of the dissolve, then faded out. */
const FADE_STOPS: [number, number] = [0.25, 1];

// ── Screen ────────────────────────────────────────────────────────────────────

export default function PlanningScreen() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const fadeIn = useRef(new Animated.Value(0)).current;
  // Strength of the paper dissolve under the week: 0 while the day rests at
  // its top, 1 as soon as it moves.
  const dissolve = useRef(new Animated.Value(0)).current;
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

  useEffect(() => {
    Animated.timing(dissolve, {
      toValue: scrolled ? 1 : 0,
      useNativeDriver: true,
      ...Timing.quick,
    }).start();
  }, [scrolled, dissolve]);

  const handleSelectDay = useCallback(
    (index: number) => {
      // A new day opens at its top — `Timeline` is remounted, so its scroll
      // position and the dissolve above it both start over.
      setScrolled(false);
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
          {/* Fixed composition — the month, its grounding line, the add action
              and the week all stay put. Nothing here has a card, a capsule or
              a background of its own: the masthead and the day strip sit
              straight on the paper, and the air between them is owned here
              rather than baked into either component. */}
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

          {/* Scrollable content, always below the fixed composition. Swipeable
              left/right to flip between days. */}
          <View style={styles.content}>
            <GestureDetector gesture={swipeGesture}>
              <Animated.View
                style={[styles.flex, { opacity: transition, transform: [{ translateX: slideX }] }]}>
                {isLoading ? (
                  <LoadingState />
                ) : status === 'error' ? (
                  <ErrorState onRetry={refresh} />
                ) : scenario.items.length > 0 ? (
                  <Timeline
                    key={selectedDay}
                    items={scenario.items}
                    nowMin={scenario.nowMin}
                    onScrolledChange={setScrolled}
                  />
                ) : (
                  <EmptyState key={`empty-${selectedDay}`} onPlan={() => router.push('/appointment/new')} />
                )}
              </Animated.View>
            </GestureDetector>

            {/* The day dissolves into the page as it scrolls under the week,
                the same way it passes under the dock at the other end. Not a
                surface: it is the paper's own colour fading out, so a card is
                never sliced in half against the calendar.

                It only exists WHILE the day is moving. At rest there is
                nothing to dissolve, and a permanent band — however close to
                the paper — is exactly the horizon that made the top of the
                screen read as a separate block. So the page shows one
                uninterrupted surface when still, and the dissolve rises only
                to swallow content on its way under the week. */}
            <Animated.View
              style={[styles.topFade, { opacity: dissolve }]}
              pointerEvents="none">
              <LinearGradient
                colors={paperFade(Palette)}
                // Holds the paper solid over the first quarter, so the cut
                // edge of a card is fully masked before the dissolve starts.
                locations={FADE_STOPS}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
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
  // which is the same air the Home puts between its own sections.
  calendar: {
    paddingBottom: Spacing.section - ROW_GAP,
  },
  content: {
    flex: 1,
  },
  // Tall enough that a card crossing it is already gone before its cut edge
  // could read as a line. At `Spacing.xl` it was too short: the top of a card
  // stayed visible as a hard horizontal edge under the week.
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Spacing.section + Spacing.xl,
  },
}));
