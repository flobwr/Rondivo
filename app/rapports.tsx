import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { RapportCard } from '@/components/documents/rapports/RapportCard';
import { RAPPORT_STATUS_META, RAPPORT_STATUS_ORDER, Rapport, RapportStatus, MOCK_RAPPORTS } from '@/data/documents/rapports';
import { Palette, Spacing } from '@/theme';

export default function RapportsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<RapportStatus | null>(null);
  const listOpacity = useRef(new Animated.Value(1)).current;

  const pulseList = () => {
    listOpacity.setValue(0.4);
    Animated.timing(listOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  };

  const counts = useMemo(() => {
    const c = { aCompleter: 0, enCours: 0, termine: 0, pdfGenere: 0 } as Record<RapportStatus, number>;
    for (const r of MOCK_RAPPORTS) c[r.status] += 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_RAPPORTS;
    if (status) list = list.filter((r) => r.status === status);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) => r.clientName.toLowerCase().includes(q) || r.interventionLabel.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [status, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: MOCK_RAPPORTS.length, color: Palette.blue },
    ...RAPPORT_STATUS_ORDER.map((s) => ({
      key: s,
      label: RAPPORT_STATUS_META[s].label,
      count: counts[s],
      color: RAPPORT_STATUS_META[s].color,
    })),
  ];

  const handleOpen = (rapport: Rapport) => router.push(`/rapport/${rapport.id}` as never);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Rapports" onBack={() => router.back()} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un rapport, un client…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips
            defs={chipDefs}
            activeKey={status}
            onSelect={(k) => {
              pulseList();
              setStatus(k as RapportStatus | null);
            }}
          />
        </View>

        <Animated.View style={{ flex: 1, opacity: listOpacity }}>
          <FlatList
            data={filtered}
            keyExtractor={(r) => r.id}
            renderItem={({ item, index }) => (
              <FadeInItem index={index}>
                <RapportCard rapport={item} onPress={() => handleOpen(item)} />
              </FadeInItem>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={
              <Text style={styles.count}>
                {filtered.length} rapport{filtered.length > 1 ? 's' : ''}
              </Text>
            }
            ListEmptyComponent={
              <EmptyState icon="clipboard" title="Aucun rapport" subtitle="Aucun rapport ne correspond à votre recherche." />
            }
          />
        </Animated.View>
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
    height: 6,
  },
});
