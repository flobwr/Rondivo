import { StyleSheet, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { Shimmer } from '@/components/ui/Shimmer';

// Skeleton that mirrors the timeline layout so the load feels seamless.
export function LoadingState() {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((i) => (
        <View key={i} style={styles.row}>
          <View style={styles.gutter}>
            <Shimmer style={styles.timePill} />
            <View style={styles.dot} />
          </View>
          <Shimmer style={styles.card} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  gutter: {
    width: 50,
    alignItems: 'center',
    paddingTop: 14,
  },
  timePill: {
    width: 30,
    height: 11,
    borderRadius: 6,
    marginBottom: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.border,
  },
  card: {
    flex: 1,
    height: 76,
    borderRadius: Radius.card,
  },
});
