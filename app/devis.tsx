import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { DevisCard } from '@/components/documents/devis/DevisCard';
import { DEVIS_STATUS_META, DEVIS_STATUS_ORDER, Devis, DevisStatus, MOCK_DEVIS } from '@/data/documents/devis';
import { Palette, Spacing } from '@/constants/design';

type SortKey = 'recent' | 'amount' | 'validity';

const SORT_LABEL: Record<SortKey, string> = {
  recent: 'Plus récents',
  amount: 'Montant décroissant',
  validity: 'Validité la plus proche',
};

export default function DevisListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<DevisStatus | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('recent');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  const counts = useMemo(() => {
    const c = { brouillon: 0, envoye: 0, vu: 0, accepte: 0, refuse: 0, expire: 0 } as Record<DevisStatus, number>;
    for (const d of MOCK_DEVIS) c[d.status] += 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_DEVIS;
    if (status) list = list.filter((d) => d.status === status);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((d) => d.clientName.toLowerCase().includes(q) || d.number.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sortKey === 'amount') sorted.sort((a, b) => b.amount - a.amount);
    else if (sortKey === 'validity')
      sorted.sort((a, b) => new Date(a.validUntil).getTime() - new Date(b.validUntil).getTime());
    else sorted.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
    return sorted;
  }, [status, search, sortKey]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: MOCK_DEVIS.length, color: Palette.blue },
    ...DEVIS_STATUS_ORDER.map((s) => ({
      key: s,
      label: DEVIS_STATUS_META[s].label,
      count: counts[s],
      color: DEVIS_STATUS_META[s].color,
    })),
  ];

  const sortItems: ActionSheetItem[] = (['recent', 'amount', 'validity'] as SortKey[]).map((key) => ({
    key,
    icon: key === 'recent' ? 'clock' : key === 'amount' ? 'trending-down' : 'calendar',
    label: SORT_LABEL[key],
    onPress: () => setSortKey(key),
  }));

  const handleOpen = (devis: Devis) => router.push(`/devis/${devis.id}` as never);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Devis" onBack={() => router.back()} />

        <View style={styles.searchWrap}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher un devis, un client…"
            onFilterPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSortMenuOpen(true);
            }}
            filtersActive={sortKey !== 'recent'}
          />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={status} onSelect={(k) => setStatus(k as DevisStatus | null)} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(d) => d.id}
          renderItem={({ item }) => <DevisCard devis={item} onPress={() => handleOpen(item)} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View style={styles.toolbar}>
              <Text style={styles.count}>
                {filtered.length} devis
              </Text>
              <Pressable
                onPress={() => setSortMenuOpen(true)}
                hitSlop={6}
                style={styles.sortButton}
                accessibilityRole="button"
                accessibilityLabel="Trier">
                <Feather name="sliders" size={14} color={Palette.textSecondary} />
                <Text style={styles.sortLabel}>{SORT_LABEL[sortKey]}</Text>
              </Pressable>
            </View>
          }
          ListEmptyComponent={
            <EmptyState icon="edit-3" title="Aucun devis" subtitle="Aucun devis ne correspond à votre recherche." />
          }
        />
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu visible={sortMenuOpen} title="Trier par" items={sortItems} onClose={() => setSortMenuOpen(false)} />
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
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  count: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  separator: {
    height: 10,
  },
});
