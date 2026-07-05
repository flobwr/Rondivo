import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { KpiRow } from '@/components/documents/KpiRow';
import { ListToolbar } from '@/components/documents/ListToolbar';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { BadgeTone, StatusBadge } from '@/components/documents/StatusBadge';
import { REPORTS, Report, ReportStatus, reportStats } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const STATUS_TONE: Record<ReportStatus, BadgeTone> = {
  'À compléter': 'amber',
  'En cours': 'blue',
  Terminé: 'green',
  'PDF généré': 'purple',
};

const STATUS_ACCENT: Record<ReportStatus, string> = {
  'À compléter': '#E0A429',
  'En cours': Palette.blue,
  Terminé: '#128A5E',
  'PDF généré': Palette.purple,
};

type ChipKey = 'all' | ReportStatus;

const CHIP_ORDER: ChipKey[] = ['all', 'À compléter', 'En cours', 'Terminé', 'PDF généré'];
const CHIP_LABEL: Record<ChipKey, string> = {
  all: 'Tous',
  'À compléter': 'À compléter',
  'En cours': 'En cours',
  Terminé: 'Terminé',
  'PDF généré': 'PDF généré',
};

function ReportRow({ report, highlighted }: { report: Report; highlighted?: boolean }) {
  return (
    <View
      style={[
        styles.card,
        { borderLeftColor: STATUS_ACCENT[report.status] },
        highlighted ? styles.cardHighlighted : null,
      ]}>
      <View style={styles.rowTop}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {report.title}
        </Text>
        <StatusBadge label={report.status} tone={STATUS_TONE[report.status]} />
      </View>
      <Text style={styles.meta}>
        {report.client} · {report.date}
      </Text>
    </View>
  );
}

export default function RapportsScreen() {
  const params = useLocalSearchParams<{ highlight?: string }>();
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState<ChipKey>('all');
  const [sortRecent, setSortRecent] = useState(true);

  const filtered = useMemo(() => {
    let list = REPORTS;
    if (chip !== 'all') list = list.filter((r) => r.status === chip);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) => r.client.toLowerCase().includes(q) || r.title.toLowerCase().includes(q)
      );
    }
    return sortRecent ? list : [...list].reverse();
  }, [chip, search, sortRecent]);

  const chips = CHIP_ORDER.map((key) => ({
    key,
    label: CHIP_LABEL[key],
    count: key === 'all' ? REPORTS.length : REPORTS.filter((r) => r.status === key).length,
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScreenHeader title="Rapports" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <KpiRow
            items={[
              { label: 'À compléter', value: `${reportStats.toComplete}`, color: '#B7791F' },
              { label: 'En cours', value: `${reportStats.inProgress}`, color: Palette.blue },
              { label: 'PDF générés', value: `${reportStats.pdfGenerated}`, color: Palette.purple },
            ]}
          />

          <View style={styles.toolbarGap}>
            <ListToolbar
              searchPlaceholder="Rechercher un rapport, un client…"
              searchValue={search}
              onSearchChange={setSearch}
              chips={chips}
              selectedChip={chip}
              onSelectChip={(key) => setChip(key as ChipKey)}
              resultLabel={`${filtered.length} rapport${filtered.length > 1 ? 's' : ''}`}
              sortLabel={sortRecent ? 'Plus récents' : 'Plus anciens'}
              onToggleSort={() => setSortRecent((v) => !v)}
            />
          </View>

          <View style={styles.list}>
            {filtered.length > 0 ? (
              filtered.map((report) => (
                <ReportRow key={report.id} report={report} highlighted={params.highlight === report.id} />
              ))
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Aucun rapport ne correspond à ces critères.</Text>
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
    borderLeftWidth: 4,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    ...cardShadow,
  },
  cardHighlighted: {
    borderWidth: 1.5,
    borderColor: Palette.blue,
    borderLeftWidth: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
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
