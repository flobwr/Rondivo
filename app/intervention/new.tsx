import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, ChipScroll, Field } from '@/components/appointment/AppointmentUI';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { PRIORITY_CONFIG } from '@/components/intervention/priority';
import { Priority } from '@/components/intervention/types';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { getIntervention, updateIntervention } from '@/services/interventions';

const PRIORITY_ORDER: Priority[] = ['basse', 'normale', 'haute'];

// Interventions aren't created from this screen today (no "Nouvelle
// intervention" entry point exists yet) — only edited, via ?editId=,
// matching the create/edit convention used by every other document type
// (devis, facture, contrat, rapport) except there is no create branch here.
export default function EditInterventionScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();

  const fetchIntervention = useCallback(() => getIntervention(editId), [editId]);
  const { data: intervention, status } = useAsyncItem(fetchIntervention);

  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('normale');
  const [notes, setNotes] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (intervention && !initialized) {
      setAddress(intervention.address);
      setDescription(intervention.description);
      setPriority(intervention.priority);
      setNotes(intervention.notes.join('\n'));
      setInitialized(true);
    }
  }, [intervention, initialized]);

  const handleSave = async () => {
    if (!intervention || submitting) return;
    setSubmitting(true);
    try {
      await updateIntervention(intervention.id, {
        address: address.trim(),
        description: description.trim(),
        priority,
        notes: notes
          .split('\n')
          .map((n) => n.trim())
          .filter(Boolean),
      });
      router.back();
    } catch {
      Alert.alert('Échec de l’enregistrement', 'Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLoading = status === 'loading' || !initialized;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Modifier l’intervention" onBack={() => router.back()} />

        {isLoading ? null : (
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <FormSection title="Intervention" icon="briefcase">
                <FormField label="Adresse" value={address} onChangeText={setAddress} placeholder="Adresse de l’intervention" />
                <FormField
                  label="Description"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Décrire l’intervention…"
                  multiline
                />
                <FormField
                  label="Notes (une par ligne)"
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Accès, consignes particulières…"
                  multiline
                />
              </FormSection>

              <Field label="Priorité">
                <ChipScroll>
                  {PRIORITY_ORDER.map((p) => (
                    <Chip
                      key={p}
                      label={PRIORITY_CONFIG[p].shortLabel}
                      active={priority === p}
                      onPress={() => setPriority(p)}
                      accent={PRIORITY_CONFIG[p].color}
                    />
                  ))}
                </ChipScroll>
              </Field>
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>

      <StickyFormFooter label="Enregistrer les modifications" onPress={handleSave} loading={submitting} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.section + FOOTER_SPACE,
  },
}));
