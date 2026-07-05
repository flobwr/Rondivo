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
import { PRESTATION_UNIT_LABEL, Prestation, PRESTATIONS } from '@/data/plus/prestations';

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export default function PrestationsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return PRESTATIONS;
    const q = normalize(search);
    return PRESTATIONS.filter((p) => normalize(p.name).includes(q));
  }, [search]);

  const handleOpen = (prestation: Prestation) => router.push(`/plus/prestation/new?editId=${prestation.id}` as never);
  const handleAdd = () => router.push('/plus/prestation/new' as never);
  const isFiltering = search.trim().length > 0;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Prestations" onBack={() => router.back()} onAdd={handleAdd} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher une prestation…" />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          renderItem={({ item, index }) => (
            <FadeInItem index={index}>
              <EntityCard
                icon="layers"
                title={item.name}
                subtitle={`${formatAmount(item.unitPrice)} ${PRESTATION_UNIT_LABEL[item.unit]}`}
                onPress={() => handleOpen(item)}
              />
            </FadeInItem>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.count}>
              {filtered.length} prestation{filtered.length > 1 ? 's' : ''}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="layers"
              title="Aucune prestation"
              subtitle={isFiltering ? 'Aucune prestation ne correspond à votre recherche.' : 'Ajoutez votre première prestation pour commencer.'}
              actionLabel={isFiltering ? undefined : 'Ajouter une prestation'}
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
