import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock, useBottomDockClearance } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { SectionCard } from '@/components/documents/shared/primitives';
import { SwitchRow } from '@/components/plus/resource/SwitchRow';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { SETTINGS, updateSettings } from '@/data/plus/settings';

export default function RelancesScreen() {
  const router = useRouter();
  const dockClearance = useBottomDockClearance();
  const [enabled, setEnabled] = useState(SETTINGS.autoRemindersEnabled);
  const [quoteDays, setQuoteDays] = useState(String(SETTINGS.quoteReminderDays));
  const [invoiceDays, setInvoiceDays] = useState(String(SETTINGS.invoiceReminderDays));

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    updateSettings({ autoRemindersEnabled: value });
  };

  const handleSave = () => {
    updateSettings({
      quoteReminderDays: Number(quoteDays.replace(/\D/g, '')) || SETTINGS.quoteReminderDays,
      invoiceReminderDays: Number(invoiceDays.replace(/\D/g, '')) || SETTINGS.invoiceReminderDays,
    });
    Alert.alert('Relances mises à jour', 'Vos réglages de relance automatique ont été enregistrés.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Relances automatiques" onBack={() => router.back()} />

        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: dockClearance }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <SectionCard>
            <SwitchRow
              label="Activer les relances automatiques"
              description="Rondivo relance vos clients à votre place"
              value={enabled}
              onValueChange={handleToggle}
            />
          </SectionCard>

          {enabled ? (
            <FormSection title="Délais" icon="clock">
              <FormField label="Relancer un devis en attente après (jours)" value={quoteDays} onChangeText={setQuoteDays} placeholder="5" keyboardType="number-pad" />
              <FormField label="Relancer une facture impayée après (jours)" value={invoiceDays} onChangeText={setInvoiceDays} placeholder="7" keyboardType="number-pad" />
            </FormSection>
          ) : null}

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
  },
}));
