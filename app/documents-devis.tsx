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
import { QUOTES, QUOTE_SUMMARY } from '@/components/documents/mock-data';
import type { Quote } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const FILTERS: FilterChip[] = [
  { label: 'Tous', count: QUOTES.length },
  { label: 'Envoyé', count: QUOTES.filter((q) => q.status === 'sent').length, dotColor: Palette.blue },
  { label: 'Vu', count: QUOTES.filter((q) => q.status === 'viewed').length, dotColor: Palette.purple },
  { label: 'Expiré', count: QUOTES.filter((q) => q.status === 'expired').length, dotColor: Palette.orange },
];

function getInsight(quote: Quote): string | null {
  if (quote.daysUntilExpiry === 1) return 'Ce devis expire demain';
  if (quote.daysUntilExpiry !== undefined && quote.daysUntilExpiry < 0) {
    return `Expiré depuis ${Math.abs(quote.daysUntilExpiry)} jours`;
  }
  return null;
}

function QuoteCard({ quote }: { quote: Quote }) {
  const [showActions, setShowActions] = useState(false);
  const insight = getInsight(quote);

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setShowActions(!showActions);
      }}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.client}>{quote.client}</Text>
          <Text style={styles.meta}>
            {quote.reference} · Valable jusqu&apos;au {quote.validUntil}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <Text style={styles.amount}>
            {quote.amount.toLocaleString('fr-FR')} €
          </Text>
          <StatusBadge type="quote" status={quote.status} />
        </View>
      </View>

      {insight ? <RondivoInsight message={insight} /> : null}

      {showActions ? (
        <QuickActions
          actions={[
            { label: 'Envoyer', icon: 'send' },
            { label: 'Relancer', icon: 'rotate-cw' },
            { label: 'Modifier', icon: 'edit-2' },
          ]}
        />
      ) : null}
    </Pressable>
  );
}

export default function DevisScreen() {
  const [filterIndex, setFilterIndex] = useState(0);

  const filterStatus = ['all', 'sent', 'viewed', 'expired'][filterIndex];
  const filtered =
    filterStatus === 'all'
      ? QUOTES
      : QUOTES.filter((q) => q.status === filterStatus);

  const handleFilterChange = useCallback((index: number) => {
    setFilterIndex(index);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentHeader title="Devis" />

        <View style={styles.summaryCard}>
          <SummaryRow
            items={[
              {
                label: 'potentiels',
                value: `${QUOTE_SUMMARY.potentialAmount.toLocaleString('fr-FR')} €`,
              },
              {
                label: 'en attente',
                value: String(QUOTE_SUMMARY.pendingCount),
                highlight: true,
              },
              {
                label: 'taux acceptation',
                value: `${QUOTE_SUMMARY.acceptanceRate}%`,
              },
              {
                label: 'valeur moy.',
                value: `${QUOTE_SUMMARY.averageValue.toLocaleString('fr-FR')} €`,
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
          <Text style={styles.listCount}>{filtered.length} devis</Text>
          <Pressable style={styles.sortButton} hitSlop={8}>
            <Feather name="sliders" size={16} color={Palette.textSecondary} />
            <Text style={styles.sortText}>Plus récentes</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {filtered.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </ScrollView>
      </SafeAreaView>

      <ContextualFAB label="Nouveau devis" icon="plus" />
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
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLeft: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  client: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  meta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  amount: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
});
