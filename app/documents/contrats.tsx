import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { KpiRow } from '@/components/documents/KpiRow';
import { ListToolbar } from '@/components/documents/ListToolbar';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { BadgeTone, StatusBadge } from '@/components/documents/StatusBadge';
import { CONTRACTS, Contract, ContractStatus, contractStats } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const STATUS_TONE: Record<ContractStatus, BadgeTone> = {
  Brouillon: 'neutral',
  'En attente de signature': 'amber',
  Signé: 'green',
  Expiré: 'neutral',
};

type ChipKey = 'all' | ContractStatus;

const CHIP_ORDER: ChipKey[] = ['all', 'Signé', 'En attente de signature', 'Brouillon', 'Expiré'];
const CHIP_LABEL: Record<ChipKey, string> = {
  all: 'Tous',
  Brouillon: 'Brouillon',
  'En attente de signature': 'En attente',
  Signé: 'Signé',
  Expiré: 'Expiré',
};

function ContractRow({ contract, highlighted }: { contract: Contract; highlighted?: boolean }) {
  return (
    <View style={[styles.card, highlighted ? styles.cardHighlighted : null]}>
      <View style={styles.rowTop}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {contract.title}
        </Text>
        <StatusBadge label={contract.status} tone={STATUS_TONE[contract.status]} />
      </View>
      <Text style={styles.meta} numberOfLines={1}>
        {contract.client} · Depuis le {contract.since}
      </Text>
      {contract.expiringInDays ? (
        <View style={styles.expiryTag}>
          <Text style={styles.expiryText}>Expire dans {contract.expiringInDays} jours</Text>
        </View>
      ) : null}
    </View>
  );
}

export default function ContratsScreen() {
  const params = useLocalSearchParams<{ highlight?: string }>();
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState<ChipKey>('all');
  const [sortRecent, setSortRecent] = useState(true);

  const filtered = useMemo(() => {
    let list = CONTRACTS;
    if (chip !== 'all') list = list.filter((c) => c.status === chip);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) => c.client.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
      );
    }
    return sortRecent ? list : [...list].reverse();
  }, [chip, search, sortRecent]);

  const chips = CHIP_ORDER.map((key) => ({
    key,
    label: CHIP_LABEL[key],
    count: key === 'all' ? CONTRACTS.length : CONTRACTS.filter((c) => c.status === key).length,
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScreenHeader title="Contrats" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <KpiRow
            items={[
              { label: 'Actifs', value: `${contractStats.active}`, color: '#128A5E' },
              { label: 'À renouveler', value: `${contractStats.toRenew}`, color: '#B7791F' },
              { label: 'Expirés', value: `${contractStats.expired}`, color: Palette.textSecondary },
            ]}
          />

          <View style={styles.toolbarGap}>
            <ListToolbar
              searchPlaceholder="Rechercher un contrat, un client…"
              searchValue={search}
              onSearchChange={setSearch}
              chips={chips}
              selectedChip={chip}
              onSelectChip={(key) => setChip(key as ChipKey)}
              resultLabel={`${filtered.length} contrat${filtered.length > 1 ? 's' : ''}`}
              sortLabel={sortRecent ? 'Plus récents' : 'Plus anciens'}
              onToggleSort={() => setSortRecent((v) => !v)}
            />
          </View>

          <View style={styles.list}>
            {filtered.length > 0 ? (
              filtered.map((contract) => (
                <ContractRow
                  key={contract.id}
                  contract={contract}
                  highlighted={params.highlight === contract.id}
                />
              ))
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Aucun contrat ne correspond à ces critères.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />
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
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  toolbarGap: {
    marginTop: Spacing.section,
  },
  list: {
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...cardShadow,
  },
  cardHighlighted: {
    borderWidth: 1.5,
    borderColor: Palette.blue,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 8,
  },
  expiryTag: {
    alignSelf: 'flex-start',
    backgroundColor: Palette.orangeSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 10,
  },
  expiryText: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: '#9A6B14',
  },
  empty: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 28,
    alignItems: 'center',
    ...cardShadow,
  },
  emptyText: {
    fontSize: FontSize.label,
    color: Palette.textTertiary,
  },
});
