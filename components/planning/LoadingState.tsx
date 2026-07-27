import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/components/ui/Shimmer';
import { Radius } from '@/theme';
import {
  BRANCH_LEN,
  CARD_HEIGHT,
  DOT_CENTER,
  DOT_SIZE,
  GUTTER_WIDTH,
  LIST_PADDING_H,
  ROW_GAP,
} from './timeline-metrics';

/** Height of a travel capsule: its GPS button plus the capsule's own padding. */
const CAPSULE_HEIGHT = 46;

/** The shape of a real day — jobs, separated by the road between them. */
const ROWS: ('card' | 'travel')[] = ['card', 'travel', 'card', 'travel', 'card'];

/**
 * Skeleton mirroring the timeline — same gutter, same dot size anchored at the
 * same height, same card height, same alternation of jobs and travel legs — so
 * the real content lands exactly where the placeholder was and nothing shifts
 * at the end of a load.
 */
export function LoadingState() {
  return (
    <View style={styles.container}>
      {ROWS.map((kind, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.gutter}>
            {kind === 'card' ? <Shimmer style={styles.dot} /> : null}
          </View>
          <Shimmer style={kind === 'card' ? styles.card : styles.capsule} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  // No top padding: the skeleton stands in for the rows inside the list, and
  // the air under the week is owned by the header block above it.
  container: {
    paddingHorizontal: LIST_PADDING_H,
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
    borderRadius: Radius.pill,
  },
  card: {
    flex: 1,
    height: CARD_HEIGHT,
    borderRadius: Radius.card,
    marginLeft: BRANCH_LEN,
  },
  capsule: {
    width: '66%',
    height: CAPSULE_HEIGHT,
    borderRadius: Radius.pill,
    marginLeft: BRANCH_LEN,
  },
});
