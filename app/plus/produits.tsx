import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { EntityCard } from '@/components/plus/resource/EntityCard';
import { Palette, Spacing } from '@/constants/design';
import { formatAmount } from '@/data/documents/date-utils';
import { Produit, PRODUITS } from '@/data/plus/produits';

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export default function ProduitsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return PRODUITS;
    const q = normalize(search);
    return PRODUITS.filter((p) => normalize(p.name).includes(q) || normalize(p.reference).includes(q));
  }, [search]);

  const handleOpen = (produit: Produit) => router.push(`/plus/produit/new?editId=${produit.id}` as never);
  const handleAdd = () => router.push('/plus/produit/new' as never);
  const isFiltering = search.trim().length > 0;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Produits" onBack={() => router.back()} onAdd={handleAdd} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un produit, une référence…" />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          renderItem={({ item, index }) => (
            <FadeInItem index={index}>
              <EntityCard
                icon="box"
                title={item.name}
                subtitle={`${item.reference} · ${formatAmount(item.unitPrice)}`}
                meta={`${item.stock} en stock`}
                onPress={() => handleOpen(item)}
              />
            </FadeInItem>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.count}>
              {filtered.length} produit{filtered.length > 1 ? 's' : ''}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="box"
              title="Aucun produit"
              subtitle={isFiltering ? 'Aucun produit ne correspond à votre recherche.' : 'Ajoutez votre premier produit pour commencer.'}
              actionLabel={isFiltering ? undefined : 'Ajouter un produit'}
              onAction={isFiltering ? undefined : handleAdd}
            />
          }
        />
      </SafeAreaView>

      <BottomNav activeIndex={4} />
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
