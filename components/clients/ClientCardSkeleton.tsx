import { StyleSheet, View } from 'react-native';

import { cardShadow, Palette, Radius } from '@/theme';
import { Shimmer } from '@/components/ui/Shimmer';

/** A single skeleton row that mirrors the minimalist {@link ClientCard}. */
export function ClientCardSkeleton() {
  return (
    <View style={styles.card}>
      <Shimmer style={styles.avatar} />
      <View style={styles.info}>
        <Shimmer style={[styles.line, { width: '52%' }]} />
        <Shimmer style={[styles.line, styles.badge, { width: '34%' }]} />
        <Shimmer style={[styles.line, styles.address, { width: '68%' }]} />
      </View>
      <Shimmer style={styles.circle} />
    </View>
  );
}

/** A short stack of skeleton rows for the initial page load. */
export function ClientListSkeleton({ count = 7 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} style={i > 0 ? styles.gap : null}>
          <ClientCardSkeleton />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingTop: 2,
  },
  gap: {
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  info: {
    flex: 1,
    gap: 7,
  },
  line: {
    height: 11,
    borderRadius: 6,
  },
  badge: {
    height: 15,
    borderRadius: 8,
  },
  address: {
    height: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
