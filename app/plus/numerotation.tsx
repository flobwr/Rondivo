import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { SETTINGS, updateSettings } from '@/data/plus/settings';

export default function NumerotationScreen() {
  const router = useRouter();
  const [quotePrefix, setQuotePrefix] = useState(SETTINGS.quotePrefix);
  const [quoteNextNumber, setQuoteNextNumber] = useState(String(SETTINGS.quoteNextNumber));
  const [invoicePrefix, setInvoicePrefix] = useState(SETTINGS.invoicePrefix);
  const [invoiceNextNumber, setInvoiceNextNumber] = useState(String(SETTINGS.invoiceNextNumber));

  const handleSave = () => {
    updateSettings({
      quotePrefix: quotePrefix.trim(),
      quoteNextNumber: Number(quoteNextNumber.replace(/\D/g, '')) || SETTINGS.quoteNextNumber,
      invoicePrefix: invoicePrefix.trim(),
      invoiceNextNumber: Number(invoiceNextNumber.replace(/\D/g, '')) || SETTINGS.invoiceNextNumber,
    });
    Alert.alert('Numérotation mise à jour', 'Vos prochains documents utiliseront cette numérotation.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Numérotation" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title="Devis" icon="edit-3">
            <FormField label="Préfixe" value={quotePrefix} onChangeText={setQuotePrefix} placeholder="DE-2026-" />
            <FormField label="Prochain numéro" value={quoteNextNumber} onChangeText={setQuoteNextNumber} placeholder="1" keyboardType="number-pad" />
          </FormSection>

          <FormSection title="Factures" icon="file-text">
            <FormField label="Préfixe" value={invoicePrefix} onChangeText={setInvoicePrefix} placeholder="FA-2026-" />
            <FormField label="Prochain numéro" value={invoiceNextNumber} onChangeText={setInvoiceNextNumber} placeholder="1" keyboardType="number-pad" />
          </FormSection>

          <FormSubmitButton label="Enregistrer les modifications" onPress={handleSave} />
        </ScrollView>
      </SafeAreaView>

      <BottomDock activeIndex={4} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
}));
