import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { PressableScale } from '@/components/ui/PressableScale';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { FactureCard } from '@/components/documents/factures/FactureCard';
import { FACTURE_STATUS_META, FACTURE_STATUS_ORDER, Facture, FactureStatus, MOCK_FACTURES } from '@/data/documents/factures';
import { Palette, Spacing } from '@/constants/design';

type SortKey = 'recent' | 'amount' | 'due';

const SORT_LABEL: Record<SortKey, string> = {
  recent: 'Plus récentes',
  amount: 'Montant décroissant',
  due: "Échéance la plus proche",
};

export default function FacturesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<FactureStatus | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('recent');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const listOpacity = useRef(new Animated.Value(1)).current;

  const pulseList = () => {
    listOpacity.setValue(0.4);
    Animated.timing(listOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  };

  const counts = useMemo(() => {
    const c = { brouillon: 0, envoyee: 0, payee: 0, enRetard: 0, annulee: 0 } as Record<FactureStatus, number>;
    for (const f of MOCK_FACTURES) c[f.status] += 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = MOCK_FACTURES;
    if (status) list = list.filter((f) => f.status === status);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.clientName.toLowerCase().includes(q) || f.number.toLowerCase().includes(q));
    }
    const sorted = [...list];
    if (sortKey === 'amount') sorted.sort((a, b) => b.amount - a.amount);
    else if (sortKey === 'due') sorted.sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime());
    else sorted.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
    return sorted;
  }, [status, search, sortKey]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Toutes', count: MOCK_FACTURES.length, color: Palette.blue },
    ...FACTURE_STATUS_ORDER.map((s) => ({
      key: s,
      label: FACTURE_STATUS_META[s].label,
      count: counts[s],
      color: FACTURE_STATUS_META[s].color,
    })),
  ];

  const sortItems: ActionSheetItem[] = (['recent', 'amount', 'due'] as SortKey[]).map((key) => ({
    key,
    icon: key === 'recent' ? 'clock' : key === 'amount' ? 'trending-down' : 'calendar',
    label: SORT_LABEL[key],
    onPress: () => setSortKey(key),
  }));

  const handleOpen = (facture: Facture) => router.push(`/facture/${facture.id}` as never);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Factures" onBack={() => router.back()} />

        <View style={styles.searchWrap}>
          <SearchBar
            value={search}
            onChangeText={setSearch}
            placeholder="Rechercher une facture, un client…"
            onFilterPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSortMenuOpen(true);
            }}
            filtersActive={sortKey !== 'recent'}
          />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips
            defs={chipDefs}
            activeKey={status}
            onSelect={(k) => {
              pulseList();
              setStatus(k as FactureStatus | null);
            }}
          />
        </View>

        <Animated.View style={{ flex: 1, opacity: listOpacity }}>
          <FlatList
            data={filtered}
            keyExtractor={(f) => f.id}
            renderItem={({ item, index }) => (
              <FadeInItem index={index}>
                <FactureCard facture={item} onPress={() => handleOpen(item)} />
              </FadeInItem>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={
              <View style={styles.toolbar}>
                <Text style={styles.count}>
                  {filtered.length} facture{filtered.length > 1 ? 's' : ''}
                </Text>
                <PressableScale
                  onPress={() => setSortMenuOpen(true)}
                  hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
                  style={styles.sortButton}
                  accessibilityLabel="Trier">
                  <Feather name="sliders" size={14} color={Palette.textSecondary} />
                  <Text style={styles.sortLabel}>{SORT_LABEL[sortKey]}</Text>
                </PressableScale>
              </View>
            }
            ListEmptyComponent={
              <EmptyState
                icon="file-text"
                title="Aucune facture"
                subtitle="Aucune facture ne correspond à votre recherche."
              />
            }
          />
        </Animated.View>
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <ActionSheetMenu
        visible={sortMenuOpen}
        title="Trier par"
        items={sortItems.map((item) => ({ ...item, onPress: () => { pulseList(); item.onPress(); } }))}
        onClose={() => setSortMenuOpen(false)}
      />
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
    height: 6,
  },
});
