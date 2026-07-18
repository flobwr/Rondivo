import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { PLUS_ITEMS, PlusItemId } from '@/components/plus/registry';
import { createThemedStyles, Palette } from '@/theme';

export default function PlusDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const item = PLUS_ITEMS[slug as PlusItemId];

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={item?.title ?? 'Plus'} onBack={() => router.back()} />
        <EmptyState
          icon={item?.icon ?? 'tool'}
          title="Bientôt disponible"
          subtitle={item?.description || 'Cette fonctionnalité arrive prochainement.'}
        />
      </SafeAreaView>
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
}));
