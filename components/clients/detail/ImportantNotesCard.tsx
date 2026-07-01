import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { PressableScale } from './primitives';

type Props = {
  notes: string[];
  onChange?: (notes: string[]) => void;
};

const PLACEHOLDER =
  'Une note par ligne\nEx. : chien dans le jardin, portail électrique, ne pas sonner après 18h…';

export function ImportantNotesCard({ notes, onChange }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(notes.join('\n'));

  const startEditing = () => {
    setDraft(notes.join('\n'));
    setEditing(true);
  };

  const save = () => {
    const next = draft
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    onChange?.(next);
    setEditing(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconTile}>
            <Feather name="star" size={15} color={Palette.orange} />
          </View>
          <Text style={styles.title}>Notes importantes</Text>
        </View>

        {editing ? (
          <View style={styles.editActions}>
            <PressableScale onPress={() => setEditing(false)} to={0.94} style={styles.linkBtn} accessibilityLabel="Annuler">
              <Text style={styles.cancelText}>Annuler</Text>
            </PressableScale>
            <PressableScale onPress={save} to={0.94} style={styles.linkBtn} accessibilityLabel="Enregistrer">
              <Text style={styles.saveText}>Enregistrer</Text>
            </PressableScale>
          </View>
        ) : (
          <PressableScale onPress={startEditing} to={0.94} style={styles.editLink} accessibilityLabel="Modifier les notes">
            <Feather name="edit-2" size={13} color={Palette.blue} />
            <Text style={styles.editText}>Modifier</Text>
          </PressableScale>
        )}
      </View>

      {editing ? (
        <TextInput
          style={styles.input}
          value={draft}
          onChangeText={setDraft}
          multiline
          placeholder={PLACEHOLDER}
          placeholderTextColor={Palette.textTertiary}
          autoFocus
        />
      ) : notes.length > 0 ? (
        <View style={styles.list}>
          {notes.map((note, index) => (
            <View key={index} style={styles.noteRow}>
              <View style={styles.bullet} />
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          Aucune note pour le moment. Ajoutez les infos à connaître avant d’intervenir.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.orangeSoft,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconTile: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  editLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  linkBtn: {
    paddingVertical: 2,
  },
  cancelText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textTertiary,
  },
  saveText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
  },
  list: {
    marginTop: 14,
    gap: 9,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Palette.orange,
  },
  noteText: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  emptyText: {
    marginTop: 12,
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
  },
  input: {
    marginTop: 14,
    minHeight: 96,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    padding: 14,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
});
