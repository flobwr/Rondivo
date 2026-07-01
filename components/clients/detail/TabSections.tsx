import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { type Tint } from '@/components/clients/types';
import { FontSize, Palette, Radius } from '@/constants/design';
import {
  type ClientFinances,
  type FinanceItem,
  type InterventionItem,
} from '@/data/client-details';
import { ImportantNotesCard } from './ImportantNotesCard';
import { ListRow } from './ListRow';
import { PressableScale, SectionCard } from './primitives';

function Separator() {
  return <View style={styles.separator} />;
}

// ── Interventions tab ─────────────────────────────────────────────────────
export function InterventionsSection({
  interventions,
  onOpen,
  onNew,
}: {
  interventions: InterventionItem[];
  onOpen: (item: InterventionItem) => void;
  onNew: () => void;
}) {
  return (
    <SectionCard
      icon="tool"
      iconTint="blue"
      title="Interventions"
      footerLabel="Nouvelle intervention"
      onFooterPress={onNew}>
      {interventions.length === 0 ? (
        <Text style={styles.empty}>Aucune intervention pour ce client.</Text>
      ) : (
        interventions.map((item, index) => (
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
        <Text style={styles.empty}>{emptyLabel}</Text>
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
  onOpenItem,
  onNewQuote,
  onNewInvoice,
}: {
  finances: ClientFinances;
  onOpenItem: (item: FinanceItem) => void;
  onNewQuote: () => void;
  onNewInvoice: () => void;
}) {
  return (
    <View style={styles.stack}>
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
        footerLabel="Voir tous les paiements"
        onFooter={() => onOpenItem(finances.payments[0])}
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
  const [internal, setInternal] = useState('');

  return (
    <View style={styles.stack}>
      <ImportantNotesCard notes={notes} onChange={onChangeNotes} />

      <SectionCard icon="edit-3" iconTint="purple" title="Notes internes">
        <TextInput
          style={styles.input}
          value={internal}
          onChangeText={setInternal}
          multiline
          placeholder="Notes libres à propos de ce client (non visibles par le client)…"
          placeholderTextColor={Palette.textTertiary}
        />
        <PressableScale onPress={() => {}} to={0.97} style={styles.saveBtn} accessibilityLabel="Enregistrer la note">
          <Text style={styles.saveText}>Enregistrer</Text>
        </PressableScale>
      </SectionCard>
    </View>
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
  },
  input: {
    minHeight: 96,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    padding: 14,
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  saveBtn: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.tile,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  saveText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
  },
});
