import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection, FormSubmitButton } from '@/components/documents/shared/FormScaffold';
import { Palette, Spacing } from '@/constants/design';

export default function NewRapportScreen() {
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [clientPickerOpen, setClientPickerOpen] = useState(false);
  const [notes, setNotes] = useState('');

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
            <FormField label="Intervention liée" placeholder="Choisir une intervention" onPress={() => {}} />
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
