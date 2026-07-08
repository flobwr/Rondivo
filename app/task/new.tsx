import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip, ChipScroll, Field } from '@/components/appointment/AppointmentUI';
import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { PRIORITY_CONFIG } from '@/components/intervention/priority';
import { Priority } from '@/components/intervention/types';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { useAsyncItem } from '@/hooks/use-async-item';
import { createTask, deleteTask, getTask, updateTask } from '@/services/tasks';

const PRIORITY_ORDER: Priority[] = ['basse', 'normale', 'haute'];

type DueOption = 'none' | 'today' | 'tomorrow' | 'week';

const DUE_OPTIONS: { key: DueOption; label: string }[] = [
  { key: 'none', label: 'Aucune' },
  { key: 'today', label: "Aujourd'hui" },
  { key: 'tomorrow', label: 'Demain' },
  { key: 'week', label: 'Cette semaine' },
];

function dueOptionToDate(key: DueOption): string | undefined {
  const days: Record<DueOption, number | undefined> = { none: undefined, today: 0, tomorrow: 1, week: 5 };
  const offset = days[key];
  return offset === undefined ? undefined : new Date(Date.now() + offset * 86_400_000).toISOString();
}

function dueDateToOption(dueDate?: string): DueOption {
  if (!dueDate) return 'none';
  const days = Math.round((new Date(dueDate).getTime() - Date.now()) / 86_400_000);
  if (days <= 0) return 'today';
  if (days === 1) return 'tomorrow';
  return 'week';
}

export default function NewTaskScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = !!editId;

  const fetchEditing = useCallback(() => (editId ? getTask(editId) : Promise.resolve(undefined)), [editId]);
  const { data: editing, status: fetchStatus } = useAsyncItem(fetchEditing);

  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [due, setDue] = useState<DueOption>('none');
  const [priority, setPriority] = useState<Priority>('normale');
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing && !initialized) {
      setTitle(editing.title);
      setNotes(editing.notes ?? '');
      setDue(dueDateToOption(editing.dueDate));
      setPriority(editing.priority);
      setInitialized(true);
    }
  }, [editing, initialized]);

  const canSubmit = title.trim().length > 0 && !saving;
  const isLoadingEdit = isEditing && (fetchStatus === 'loading' || !initialized);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const input = { title: title.trim(), notes: notes.trim() || undefined, dueDate: dueOptionToDate(due), priority };
    if (isEditing && editing) {
      await updateTask(editing.id, input);
    } else {
      await createTask(input);
    }
    router.back();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Supprimer cette tâche', `Supprimer définitivement "${editing.title}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteTask(editing.id); router.back(); } },
    ]);
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}</Text>
          <View style={styles.iconBtn} />
        </View>

        {isLoadingEdit ? null : (
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FormSection title="Tâche" icon="check-square">
                <FormField label="Titre" value={title} onChangeText={setTitle} placeholder="Ex. Commander la pièce" />
                <FormField label="Notes (optionnel)" value={notes} onChangeText={setNotes} placeholder="Détails complémentaires…" multiline />
              </FormSection>

              <Field label="Échéance">
                <ChipScroll>
                  {DUE_OPTIONS.map((option) => (
                    <Chip key={option.key} label={option.label} active={due === option.key} onPress={() => setDue(option.key)} />
                  ))}
                </ChipScroll>
              </Field>

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

              {isEditing ? (
                <PressableScale onPress={handleDelete} to={0.97} style={styles.deleteButton} accessibilityLabel="Supprimer cette tâche">
                  <Text style={styles.deleteText}>Supprimer cette tâche</Text>
                </PressableScale>
              ) : null}

              <View style={{ height: 12 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer la tâche'}
        onPress={handleSubmit}
        disabled={!canSubmit}
        loading={saving}
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
