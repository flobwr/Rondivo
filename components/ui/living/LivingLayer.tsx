import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/contexts/theme';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
  getElevation,
  LivingContent,
  LivingDismiss,
  LivingSpring,
  Timing,
} from '@/theme';
import type { LivingContextValue, LivingHandle, LivingSource } from './types';

const LivingContext = createContext<LivingContextValue | null>(null);

/**
 * Access the living layer. Call sites normally use `<LivingCard>` rather than
 * this hook; it exists for the rare surface that is not a card.
 */
export function useLiving(): LivingContextValue {
  const value = useContext(LivingContext);
  if (!value) {
    throw new Error('useLiving must be used inside <LivingLayer>. Mount it in app/_layout.tsx.');
  }
  return value;
}

/**
 * The one layer above the whole app where cards live out their expansion.
 *
 * WHY A LAYER AND NOT A ROUTE — the app cannot morph a card into a screen by
 * navigating: pushing a route mounts a new screen in its own native view
 * hierarchy while the source screen is frozen or unmounted, so there is no
 * single object left to transform; Reanimated 4 removed `sharedTransitionTag`
 * (the only official shared-element API in React Native) and react-native-
 * screens has no equivalent; and a card inside a `FlatList` is clipped by it,
 * so it could never travel beyond its row. Any "shared element" built on top
 * of navigation here would be a cross-fade between two look-alikes.
 *
 * So Rondivo does not navigate for this. The card is re-drawn ONCE, inside
 * this layer, at the exact window rectangle it occupies in the list, and then
 * that single surface is transformed into the detail — one object, one
 * continuous movement, one `progress` value living on the UI thread. The list
 * underneath never unmounts, which is also why the return is exact rather
 * than approximate: the surface lands on the rectangle it was born from.
 *
 * Everything here runs as a worklet. No frame of the transition needs the JS
 * thread, so a slow render elsewhere cannot stutter the movement.
 */
export function LivingLayer({ children }: { children: ReactNode }) {
  const [source, setSource] = useState<LivingSource | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const { palette, resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const elevation = getElevation(resolvedTheme);

  /** 0 = sitting in the list, 1 = fully expanded. The whole language. */
  const progress = useSharedValue(0);
  /** Live finger travel, in points. Only meaningful while expanded. */
  const drag = useSharedValue(0);

  const present = useCallback(
    (next: LivingSource) => {
      progress.value = 0;
      drag.value = 0;
      setSource(next);
    },
    [progress, drag]
  );

  // Runs on the JS thread once the surface has landed back on the card.
  const settle = useCallback(() => {
    setSource((current) => {
      current?.onSettled();
      return null;
    });
  }, []);

  const collapse = useCallback(() => {
    if (reducedMotion) {
      progress.value = withTiming(0, Timing.quick, (finished) => {
        if (finished) runOnJS(settle)();
      });
      return;
    }
    progress.value = withSpring(0, LivingSpring, (finished) => {
      if (finished) runOnJS(settle)();
    });
  }, [progress, reducedMotion, settle]);

  // Expansion starts the frame after the surface has been laid out at the
  // source rectangle, so frame 0 is the card exactly as the list drew it.
  useEffect(() => {
    if (!source) return;
    progress.value = reducedMotion
      ? withTiming(1, Timing.content)
      : withSpring(1, LivingSpring);
  }, [source, progress, reducedMotion]);

  const value = useMemo<LivingContextValue>(
    () => ({ present, dismiss: collapse }),
    [present, collapse]
  );

  const handle = useMemo<LivingHandle>(() => ({ close: collapse }), [collapse]);

  // ——— Geometry ———
  // Captured as plain numbers: the worklets below are rebuilt whenever a new
  // card is presented, which is the only time these can change.
  const from = source?.rect;
  const inset = source?.expandedInset ?? 0;
  const to = {
    x: inset,
    y: inset,
    width: windowWidth - inset * 2,
    height: windowHeight - inset * 2,
  };
  const fromRadius = source?.radius ?? 0;
  const toRadius = source?.expandedRadius ?? 0;

  const surfaceStyle = useAnimatedStyle(() => {
    if (!from) return {};
    const p = progress.value;
    // The surface shrinks as it is pulled, and that shrink is scaled by `p`
    // so it unwinds on its own as the card collapses — one value, no second
    // animation to keep in sync.
    const pulled = interpolate(
      drag.value,
      [0, LivingDismiss.scaleTravel],
      [1, LivingDismiss.scaleAtLimit],
      Extrapolation.CLAMP
    );
    return {
      left: interpolate(p, [0, 1], [from.x, to.x]),
      top: interpolate(p, [0, 1], [from.y, to.y]),
      width: interpolate(p, [0, 1], [from.width, to.width]),
      height: interpolate(p, [0, 1], [from.height, to.height]),
      borderRadius: interpolate(p, [0, 1], [fromRadius, toRadius]),
      transform: [{ translateY: drag.value * p }, { scale: 1 - (1 - pulled) * p }],
    };
  });

  // The deeper shadow rides in behind the surface rather than replacing the
  // card's own: at rest it contributes nothing, so the first frame carries
  // exactly the light the list carried.
  const shadowStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const scrimStyle = useAnimatedStyle(() => {
    const p = progress.value;
    const pulled = interpolate(
      drag.value,
      [0, LivingDismiss.scaleTravel],
      [1, 0.4],
      Extrapolation.CLAMP
    );
    return {
      opacity: interpolate(p, LivingContent.scrimIn, [0, 1], Extrapolation.CLAMP) * pulled,
    };
  });

  const clipStyle = useAnimatedStyle(() => ({
    borderRadius: interpolate(progress.value, [0, 1], [fromRadius, toRadius]),
  }));

  const summaryStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      LivingContent.summaryOut,
      [1, 0],
      Extrapolation.CLAMP
    ),
  }));

  const detailStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      progress.value,
      LivingContent.detailIn,
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  // Pull down to close. The surface follows the finger from the first pixel;
  // the thresholds only decide what happens on release.
  const pull = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetY([-14, 14])
        .failOffsetX([-24, 24])
        .onUpdate((e) => {
          drag.value = Math.max(0, e.translationY);
        })
        .onEnd((e) => {
          const shouldClose =
            drag.value > LivingDismiss.distance || e.velocityY > LivingDismiss.velocity;
          if (shouldClose) {
            progress.value = withSpring(0, LivingSpring, (finished) => {
              if (finished) runOnJS(settle)();
            });
            return;
          }
          drag.value = withSpring(0, LivingSpring);
        }),
    [drag, progress, settle]
  );

  return (
    <LivingContext.Provider value={value}>
      {children}

      {source ? (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View
            style={[StyleSheet.absoluteFill, { backgroundColor: palette.scrim }, scrimStyle]}
            pointerEvents="none"
          />

          {/* Shadow plate — a sibling, so its opacity never touches the
              surface's own contents. */}
          <Animated.View
            style={[
              styles.plate,
              { backgroundColor: palette.card },
              elevation.raised,
              surfaceStyle,
              shadowStyle,
            ]}
            pointerEvents="none"
          />

          <GestureDetector gesture={pull}>
            <Animated.View style={[styles.plate, { backgroundColor: palette.card }, surfaceStyle]}>
              {/* Detail: laid out at its FINAL size from the first frame and
                  revealed by the growing clip, so nothing reflows mid-flight —
                  the words do not move, the surface uncovers them. */}
              <Animated.View style={[StyleSheet.absoluteFill, styles.clip, clipStyle]}>
                <Animated.View
                  style={[{ width: to.width, height: to.height }, detailStyle]}
                  pointerEvents="box-none">
                  {source.renderDetail(handle)}
                </Animated.View>
              </Animated.View>

              {/* Summary: the card itself, redrawn at its own size and pinned
                  to the top-left so it holds still while the surface grows
                  out from under it. */}
              <Animated.View
                style={[styles.summary, { width: from?.width }, summaryStyle]}
                pointerEvents="none">
                {source.renderSummary()}
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </View>
      ) : null}
    </LivingContext.Provider>
  );
}

const styles = StyleSheet.create({
  plate: {
    position: 'absolute',
  },
  clip: {
    overflow: 'hidden',
  },
  summary: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
