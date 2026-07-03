import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { ContratCard } from '@/components/documents/contrats/ContratCard';
import { CONTRAT_STATUS_META, CONTRAT_STATUS_ORDER, Contrat, ContratStatus, MOCK_CONTRATS } from '@/data/documents/contrats';
import { Palette, Spacing } from '@/constants/design';

export default function ContratsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ContratStatus | null>(null);

  const counts = useMemo(() => {
    const c = { brouillon: 0, enAttenteSignature: 0, signe: 0, expire: 0 } as Record<ContratStatus, number>;
    for (const contrat of MOCK_CONTRATS) c[contrat.status] += 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_CONTRATS;
    if (status) list = list.filter((c) => c.status === status);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((c) => c.clientName.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [status, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: MOCK_CONTRATS.length, color: Palette.blue },
    ...CONTRAT_STATUS_ORDER.map((s) => ({
      key: s,
      label: CONTRAT_STATUS_META[s].label,
      count: counts[s],
      color: CONTRAT_STATUS_META[s].color,
    })),
  ];

  const handleOpen = (contrat: Contrat) => router.push(`/contrat/${contrat.id}` as never);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Contrats" onBack={() => router.back()} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un contrat, un client…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={status} onSelect={(k) => setStatus(k as ContratStatus | null)} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => <ContratCard contrat={item} onPress={() => handleOpen(item)} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.count}>
              {filtered.length} contrat{filtered.length > 1 ? 's' : ''}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState icon="briefcase" title="Aucun contrat" subtitle="Aucun contrat ne correspond à votre recherche." />
          }
        />
      </SafeAreaView>

      <BottomNav activeIndex={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.md,
  },
  chipsWrap: {
    marginBottom: Spacing.sm,
  },
  list: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  count: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    marginBottom: Spacing.sm,
  },
  separator: {
    height: 10,
  },
});
