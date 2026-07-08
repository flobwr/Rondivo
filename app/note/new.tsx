import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FormField, FormSection } from '@/components/documents/shared/FormScaffold';
import { PressableScale } from '@/components/documents/shared/primitives';
import { FOOTER_SPACE, StickyFormFooter } from '@/components/documents/shared/StickyFormFooter';
import { FontSize, Palette, Spacing } from '@/constants/design';
import { useAsyncItem } from '@/hooks/use-async-item';
import { createNote, deleteNote, getNote, updateNote } from '@/services/notes';

export default function NewNoteScreen() {
  const router = useRouter();
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const isEditing = !!editId;

  const fetchEditing = useCallback(() => (editId ? getNote(editId) : Promise.resolve(undefined)), [editId]);
  const { data: editing, status: fetchStatus } = useAsyncItem(fetchEditing);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing && !initialized) {
      setTitle(editing.title);
      setContent(editing.content);
      setInitialized(true);
    }
  }, [editing, initialized]);

  const canSubmit = title.trim().length > 0 && !saving;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    const input = { title: title.trim(), content: content.trim() };
    if (isEditing && editing) {
      await updateNote(editing.id, input);
    } else {
      await createNote(input);
    }
    router.back();
  };

  const handleDelete = () => {
    if (!editing) return;
    Alert.alert('Supprimer cette note', `Supprimer définitivement "${editing.title}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: async () => { await deleteNote(editing.id); router.back(); } },
    ]);
  };

  const isLoadingEdit = isEditing && (fetchStatus === 'loading' || !initialized);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.iconBtn} accessibilityLabel="Fermer">
            <Feather name="x" size={22} color={Palette.textPrimary} />
          </PressableScale>
          <Text style={styles.headerTitle}>{isEditing ? 'Modifier la note' : 'Nouvelle note'}</Text>
          <View style={styles.iconBtn} />
        </View>

        {isLoadingEdit ? null : (
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <FormSection title="Note" icon="file-text">
                <FormField label="Titre" value={title} onChangeText={setTitle} placeholder="Ex. Accès chantier" />
                <FormField label="Contenu" value={content} onChangeText={setContent} placeholder="Détails, code d’accès, rappel…" multiline />
              </FormSection>

              {isEditing ? (
                <PressableScale onPress={handleDelete} to={0.97} style={styles.deleteButton} accessibilityLabel="Supprimer cette note">
                  <Text style={styles.deleteText}>Supprimer cette note</Text>
                </PressableScale>
              ) : null}

              <View style={{ height: 12 }} />
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </SafeAreaView>

      <StickyFormFooter
        label={isEditing ? 'Enregistrer les modifications' : 'Créer la note'}
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
