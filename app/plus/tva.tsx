import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { SelectableList, type SelectableOption } from '@/components/plus/resource/SelectableList';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { Palette, Spacing } from '@/constants/design';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getSettings, updateSettings, VAT_RATE_OPTIONS, type VatRate } from '@/services/plus/settings';

const OPTIONS: SelectableOption<VatRate>[] = VAT_RATE_OPTIONS.map((rate) => ({
  key: rate,
  label: `${rate} %`,
  description:
    rate === 20
      ? 'Taux normal'
      : rate === 10
        ? 'Taux intermédiaire'
        : rate === 5.5
          ? 'Taux réduit'
          : 'Exonération de TVA',
}));

export default function TvaScreen() {
  const router = useRouter();
  const fetchSettings = useCallback(() => getSettings(), []);
  const { data: settings, status, refresh } = useAsyncItem(fetchSettings);

  const [rate, setRate] = useState<VatRate>(20);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (settings && !initialized) {
      setRate(settings.defaultVatRate);
      setInitialized(true);
    }
  }, [settings, initialized]);

  const handleSelect = (key: VatRate) => {
    setRate(key);
    updateSettings({ defaultVatRate: key });
  };

  const isLoading = status === 'loading' || !initialized;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="TVA par défaut" onBack={() => router.back()} />

        {isLoading ? (
          status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
          ) : (
            <View style={styles.content}>
              <SkeletonBlock height={160} radius={20} />
            </View>
          )
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.intro}>Ce taux sera proposé par défaut à la création d’un devis ou d’une facture.</Text>
            <SelectableList options={OPTIONS} selected={rate} onSelect={handleSelect} />
          </ScrollView>
        )}
      </SafeAreaView>

      <BottomNav activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  intro: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
});
