import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContextualFAB } from '@/components/documents/ContextualFAB';
import { DocumentHeader } from '@/components/documents/DocumentHeader';
import { FilterChips, type FilterChip } from '@/components/documents/FilterChips';
import { QuickActions } from '@/components/documents/QuickActions';
import { RondivoInsight } from '@/components/documents/RondivoInsight';
import { StatusBadge } from '@/components/documents/StatusBadge';
import { SummaryRow } from '@/components/documents/SummaryRow';
import { INVOICES, INVOICE_SUMMARY } from '@/components/documents/mock-data';
import type { Invoice } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const FILTERS: FilterChip[] = [
  { label: 'Toutes', count: INVOICES.length },
  { label: 'En retard', count: INVOICES.filter((i) => i.status === 'overdue').length, dotColor: Palette.red },
  { label: 'Envoyée', count: INVOICES.filter((i) => i.status === 'sent').length, dotColor: Palette.blue },
  { label: 'Brouillon', count: INVOICES.filter((i) => i.status === 'draft').length, dotColor: Palette.textTertiary },
];

function getInsight(invoice: Invoice): string | null {
  if (invoice.status === 'overdue' && invoice.daysOverdue) {
    return `Échue depuis ${invoice.daysOverdue} jour${invoice.daysOverdue > 1 ? 's' : ''}`;
  }
  return null;
}

function InvoiceCard({ invoice }: { invoice: Invoice }) {
  const [showActions, setShowActions] = useState(false);
  const insight = getInsight(invoice);

  return (
    <Pressable
      style={styles.invoiceCard}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowActions(!showActions);
      }}>
      <View style={styles.invoiceTop}>
        <View style={styles.invoiceLeft}>
          <Text style={styles.invoiceClient}>{invoice.client}</Text>
          <Text style={styles.invoiceMeta}>
            {invoice.reference} · Échéance {invoice.dueDate}
          </Text>
        </View>
        <View style={styles.invoiceRight}>
          <Text style={styles.invoiceAmount}>
            {invoice.amount.toLocaleString('fr-FR')} €
          </Text>
          <StatusBadge type="invoice" status={invoice.status} />
        </View>
      </View>

      {insight ? <RondivoInsight message={insight} /> : null}

      {showActions ? (
        <QuickActions
          actions={[
            { label: 'Payée', icon: 'check' },
            { label: 'Envoyer', icon: 'send' },
            { label: 'Partager', icon: 'share-2' },
            { label: 'Appeler', icon: 'phone' },
          ]}
        />
      ) : null}
    </Pressable>
  );
}

export default function FacturesScreen() {
  const [filterIndex, setFilterIndex] = useState(0);

  const filterStatus = ['all', 'overdue', 'sent', 'draft'][filterIndex];
  const filtered =
    filterStatus === 'all'
      ? INVOICES
      : INVOICES.filter((i) => i.status === filterStatus);

  const handleFilterChange = useCallback((index: number) => {
    setFilterIndex(index);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentHeader title="Factures" />

        <View style={styles.summaryCard}>
          <SummaryRow
            items={[
              {
                label: 'à encaisser',
                value: `${INVOICE_SUMMARY.totalToCollect.toLocaleString('fr-FR')} €`,
              },
              {
                label: 'impayées',
                value: String(INVOICE_SUMMARY.unpaidCount),
                highlight: true,
              },
              {
                label: 'en retard',
                value: `${INVOICE_SUMMARY.overdueAmount.toLocaleString('fr-FR')} €`,
                highlight: true,
              },
            ]}
          />
        </View>

        <FilterChips
          chips={FILTERS}
          selectedIndex={filterIndex}
          onSelect={handleFilterChange}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>{filtered.length} factures</Text>
          <Pressable style={styles.sortButton} hitSlop={8}>
            <Feather name="sliders" size={16} color={Palette.textSecondary} />
            <Text style={styles.sortText}>Plus récentes</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {filtered.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </ScrollView>
      </SafeAreaView>

      <ContextualFAB label="Nouvelle facture" icon="plus" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: Spacing.screen,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    marginBottom: Spacing.lg,
    ...cardShadow,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  listCount: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: FontSize.small,
    color: Palette.textSecondary,
  },
  scroll: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  invoiceCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  invoiceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  invoiceLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  invoiceRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  invoiceClient: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  invoiceMeta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  invoiceAmount: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
});
