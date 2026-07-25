import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/components/ui/Shimmer';
import { Radius, Spacing } from '@/theme';
import { CARD_HEIGHT, DOT_CENTER, DOT_SIZE, GUTTER_WIDTH, LIST_PADDING_H, ROW_GAP } from './timeline-metrics';

const ROWS = [0, 1, 2];

/**
 * Skeleton mirroring the timeline — same gutter, same dot size anchored at the
 * same height, same card height — so the real content lands exactly where the
 * placeholder was and nothing shifts at the end of a load.
 */
export function LoadingState() {
  return (
    <View style={styles.container}>
      {ROWS.map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.gutter}>
            <Shimmer style={styles.dot} />
          </View>
          <Shimmer style={styles.card} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: LIST_PADDING_H,
    paddingTop: Spacing.section,
  },
  row: {
    flexDirection: 'row',
    marginBottom: ROW_GAP,
  },
  gutter: {
    width: GUTTER_WIDTH,
    alignItems: 'center',
    // Anchors the placeholder dot on the same centre line as the real one.
    paddingTop: DOT_CENTER.card - DOT_SIZE / 2,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  card: {
    flex: 1,
    height: CARD_HEIGHT,
    borderRadius: Radius.card,
  },
});
