import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { InterventionPickerSheet } from '@/components/documents/imports/InterventionPickerSheet';
import { Palette, Spacing } from '@/constants/design';
import { getClientById } from '@/data/clients';
import { PHOTO_INTERVENTIONS, PhotoIntervention } from '@/data/documents/photos';

export default function NewRapportScreen() {
  const router = useRouter();
  const { interventionId } = useLocalSearchParams<{ interventionId?: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [intervention, setIntervention] = useState<PhotoIntervention | null>(null);
  const [interventionPickerOpen, setInterventionPickerOpen] = useState(false);
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
      Alert.alert('Client requis', 'Choisissez un client pour créer le rapport.');
      return;
    }
    Alert.alert('Rapport créé', `Le rapport pour ${client.name} a bien été créé.`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Nouveau rapport" onBack={() => router.back()} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <FormSection title="Intervention">
            <FormField
              label="Intervention liée"
              value={intervention?.label}
              placeholder="Choisir une intervention"
              onPress={() => setInterventionPickerOpen(true)}
            />
            <FormField
              label="Client"
              value={client?.name}
              placeholder="Choisir un client"
              onPress={() => setClientPickerOpen(true)}
            />
          </FormSection>

          <FormSection title="Détails">
            <FormField
              label="Notes"
              value={notes}
              placeholder="Décrire l’intervention réalisée…"
              onChangeText={setNotes}
              multiline
            />
          </FormSection>

          <FormSubmitButton label="Créer le rapport" onPress={handleCreate} />
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
});
