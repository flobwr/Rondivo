import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { SelectableList, type SelectableOption } from '@/components/plus/resource/SelectableList';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { Palette, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { Language, getSettings, updateSettings } from '@/services/plus/settings';

const OPTIONS: SelectableOption<Language>[] = [
  { key: 'fr', label: 'Français' },
  { key: 'en', label: 'English' },
];

export default function LangueScreen() {
  const router = useRouter();
  const fetchSettings = useCallback(() => getSettings(), []);
  const { data: settings, status, refresh } = useAsyncItem(fetchSettings);

  const [language, setLanguage] = useState<Language>('fr');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (settings && !initialized) {
      setLanguage(settings.language);
      setInitialized(true);
    }
  }, [settings, initialized]);

  const handleSelect = (key: Language) => {
    setLanguage(key);
    updateSettings({ language: key });
  };

  const isLoading = status === 'loading' || !initialized;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Langue" onBack={() => router.back()} />

        {isLoading ? (
          status === 'error' ? (
            <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
          ) : (
            <View style={styles.content}>
              <SkeletonBlock height={100} radius={20} />
            </View>
          )
        ) : (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <SelectableList options={OPTIONS} selected={language} onSelect={handleSelect} />
          </ScrollView>
        )}
      </SafeAreaView>

      <BottomDock activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section,
  },
});
