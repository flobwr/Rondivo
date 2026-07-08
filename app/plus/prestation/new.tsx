import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { PickerField, type PickerOption } from '@/components/plus/resource/PickerField';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { useAsyncItem } from '@/hooks/use-async-item';
import {
  createPrestation,
  deletePrestation,
  getPrestation,
  PRESTATION_UNIT_LABEL,
  PRESTATION_UNIT_ORDER,
  type PrestationUnit,
  updatePrestation,
} from '@/services/plus/prestations';

const UNIT_OPTIONS: PickerOption[] = PRESTATION_UNIT_ORDER.map((unit) => ({
  key: unit,
  label: PRESTATION_UNIT_LABEL[unit],
  icon: 'tag',
}));

export default function NewPrestationScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = !!editId;

  const fetchEditing = useCallback(() => (editId ? getPrestation(editId) : Promise.resolve(undefined)), [editId]);
  const { data: editing, status: fetchStatus } = useAsyncItem(fetchEditing);

  const [name, setName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [unit, setUnit] = useState<PrestationUnit>('heure');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (editing && !initialized) {
      setName(editing.name);
      setUnitPrice(String(editing.unitPrice));
      setUnit(editing.unit);
      setInitialized(true);
    }
  }, [editing, initialized]);

  const [submitting, setSubmitting] = useState(false);
  const canSubmit = name.trim().length > 0 && unitPrice.trim().length > 0 && !submitting;
  const isLoadingEdit = isEditing && (fetchStatus === 'loading' || !initialized);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const input = { name: name.trim(), unitPrice: Number(unitPrice.replace(/[^0-9.,]/g, '').replace(',', '.')) || 0, unit };
    setSubmitting(true);
    try {
      if (isEditing && editing) {
        await updatePrestation(editing.id, input);
      } else {
        await createPrestation(input);
      }
      router.back();
    } catch {
      Alert.alert('Échec de l’enregistrement', 'Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Supprimer cette prestation', `Supprimer définitivement ${editing.name} ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deletePrestation(editing.id); router.back(); } },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier la prestation' : 'Nouvelle prestation'}</Text>
          <View style={styles.iconBtn} />
        </View>

        {isLoadingEdit ? null : (
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FormSection title="Prestation" icon="layers">
                <FormField label="Nom" value={name} onChangeText={setName} placeholder="Ex. Main d’œuvre chauffagiste" />
                <FormField label="Prix unitaire (€)" value={unitPrice} onChangeText={setUnitPrice} placeholder="0" keyboardType="decimal-pad" />
                <PickerField label="Unité" value={UNIT_OPTIONS.find((o) => o.key === unit)} options={UNIT_OPTIONS} onSelect={(k) => setUnit(k as PrestationUnit)} />
              </FormSection>

              {isEditing ? (
                <PressableScale onPress={handleDelete} to={0.97} style={styles.deleteButton} accessibilityLabel="Supprimer cette prestation">
                  <Text style={styles.deleteText}>Supprimer cette prestation</Text>
                </PressableScale>
              ) : null}

              <View style={{ height: 12 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer la prestation'}
        onPress={handleSubmit}
        disabled={!canSubmit}
        loading={submitting}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: 6,
    paddingBottom: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: FOOTER_SPACE,
  },
  deleteButton: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: Spacing.section,
  },
  deleteText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.danger,
    letterSpacing: -0.1,
  },
});
