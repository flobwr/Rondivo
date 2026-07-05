import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { SelectableList, type SelectableOption } from '@/components/plus/resource/SelectableList';
import { Palette, Spacing } from '@/constants/design';
import { DOCUMENT_TEMPLATES, TEMPLATE_STYLE_META, TEMPLATE_STYLE_ORDER, TemplateStyle, updateDocumentTemplate } from '@/data/plus/templates';

const OPTIONS: SelectableOption<TemplateStyle>[] = TEMPLATE_STYLE_ORDER.map((style) => ({
  key: style,
  label: TEMPLATE_STYLE_META[style].label,
  description: TEMPLATE_STYLE_META[style].description,
  accent: TEMPLATE_STYLE_META[style].accent,
}));

export default function ModelesFacturesScreen() {
  const router = useRouter();
  const [style, setStyle] = useState<TemplateStyle>(DOCUMENT_TEMPLATES.factures);

  const handleSelect = (key: TemplateStyle) => {
    setStyle(key);
    updateDocumentTemplate('factures', key);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Modèles de factures" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>Choisissez la présentation utilisée pour vos factures.</Text>
          <SelectableList options={OPTIONS} selected={style} onSelect={handleSelect} />
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
