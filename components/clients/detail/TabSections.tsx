import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { type Tint } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import {
  DOCUMENT_CATEGORIES,
  formatEuroShort,
  type ClientDocument,
  type ClientFinances,
  type DocumentCategory,
  type FinanceItem,
  type InterventionItem,
} from '@/data/client-details';
import { ListRow } from './ListRow';
import { PressableScale, SectionCard, TintIcon } from './primitives';
import { FilterChips, SearchField } from './TabControls';

function Separator() {
  return <View style={styles.separator} />;
}

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

function EmptyState({ label }: { label: string }) {
  return <Text style={styles.empty}>{label}</Text>;
}

// ── Interventions tab ─────────────────────────────────────────────────────
type InterventionFilter = 'all' | 'Planifiée' | 'Terminée';

export function InterventionsSection({
  interventions,
  onOpen,
  onNew,
}: {
  interventions: InterventionItem[];
  onOpen: (item: InterventionItem) => void;
  onNew: () => void;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<InterventionFilter>('all');

  const results = useMemo(() => {
    const q = normalize(search);
    return interventions.filter(
      (item) =>
        (filter === 'all' || item.status === filter) &&
        (!q || normalize(item.title).includes(q))
    );
  }, [interventions, search, filter]);

  return (
    <View style={styles.stack}>
      <SearchField value={search} onChangeText={setSearch} placeholder="Rechercher une intervention" />
      <FilterChips<InterventionFilter>
        value={filter}
        onChange={setFilter}
        options={[
          { key: 'all', label: 'Toutes' },
          { key: 'Planifiée', label: 'Planifiées' },
          { key: 'Terminée', label: 'Terminées' },
        ]}
      />

      <SectionCard footerLabel="Nouvelle intervention" onFooterPress={onNew}>
        {results.length === 0 ? (
          <EmptyState label="Aucune intervention." />
        ) : (
          results.map((item, index) => (
            <View key={item.id}>
              {index > 0 ? <Separator /> : null}
              <ListRow
                icon="tool"
                iconTint={item.statusTint}
                title={item.title}
                subtitle={`${item.dateLabel} à ${item.time}`}
                amount={item.amount}
                status={item.status}
                statusTint={item.statusTint}
                onPress={() => onOpen(item)}
              />
            </View>
          ))
        )}
      </SectionCard>
    </View>
  );
}

// ── Documents tab ─────────────────────────────────────────────────────────
export function DocumentsSection({
  documents,
  onOpen,
  onAdd,
}: {
  documents: ClientDocument[];
  onOpen: (document: ClientDocument) => void;
  onAdd: () => void;
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DocumentCategory | 'all'>('all');

  const results = useMemo(() => {
    const q = normalize(search);
    return documents.filter(
      (doc) =>
        (category === 'all' || doc.category === category) &&
        (!q || normalize(doc.name).includes(q))
    );
  }, [documents, search, category]);

  return (
    <View style={styles.stack}>
      <SearchField value={search} onChangeText={setSearch} placeholder="Rechercher un document" />
      <FilterChips<DocumentCategory | 'all'>
        value={category}
        onChange={setCategory}
        options={[{ key: 'all', label: 'Tous' }, ...DOCUMENT_CATEGORIES.map((c) => ({ key: c, label: c }))]}
      />

      <SectionCard footerLabel="Ajouter un document" onFooterPress={onAdd}>
        {results.length === 0 ? (
          <EmptyState label="Aucun document." />
        ) : (
          results.map((doc, index) => (
            <View key={doc.id}>
              {index > 0 ? <Separator /> : null}
              <PressableScale onPress={() => onOpen(doc)} to={0.98} style={styles.docRow} accessibilityLabel={doc.name}>
                <TintIcon icon={doc.icon} tint={doc.tint} size={38} iconSize={16} />
                <View style={styles.docInfo}>
                  <Text style={styles.docName} numberOfLines={1}>
                    {doc.name}
                  </Text>
                  <Text style={styles.docMeta}>
                    {doc.category} • {doc.size}
                  </Text>
                </View>
                <Feather name="download" size={17} color={Palette.textTertiary} />
              </PressableScale>
            </View>
          ))
        )}
      </SectionCard>
    </View>
  );
}

// ── Finances tab ──────────────────────────────────────────────────────────
function FinanceGroup({
  title,
  icon,
  tint,
  items,
  emptyLabel,
  onOpen,
  footerLabel,
  onFooter,
}: {
  title: string;
  icon: 'file-text' | 'file' | 'dollar-sign';
  tint: Tint;
  items: FinanceItem[];
  emptyLabel: string;
  onOpen: (item: FinanceItem) => void;
  footerLabel: string;
  onFooter: () => void;
}) {
  return (
    <SectionCard icon={icon} iconTint={tint} title={title} footerLabel={footerLabel} onFooterPress={onFooter}>
      {items.length === 0 ? (
        <EmptyState label={emptyLabel} />
      ) : (
        items.map((item, index) => (
          <View key={item.id}>
            {index > 0 ? <Separator /> : null}
            <ListRow
              icon={icon}
              iconTint={tint}
              title={item.label}
              subtitle={`${item.reference} • ${item.date}`}
              amount={item.amount}
              status={item.status}
              statusTint={item.statusTint}
              onPress={() => onOpen(item)}
            />
          </View>
        ))
      )}
    </SectionCard>
  );
}

export function FinancesSection({
  finances,
  revenue,
  paid,
  unpaid,
  onOpenItem,
  onNewQuote,
  onNewInvoice,
}: {
  finances: ClientFinances;
  revenue: number;
  paid: number;
  unpaid: number;
  onOpenItem: (item: FinanceItem) => void;
  onNewQuote: () => void;
  onNewInvoice: () => void;
}) {
  return (
    <View style={styles.stack}>
      <View style={styles.revenueCard}>
        <Text style={styles.revenueLabel}>Chiffre d&apos;affaires</Text>
        <Text style={styles.revenueValue}>{formatEuroShort(revenue)}</Text>
        <View style={styles.revenueSplit}>
          <View style={styles.revenueChip}>
            <View style={[styles.dot, { backgroundColor: Palette.green }]} />
            <Text style={styles.revenueChipText}>Payé {formatEuroShort(paid)}</Text>
          </View>
          <View style={styles.revenueChip}>
            <View style={[styles.dot, { backgroundColor: unpaid > 0 ? Palette.red : Palette.textTertiary }]} />
            <Text style={styles.revenueChipText}>Impayé {formatEuroShort(unpaid)}</Text>
          </View>
        </View>
      </View>

      <FinanceGroup
        title="Devis"
        icon="file-text"
        tint="orange"
        items={finances.quotes}
        emptyLabel="Aucun devis en cours."
        onOpen={onOpenItem}
        footerLabel="Nouveau devis"
        onFooter={onNewQuote}
      />
      <FinanceGroup
        title="Factures"
        icon="file"
        tint="blue"
        items={finances.invoices}
        emptyLabel="Aucune facture."
        onOpen={onOpenItem}
        footerLabel="Nouvelle facture"
        onFooter={onNewInvoice}
      />
      <FinanceGroup
        title="Paiements"
        icon="dollar-sign"
        tint="green"
        items={finances.payments}
        emptyLabel="Aucun paiement enregistré."
        onOpen={onOpenItem}
        footerLabel="Voir l'historique"
        onFooter={() => finances.payments[0] && onOpenItem(finances.payments[0])}
      />
    </View>
  );
}

// ── Notes tab ─────────────────────────────────────────────────────────────
export function NotesSection({
  notes,
  onChangeNotes,
}: {
  notes: string[];
  onChangeNotes: (notes: string[]) => void;
}) {
  const [draft, setDraft] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const add = () => {
    const value = draft.trim();
    if (!value) return;
    onChangeNotes([...notes, value]);
    setDraft('');
  };

  const remove = (index: number) => {
    onChangeNotes(notes.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditingValue(notes[index]);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const value = editingValue.trim();
    onChangeNotes(notes.map((note, i) => (i === editingIndex ? value || note : note)));
    setEditingIndex(null);
  };

  return (
    <SectionCard icon="star" iconTint="orange" title="Notes importantes">
      <View style={styles.addBox}>
        <TextInput
          style={styles.addInput}
          value={draft}
          onChangeText={setDraft}
          placeholder="Ajouter une note…"
          placeholderTextColor={Palette.textTertiary}
          onSubmitEditing={add}
          returnKeyType="done"
        />
        <PressableScale onPress={add} to={0.92} style={styles.addBtn} accessibilityLabel="Ajouter la note">
          <Feather name="plus" size={18} color={Palette.white} />
        </PressableScale>
      </View>

      {notes.length === 0 ? (
        <Text style={styles.notesEmpty}>Aucune note. Ajoutez les infos à connaître avant d’intervenir.</Text>
      ) : (
        notes.map((note, index) => (
          <View key={index}>
            {index > 0 ? <Separator /> : null}
            {editingIndex === index ? (
              <View style={styles.editRow}>
                <TextInput
                  style={styles.editInput}
                  value={editingValue}
                  onChangeText={setEditingValue}
                  autoFocus
                  onSubmitEditing={saveEdit}
                  returnKeyType="done"
                />
                <PressableScale onPress={saveEdit} to={0.9} accessibilityLabel="Enregistrer">
                  <Feather name="check" size={20} color={Palette.green} />
                </PressableScale>
              </View>
            ) : (
              <View style={styles.noteRow}>
                <View style={styles.bullet} />
                <Text style={styles.noteText}>{note}</Text>
                <PressableScale onPress={() => startEdit(index)} to={0.9} haptic={false} style={styles.noteAction} accessibilityLabel="Modifier">
                  <Feather name="edit-2" size={15} color={Palette.textTertiary} />
                </PressableScale>
                <PressableScale onPress={() => remove(index)} to={0.9} haptic={false} style={styles.noteAction} accessibilityLabel="Supprimer">
                  <Feather name="trash-2" size={15} color={Palette.red} />
                </PressableScale>
              </View>
            )}
          </View>
        ))
      )}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 14,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
  empty: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    paddingVertical: 4,
  },
  // documents
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  docMeta: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  // finances
  revenueCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  revenueLabel: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: 0.1,
  },
  revenueValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.6,
    marginTop: 4,
  },
  revenueSplit: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 12,
  },
  revenueChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  revenueChipText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  // notes
  addBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  addInput: {
    flex: 1,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.tile,
    backgroundColor: Palette.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notesEmpty: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    marginTop: 12,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
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
  noteAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  editInput: {
    flex: 1,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
});
