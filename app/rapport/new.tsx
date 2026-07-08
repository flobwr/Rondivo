import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { InterventionPickerSheet } from '@/components/documents/imports/InterventionPickerSheet';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { Palette, Spacing } from '@/constants/design';
import { getClientById } from '@/data/clients';
import { formatShortDate } from '@/data/documents/date-utils';
import { PHOTO_INTERVENTIONS, PhotoIntervention } from '@/data/documents/photos';
import { MOCK_RAPPORTS, RapportInput } from '@/data/documents/rapports';
import { createRapport, updateRapport } from '@/services/documents/rapports';

function clientSubtitle(c: Client | null): string | undefined {
  if (!c) return undefined;
  return c.company || c.phone || c.address || undefined;
}

function interventionSubtitle(i: PhotoIntervention | null): string | undefined {
  if (!i) return undefined;
  return `${i.clientName} · ${formatShortDate(i.date)}`;
}

export default function NewRapportScreen() {
  const router = useRouter();
  const { editId, interventionId } = useLocalSearchParams<{ editId?: string; interventionId?: string }>();
  const editingRapport = useMemo(() => (editId ? MOCK_RAPPORTS.find((r) => r.id === editId) : undefined), [editId]);

  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [intervention, setIntervention] = useState<PhotoIntervention | null>(null);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditing = !!editingRapport;

  useEffect(() => {
    if (editingRapport) {
      setClient(getClientById(editingRapport.clientId) ?? null);
      setNotes(editingRapport.notes ?? '');
      const linked = PHOTO_INTERVENTIONS.find((i) => i.id === editingRapport.interventionId);
      if (linked) setIntervention(linked);
      return;
    }
    if (interventionId) {
      const preselected = PHOTO_INTERVENTIONS.find((i) => i.id === interventionId);
      if (preselected) {
        setIntervention(preselected);
        setClient(getClientById(preselected.clientId) ?? null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, interventionId]);

  const handleSelectIntervention = (selected: PhotoIntervention) => {
    setIntervention(selected);
    setClient(getClientById(selected.clientId) ?? null);
    setInterventionPickerOpen(false);
  };

  const buildRapportInput = (): RapportInput => ({
    number: editingRapport?.number ?? `RA-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`,
    interventionId: intervention?.id ?? editingRapport?.interventionId ?? '',
    interventionLabel: intervention?.label ?? editingRapport?.interventionLabel ?? '',
    clientId: client!.id,
    clientName: client!.name,
    date: editingRapport?.date ?? new Date().toISOString(),
    status: editingRapport?.status ?? 'aCompleter',
    notes: notes.trim() || undefined,
    photosCount: editingRapport?.photosCount ?? 0,
    checklist: editingRapport?.checklist ?? [],
    materialUsed: editingRapport?.materialUsed ?? [],
    timeSpentMinutes: editingRapport?.timeSpentMinutes ?? 0,
    signed: editingRapport?.signed ?? false,
  });

  const handleCreate = async () => {
    if (submitting) return;
    if (!client) {
      Alert.alert('Client requis', 'Choisissez un client pour créer le rapport.');
      return;
    }
    const input = buildRapportInput();
    setSubmitting(true);
    try {
      if (isEditing && editingRapport) {
        await updateRapport(editingRapport.id, input);
        Alert.alert('Modifications enregistrées', `Le rapport ${editingRapport.number} a bien été mis à jour.`, [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }
      await createRapport(input);
      Alert.alert('Rapport créé', `Le rapport pour ${client.name} a bien été créé.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title={isEditing ? 'Modifier le rapport' : 'Nouveau rapport'} onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title="Intervention" icon="briefcase">
            <FormField
              label="Intervention liée"
              value={intervention?.label}
              placeholder="Choisir une intervention"
              onPress={() => setInterventionPickerOpen(true)}
              subtitle={interventionSubtitle(intervention)}
            />
          </FormSection>

          <FormSection title="Client" icon="user">
            <FormField
              label="Client"
              value={client?.name}
              placeholder="Choisir un client"
              onPress={() => setClientPickerOpen(true)}
              subtitle={clientSubtitle(client)}
            />
          </FormSection>

          <FormSection title="Notes" icon="file-text">
            <FormField
              label="Notes"
              value={notes}
              placeholder="Décrire l’intervention réalisée…"
              onChangeText={setNotes}
              multiline
            />
          </FormSection>
        </ScrollView>
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer le rapport'}
        onPress={handleCreate}
        loading={submitting}
      />

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
    paddingBottom: Spacing.section + FOOTER_SPACE,
  },
});
