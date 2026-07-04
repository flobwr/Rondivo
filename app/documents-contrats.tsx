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
import { CONTRACTS, CONTRACT_SUMMARY } from '@/components/documents/mock-data';
import type { Contract } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const FILTERS: FilterChip[] = [
  { label: 'Tous', count: CONTRACTS.length },
  {
    label: 'En attente de signature',
    count: CONTRACTS.filter((c) => c.status === 'pendingSignature').length,
    dotColor: Palette.orange,
  },
  {
    label: 'Brouillon',
    count: CONTRACTS.filter((c) => c.status === 'draft').length,
    dotColor: Palette.textTertiary,
  },
];

function getInsight(contract: Contract): string | null {
  if (contract.daysUntilExpiry !== undefined && contract.daysUntilExpiry < 0) {
    return `Expiré depuis ${Math.abs(contract.daysUntilExpiry)} jours`;
  }
  if (contract.daysUntilExpiry !== undefined && contract.daysUntilExpiry > 0 && contract.daysUntilExpiry <= 30) {
    return `Arrive à échéance dans ${contract.daysUntilExpiry} jours`;
  }
  return null;
}

function getActionsForStatus(status: string) {
  switch (status) {
    case 'draft':
      return [
        { label: 'Modifier', icon: 'edit-2' as const },
        { label: 'Envoyer', icon: 'send' as const },
      ];
    case 'pendingSignature':
      return [
        { label: 'Signer', icon: 'edit-3' as const },
        { label: 'Relancer', icon: 'rotate-cw' as const },
      ];
    case 'signed':
      return [
        { label: 'Partager', icon: 'share-2' as const },
        { label: 'Télécharger', icon: 'download' as const },
      ];
    default:
      return [{ label: 'Renouveler', icon: 'refresh-cw' as const }];
  }
}

function ContractCard({ contract }: { contract: Contract }) {
  const [showActions, setShowActions] = useState(false);
  const insight = getInsight(contract);
  const actions = getActionsForStatus(contract.status);

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
          <Text style={styles.title} numberOfLines={1}>
            {contract.title}
          </Text>
          <Text style={styles.meta}>
            {contract.client} · Depuis le {contract.startDate}
          </Text>
        </View>
        <StatusBadge type="contract" status={contract.status} />
      </View>

      {insight ? <RondivoInsight message={insight} /> : null}

      {showActions && actions.length > 0 ? (
        <QuickActions actions={actions} />
      ) : null}
    </Pressable>
  );
}

export default function ContratsScreen() {
  const [filterIndex, setFilterIndex] = useState(0);

  const filterStatus = ['all', 'pendingSignature', 'draft'][filterIndex];
  const filtered =
    filterStatus === 'all'
      ? CONTRACTS
      : CONTRACTS.filter((c) => c.status === filterStatus);

  const handleFilterChange = useCallback((index: number) => {
    setFilterIndex(index);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentHeader title="Contrats" />

        <View style={styles.summaryCard}>
          <SummaryRow
            items={[
              { label: 'actifs', value: String(CONTRACT_SUMMARY.activeCount) },
              {
                label: 'expirent bientôt',
                value: String(CONTRACT_SUMMARY.expiringSoonCount),
                highlight: true,
              },
              { label: 'brouillons', value: String(CONTRACT_SUMMARY.draftCount) },
            ]}
          />
        </View>

        <FilterChips
          chips={FILTERS}
          selectedIndex={filterIndex}
          onSelect={handleFilterChange}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>{filtered.length} contrats</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {filtered.map((contract) => (
            <ContractCard key={contract.id} contract={contract} />
          ))}
        </ScrollView>
      </SafeAreaView>

      <ContextualFAB label="Nouveau contrat" icon="plus" />
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
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  listCount: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
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
  title: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  meta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
});
