import { StyleSheet, View } from 'react-native';

import { AppSkeleton } from '@/components/ui';
import { Palette, Spacing } from '@/constants/design';
import {
  CARD_HEIGHT,
  DOT_SIZE,
  GUTTER_PADDING_TOP,
  GUTTER_WIDTH,
  ROW_GAP,
  TIME_GAP,
} from './timeline-metrics';

const ROWS = [0, 1, 2, 3];
const TIME_PILL_WIDTH = 30;
const TIME_PILL_HEIGHT = 11;

/**
 * Skeleton mirroring the timeline layout — same gutter, same dot, same card
 * height — so the real content lands exactly where the placeholder was and the
 * screen never jumps at the end of a load.
 */
export function LoadingState() {
  return (
    <View style={styles.container}>
      {ROWS.map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.gutter}>
            <AppSkeleton width={TIME_PILL_WIDTH} height={TIME_PILL_HEIGHT} radius="tile" />
            <View style={styles.dot} />
          </View>
          <View style={styles.card}>
            <AppSkeleton height={CARD_HEIGHT} radius="card" />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    marginBottom: ROW_GAP,
  },
  gutter: {
    width: GUTTER_WIDTH,
    alignItems: 'center',
    paddingTop: GUTTER_PADDING_TOP,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Palette.border,
    marginTop: TIME_GAP,
  },
  card: {
    flex: 1,
  },
});
