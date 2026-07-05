import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { KpiRow } from '@/components/documents/KpiRow';
import { ListToolbar } from '@/components/documents/ListToolbar';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { BadgeTone, StatusBadge } from '@/components/documents/StatusBadge';
import { QUOTES, Quote, QuoteStatus, quoteStats } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { formatEuro } from '@/constants/format';
import { cardShadow } from '@/constants/shadow';

const STATUS_TONE: Record<QuoteStatus, BadgeTone> = {
  Brouillon: 'neutral',
  Envoyé: 'blue',
  Vu: 'purple',
  Accepté: 'green',
  Refusé: 'red',
  Expiré: 'amber',
};

type ChipKey = 'all' | QuoteStatus;

const CHIP_ORDER: ChipKey[] = ['all', 'Envoyé', 'Vu', 'Accepté', 'Refusé', 'Expiré', 'Brouillon'];
const CHIP_LABEL: Record<ChipKey, string> = {
  all: 'Tous',
  Brouillon: 'Brouillon',
  Envoyé: 'Envoyé',
  Vu: 'Vu',
  Accepté: 'Accepté',
  Refusé: 'Refusé',
  Expiré: 'Expiré',
};

function QuoteRow({ quote, highlighted }: { quote: Quote; highlighted?: boolean }) {
  return (
    <View style={[styles.card, highlighted ? styles.cardHighlighted : null]}>
      <View style={styles.rowTop}>
        <Text style={styles.client} numberOfLines={1} ellipsizeMode="tail">
          {quote.client}
        </Text>
        <StatusBadge label={quote.status} tone={STATUS_TONE[quote.status]} />
      </View>
      <View style={styles.rowBottom}>
        <Text style={styles.meta} numberOfLines={1}>
          {quote.number} · Valable jusqu’au {quote.validUntil}
        </Text>
        <Text style={styles.amount}>{formatEuro(quote.amount)}</Text>
      </View>
      {quote.expiresToday ? <Text style={styles.expiresToday}>Expire aujourd’hui</Text> : null}
    </View>
  );
}

export default function DevisScreen() {
  const params = useLocalSearchParams<{ highlight?: string }>();
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState<ChipKey>('all');
  const [sortByAmount, setSortByAmount] = useState(false);

  const filtered = useMemo(() => {
    let list = QUOTES;
    if (chip !== 'all') list = list.filter((q) => q.status === chip);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (item) => item.client.toLowerCase().includes(q) || item.number.toLowerCase().includes(q)
      );
    }
    return sortByAmount ? [...list].sort((a, b) => b.amount - a.amount) : list;
  }, [chip, search, sortByAmount]);

  const chips = CHIP_ORDER.map((key) => ({
    key,
    label: CHIP_LABEL[key],
    count: key === 'all' ? QUOTES.length : QUOTES.filter((q) => q.status === key).length,
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScreenHeader title="Devis" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <KpiRow
            items={[
              { label: 'Acceptation', value: `${quoteStats.acceptanceRate} %`, color: '#128A5E' },
              { label: 'Potentiel', value: formatEuro(quoteStats.potential), color: Palette.blue },
              { label: 'Expirent (7j)', value: `${quoteStats.expiringThisWeek}`, color: '#B7791F' },
            ]}
          />

          <View style={styles.toolbarGap}>
            <ListToolbar
              searchPlaceholder="Rechercher un devis, un client…"
              searchValue={search}
              onSearchChange={setSearch}
              chips={chips}
              selectedChip={chip}
              onSelectChip={(key) => setChip(key as ChipKey)}
              resultLabel={`${filtered.length} devis`}
              sortLabel={sortByAmount ? 'Montant le plus élevé' : 'Plus récents'}
              onToggleSort={() => setSortByAmount((v) => !v)}
            />
          </View>

          <View style={styles.list}>
            {filtered.length > 0 ? (
              filtered.map((quote) => (
                <QuoteRow key={quote.id} quote={quote} highlighted={params.highlight === quote.id} />
              ))
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Aucun devis ne correspond à ces critères.</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  client: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  rowBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  meta: {
    flex: 1,
    fontSize: FontSize.small,
    color: Palette.textTertiary,
  },
  amount: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.blue,
    letterSpacing: -0.4,
  },
  expiresToday: {
    fontSize: FontSize.small,
    fontWeight: '600',
    color: Palette.red,
    marginTop: 6,
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
