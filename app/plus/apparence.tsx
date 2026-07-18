import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { SelectableList, type SelectableOption } from '@/components/plus/resource/SelectableList';
import { Palette, Spacing } from '@/theme';
import { useTheme } from '@/contexts/theme';
import { Appearance } from '@/services/plus/settings';

const OPTIONS: SelectableOption<Appearance>[] = [
  { key: 'clair', label: 'Clair' },
  { key: 'sombre', label: 'Sombre' },
  { key: 'auto', label: 'Automatique', description: 'Suit les réglages de votre téléphone' },
];

export default function ApparenceScreen() {
  const router = useRouter();
  const { appearance, setAppearance } = useTheme();

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Apparence" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>Choisissez l’apparence de Rondivo sur cet appareil.</Text>
          <SelectableList options={OPTIONS} selected={appearance} onSelect={setAppearance} />
        </ScrollView>
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
