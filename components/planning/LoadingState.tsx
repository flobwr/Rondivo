import { StyleSheet, View } from 'react-native';

import { Shimmer } from '@/components/ui/Shimmer';

// Skeleton that mirrors the loaded layout — rail dots and tall cards — so the
// load feels seamless.
export function LoadingState() {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((i) => (
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
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  gutter: {
    width: 36,
    alignItems: 'center',
    paddingTop: 17,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  card: {
    flex: 1,
    height: 100,
    borderRadius: 24,
  },
});
