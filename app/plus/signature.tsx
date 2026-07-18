import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { SectionCard } from '@/components/documents/shared/primitives';
import { SwitchRow } from '@/components/plus/resource/SwitchRow';
import { Palette, Radius, Spacing } from '@/theme';
import { SETTINGS, updateSettings } from '@/data/plus/settings';

export default function SignatureScreen() {
  const router = useRouter();
  const [name, setName] = useState(SETTINGS.signatureName);
  const [enabled, setEnabled] = useState(SETTINGS.hasSignature);

  const handleSave = () => {
    updateSettings({ signatureName: name.trim(), hasSignature: enabled && name.trim().length > 0 });
    Alert.alert('Signature enregistrée', 'Elle apparaîtra désormais sur vos documents.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Signature" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title="Signature" icon="edit-2">
            <FormField label="Nom affiché" value={name} onChangeText={setName} placeholder="Votre nom" />
          </FormSection>

          {name.trim().length > 0 ? (
            <View style={styles.preview}>
              <Text style={styles.previewLabel}>Aperçu</Text>
              <Text style={styles.previewSignature}>{name}</Text>
            </View>
          ) : null}

          <SectionCard style={styles.toggleCard}>
            <SwitchRow
              label="Utiliser cette signature"
              description="Ajoutée automatiquement sur vos devis et factures"
              value={enabled}
              onValueChange={setEnabled}
            />
          </SectionCard>

          <FormSubmitButton label="Enregistrer les modifications" onPress={handleSave} />
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
  preview: {
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
    paddingVertical: 18,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  previewLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: Palette.textTertiary,
    marginBottom: 8,
  },
  previewSignature: {
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  toggleCard: {
    marginTop: Spacing.section,
  },
});
