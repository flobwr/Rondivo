import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { SelectableList, type SelectableOption } from '@/components/plus/resource/SelectableList';
import { Palette, Spacing } from '@/constants/design';
import { Language, SETTINGS, updateSettings } from '@/data/plus/settings';

const OPTIONS: SelectableOption<Language>[] = [
  { key: 'fr', label: 'Français' },
  { key: 'en', label: 'English' },
];

export default function LangueScreen() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>(SETTINGS.language);

  const handleSelect = (key: Language) => {
    setLanguage(key);
    updateSettings({ language: key });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Langue" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SelectableList options={OPTIONS} selected={language} onSelect={handleSelect} />
        </ScrollView>
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
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section,
  },
});
