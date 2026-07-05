import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { InterventionPickerSheet } from '@/components/documents/imports/InterventionPickerSheet';
import { Palette, Radius, Spacing } from '@/constants/design';
import { getClientById } from '@/data/clients';
import { PHOTO_INTERVENTIONS, PhotoIntervention } from '@/data/documents/photos';

const VALIDITY_PRESETS = [
  { label: '15 jours', days: 15 },
  { label: '30 jours', days: 30 },
  { label: '60 jours', days: 60 },
];

export default function NewDevisScreen() {
  const router = useRouter();
  const { interventionId } = useLocalSearchParams<{ interventionId?: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [intervention, setIntervention] = useState<PhotoIntervention | null>(null);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [validityDays, setValidityDays] = useState(30);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!interventionId) return;
    const preselected = PHOTO_INTERVENTIONS.find((i) => i.id === interventionId);
    if (preselected) {
      setIntervention(preselected);
      setClient(getClientById(preselected.clientId) ?? null);
    }
  }, [interventionId]);

  const handleSelectIntervention = (selected: PhotoIntervention) => {
    setIntervention(selected);
    setClient(getClientById(selected.clientId) ?? null);
    setInterventionPickerOpen(false);
  };

  const handleCreate = () => {
    if (!client) {
      Alert.alert('Client requis', 'Choisissez un client pour créer le devis.');
      return;
    }
    Alert.alert('Devis créé', `Le devis pour ${client.name} a bien été créé.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Nouveau devis" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title="Client">
            <FormField
              label="Client"
              value={client?.name}
              placeholder="Choisir un client"
              onPress={() => setClientPickerOpen(true)}
            />
          </FormSection>

          <FormSection title="Montant estimé">
            <FormField
              label="Montant (TTC)"
              value={amount}
              placeholder="0 €"
              keyboardType="decimal-pad"
              onChangeText={setAmount}
            />
          </FormSection>

          <View style={styles.validitySection}>
            <Text style={styles.validityLabel}>Durée de validité</Text>
            <View style={styles.validityRow}>
              {VALIDITY_PRESETS.map((preset) => {
                const active = preset.days === validityDays;
                return (
                  <Pressable
                    key={preset.days}
                    onPress={() => setValidityDays(preset.days)}
                    style={[styles.validityPill, active ? styles.validityPillActive : null]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}>
                    <Text style={[styles.validityPillText, active ? styles.validityPillTextActive : null]}>
                      {preset.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <FormSection title="Détails">
            <FormField
              label="Intervention liée"
              value={intervention?.label}
              placeholder="Aucune"
              onPress={() => setInterventionPickerOpen(true)}
            />
            <FormField
              label="Notes"
              value={notes}
              placeholder="Ajouter une note interne…"
              onChangeText={setNotes}
              multiline
            />
          </FormSection>

          <FormSubmitButton label="Créer le devis" onPress={handleCreate} />
        </ScrollView>
      </SafeAreaView>

      <ClientPickerSheet
        visible={clientPickerOpen}
        onClose={() => setClientPickerOpen(false)}
        onSelect={(selected) => {
          setClient(selected);
          setClientPickerOpen(false);
        }}
        selectedId={client?.id}
      />

      <InterventionPickerSheet
        visible={interventionPickerOpen}
        onClose={() => setInterventionPickerOpen(false)}
        onSelect={handleSelectIntervention}
      />
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
  validitySection: {
    marginTop: Spacing.section,
  },
  validityLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginLeft: 2,
  },
  validityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  validityPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: Radius.tile,
    backgroundColor: Palette.card,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  validityPillActive: {
    backgroundColor: Palette.blueSoft,
    borderColor: Palette.blue,
  },
  validityPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  validityPillTextActive: {
    color: Palette.blue,
  },
});
