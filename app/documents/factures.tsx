import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { KpiRow } from '@/components/documents/KpiRow';
import { ListToolbar } from '@/components/documents/ListToolbar';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { BadgeTone, StatusBadge } from '@/components/documents/StatusBadge';
import { INVOICES, Invoice, InvoiceStatus, invoiceStats } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { formatEuro } from '@/constants/format';
import { cardShadow } from '@/constants/shadow';

const STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  Brouillon: 'neutral',
  Envoyée: 'blue',
  'En retard': 'red',
  Payée: 'green',
};

type ChipKey = 'all' | InvoiceStatus;

const CHIP_ORDER: ChipKey[] = ['all', 'En retard', 'Envoyée', 'Brouillon', 'Payée'];
const CHIP_LABEL: Record<ChipKey, string> = {
  all: 'Toutes',
  Brouillon: 'Brouillon',
  Envoyée: 'Envoyée',
  'En retard': 'En retard',
  Payée: 'Payée',
};

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  return (
    <View style={styles.card}>
      <View style={styles.rowTop}>
        <Text style={styles.client} numberOfLines={1} ellipsizeMode="tail">
          {invoice.client}
        </Text>
        <StatusBadge label={invoice.status} tone={STATUS_TONE[invoice.status]} />
      </View>
      <View style={styles.rowBottom}>
        <Text style={styles.meta} numberOfLines={1}>
          {invoice.number} · Échéance {invoice.dueDate}
        </Text>
        <Text style={styles.amount}>{formatEuro(invoice.amount)}</Text>
      </View>
      {invoice.overdueDays ? (
        <Text style={styles.overdue}>Échue depuis {invoice.overdueDays} jours</Text>
      ) : null}
    </View>
  );
}

export default function FacturesScreen() {
  const params = useLocalSearchParams<{ filter?: string }>();
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState<ChipKey>(params.filter === 'late' ? 'En retard' : 'all');
  const [sortByAmount, setSortByAmount] = useState(false);

  const filtered = useMemo(() => {
    let list = INVOICES;
    if (chip !== 'all') list = list.filter((i) => i.status === chip);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (i) => i.client.toLowerCase().includes(q) || i.number.toLowerCase().includes(q)
      );
    }
    return sortByAmount ? [...list].sort((a, b) => b.amount - a.amount) : list;
  }, [chip, search, sortByAmount]);

  const chips = CHIP_ORDER.map((key) => ({
    key,
    label: CHIP_LABEL[key],
    count: key === 'all' ? INVOICES.length : INVOICES.filter((i) => i.status === key).length,
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScreenHeader title="Factures" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <KpiRow
            items={[
              { label: 'Encaissé', value: formatEuro(invoiceStats.collected), color: '#128A5E' },
              { label: 'À recevoir', value: formatEuro(invoiceStats.pendingAmount), color: Palette.blue },
              { label: 'En retard', value: formatEuro(invoiceStats.overdueAmount), color: Palette.red },
            ]}
          />

          <View style={styles.toolbarGap}>
            <ListToolbar
              searchPlaceholder="Rechercher une facture, un client…"
              searchValue={search}
              onSearchChange={setSearch}
              chips={chips}
              selectedChip={chip}
              onSelectChip={(key) => setChip(key as ChipKey)}
              resultLabel={`${filtered.length} facture${filtered.length > 1 ? 's' : ''}`}
              sortLabel={sortByAmount ? 'Montant le plus élevé' : 'Plus récentes'}
              onToggleSort={() => setSortByAmount((v) => !v)}
            />
          </View>

          <View style={styles.list}>
            {filtered.length > 0 ? (
              filtered.map((invoice) => <InvoiceRow key={invoice.id} invoice={invoice} />)
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Aucune facture ne correspond à ces critères.</Text>
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
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  overdue: {
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
