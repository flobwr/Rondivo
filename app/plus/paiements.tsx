import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { SelectableList, type SelectableOption } from '@/components/plus/resource/SelectableList';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { PAYMENT_METHOD_OPTIONS, SETTINGS, updateSettings } from '@/data/plus/settings';

const OPTIONS: SelectableOption<string>[] = PAYMENT_METHOD_OPTIONS.map((method) => ({ key: method, label: method }));

export default function PaiementsScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState<string[]>(SETTINGS.paymentMethods);
  const [iban, setIban] = useState(SETTINGS.iban);

  const toggleMethod = (method: string) => {
    const next = methods.includes(method) ? methods.filter((m) => m !== method) : [...methods, method];
    setMethods(next);
    updateSettings({ paymentMethods: next });
  };

  const handleIbanChange = (value: string) => {
    setIban(value);
    updateSettings({ iban: value.trim() });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Paiements" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Text style={styles.intro}>Sélectionnez les moyens de paiement acceptés — ils apparaîtront sur vos factures.</Text>
          <SelectableList options={OPTIONS} selected={methods} onSelect={toggleMethod} />

          {methods.includes('Virement bancaire') ? (
            <FormSection title="Coordonnées bancaires" icon="hash">
              <FormField label="IBAN" value={iban} onChangeText={handleIbanChange} placeholder="FR76 0000 0000 0000 0000 0000 000" />
            </FormSection>
          ) : null}
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
  intro: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
}));
