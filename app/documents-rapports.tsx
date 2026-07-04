import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContextualFAB } from '@/components/documents/ContextualFAB';
import { DocumentHeader } from '@/components/documents/DocumentHeader';
import { FilterChips, type FilterChip } from '@/components/documents/FilterChips';
import { QuickActions } from '@/components/documents/QuickActions';
import { StatusBadge } from '@/components/documents/StatusBadge';
import { SummaryRow } from '@/components/documents/SummaryRow';
import { REPORTS, REPORT_SUMMARY } from '@/components/documents/mock-data';
import type { Report } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const FILTERS: FilterChip[] = [
  { label: 'Tous', count: REPORTS.length },
  { label: 'À compléter', count: REPORTS.filter((r) => r.status === 'toComplete').length, dotColor: Palette.orange },
  { label: 'En cours', count: REPORTS.filter((r) => r.status === 'inProgress').length, dotColor: Palette.blue },
  { label: 'PDF généré', count: REPORTS.filter((r) => r.status === 'pdfGenerated').length, dotColor: Palette.purple },
];

function getActionsForStatus(status: string) {
  switch (status) {
    case 'toComplete':
    case 'inProgress':
      return [
        { label: 'Terminer', icon: 'check' as const },
        { label: 'Générer PDF', icon: 'file' as const },
      ];
    case 'completed':
      return [
        { label: 'Générer PDF', icon: 'file' as const },
        { label: 'Partager', icon: 'share-2' as const },
      ];
    case 'pdfGenerated':
      return [
        { label: 'Partager', icon: 'share-2' as const },
        { label: 'Télécharger', icon: 'download' as const },
      ];
    default:
      return [];
  }
}

function ReportCard({ report }: { report: Report }) {
  const [showActions, setShowActions] = useState(false);
  const actions = getActionsForStatus(report.status);

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
          <Text style={styles.title}>{report.title}</Text>
          <Text style={styles.meta}>
            {report.client} · {report.date}
          </Text>
        </View>
        <StatusBadge type="report" status={report.status} />
      </View>

      {showActions && actions.length > 0 ? (
        <QuickActions actions={actions} />
      ) : null}
    </Pressable>
  );
}

export default function RapportsScreen() {
  const [filterIndex, setFilterIndex] = useState(0);

  const filterStatus = ['all', 'toComplete', 'inProgress', 'pdfGenerated'][filterIndex];
  const filtered =
    filterStatus === 'all'
      ? REPORTS
      : REPORTS.filter((r) => r.status === filterStatus);

  const handleFilterChange = useCallback((index: number) => {
    setFilterIndex(index);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentHeader title="Rapports" />

        <View style={styles.summaryCard}>
          <SummaryRow
            items={[
              {
                label: 'à terminer',
                value: String(REPORT_SUMMARY.toCompleteCount),
                highlight: true,
              },
              {
                label: "terminés auj.",
                value: String(REPORT_SUMMARY.completedTodayCount),
              },
              {
                label: 'PDF générés',
                value: String(REPORT_SUMMARY.pdfGeneratedCount),
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
          <Text style={styles.listCount}>{filtered.length} rapports</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {filtered.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </ScrollView>
      </SafeAreaView>

      <ContextualFAB label="Nouveau rapport" icon="plus" />
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
