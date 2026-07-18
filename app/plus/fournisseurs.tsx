import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { EntityCard } from '@/components/plus/resource/EntityCard';
import { Palette, Spacing } from '@/theme';
import { useAsyncList } from '@/hooks/use-async-list';
import {
  SUPPLIER_CATEGORY_LABEL,
  SUPPLIER_CATEGORY_ORDER,
  Supplier,
  SupplierCategory,
  listSuppliers,
} from '@/services/plus/suppliers';

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export default function FournisseursScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<SupplierCategory | null>(null);

  const fetchSuppliers = useCallback(() => listSuppliers(), []);
  const { data: SUPPLIERS, status: loadStatus, refresh } = useAsyncList<Supplier>(fetchSuppliers);

  const counts = useMemo(() => {
    const c = {} as Record<SupplierCategory, number>;
    for (const cat of SUPPLIER_CATEGORY_ORDER) c[cat] = 0;
    for (const s of SUPPLIERS) c[s.category] += 1;
    return c;
  }, [SUPPLIERS]);

  const filtered = useMemo(() => {
    let list = SUPPLIERS;
    if (category) list = list.filter((s) => s.category === category);
    if (search.trim()) {
      const q = normalize(search);
      list = list.filter((s) => normalize(s.name).includes(q));
    }
    return list;
  }, [SUPPLIERS, category, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: SUPPLIERS.length, color: Palette.blue },
    ...SUPPLIER_CATEGORY_ORDER.filter((c) => counts[c] > 0).map((c) => ({
      key: c,
      label: SUPPLIER_CATEGORY_LABEL[c],
      count: counts[c],
      color: Palette.blue,
    })),
  ];

  const handleOpen = (supplier: Supplier) => router.push(`/plus/fournisseur/${supplier.id}` as never);
  const handleAdd = () => router.push('/plus/fournisseur/new' as never);
  const isFiltering = search.trim().length > 0 || category !== null;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Fournisseurs" onBack={() => router.back()} onAdd={handleAdd} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un fournisseur…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={category} onSelect={(k) => setCategory(k as SupplierCategory | null)} />
        </View>

        {loadStatus === 'loading' ? (
          <View style={[styles.list, { gap: Spacing.md }]}>
            <SkeletonBlock height={72} radius={18} />
            <SkeletonBlock height={72} radius={18} />
            <SkeletonBlock height={72} radius={18} />
          </View>
        ) : loadStatus === 'error' ? (
          <EmptyState icon="alert-circle" title="Impossible de charger" subtitle="Une erreur est survenue." actionLabel="Réessayer" onAction={refresh} />
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(s) => s.id}
            renderItem={({ item, index }) => (
              <FadeInItem index={index}>
                <EntityCard
                  icon="package"
                  title={item.name}
                  subtitle={SUPPLIER_CATEGORY_LABEL[item.category]}
                  meta={item.phone}
                  onPress={() => handleOpen(item)}
                />
              </FadeInItem>
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListHeaderComponent={
              <Text style={styles.count}>
                {filtered.length} fournisseur{filtered.length > 1 ? 's' : ''}
              </Text>
            }
            ListEmptyComponent={
              <EmptyState
                icon="package"
                title="Aucun fournisseur"
                subtitle={isFiltering ? 'Aucun fournisseur ne correspond à votre recherche.' : 'Ajoutez votre premier fournisseur pour commencer.'}
                actionLabel={isFiltering ? undefined : 'Ajouter un fournisseur'}
                onAction={isFiltering ? undefined : handleAdd}
              />
            }
          />
        )}
      </SafeAreaView>

      <BottomDock activeIndex={4} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.sm,
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
    height: 8,
  },
});
