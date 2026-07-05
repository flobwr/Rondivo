import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { EntityCard } from '@/components/plus/resource/EntityCard';
import { Palette, Spacing } from '@/constants/design';
import {
  MATERIEL,
  MATERIEL_CATEGORY_LABEL,
  MATERIEL_CONDITION_META,
  MATERIEL_CONDITION_ORDER,
  MaterielCondition,
  MaterielItem,
} from '@/data/plus/materiel';

const CATEGORY_ICON = {
  'outillage-electroportatif': 'tool',
  mesure: 'activity',
  securite: 'shield',
  levage: 'arrow-up',
  autre: 'box',
} as const;

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export default function MaterielScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState<MaterielCondition | null>(null);

  const counts = useMemo(() => {
    const c = { 'bon-etat': 0, 'a-reviser': 0, 'hors-service': 0 } as Record<MaterielCondition, number>;
    for (const m of MATERIEL) c[m.condition] += 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = MATERIEL;
    if (condition) list = list.filter((m) => m.condition === condition);
    if (search.trim()) {
      const q = normalize(search);
      list = list.filter((m) => normalize(m.name).includes(q) || normalize(m.location).includes(q));
    }
    return list;
  }, [condition, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: MATERIEL.length, color: Palette.blue },
    ...MATERIEL_CONDITION_ORDER.map((c) => ({
      key: c,
      label: MATERIEL_CONDITION_META[c].label,
      count: counts[c],
      color: MATERIEL_CONDITION_META[c].color,
    })),
  ];

  const handleOpen = (item: MaterielItem) => router.push(`/plus/materiel/${item.id}` as never);
  const handleAdd = () => router.push('/plus/materiel/new' as never);
  const isFiltering = search.trim().length > 0 || condition !== null;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Matériel" onBack={() => router.back()} onAdd={handleAdd} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher du matériel…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={condition} onSelect={(k) => setCondition(k as MaterielCondition | null)} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(m) => m.id}
          renderItem={({ item, index }) => (
            <FadeInItem index={index}>
              <EntityCard
                icon={CATEGORY_ICON[item.category]}
                title={item.name}
                subtitle={`${MATERIEL_CATEGORY_LABEL[item.category]} · ${item.location}`}
                statusLabel={MATERIEL_CONDITION_META[item.condition].label}
                statusColor={MATERIEL_CONDITION_META[item.condition].color}
                statusSoft={MATERIEL_CONDITION_META[item.condition].soft}
                onPress={() => handleOpen(item)}
              />
            </FadeInItem>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.count}>
              {filtered.length} élément{filtered.length > 1 ? 's' : ''}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="tool"
              title="Aucun matériel"
              subtitle={isFiltering ? 'Aucun matériel ne correspond à votre recherche.' : 'Ajoutez votre premier équipement pour commencer.'}
              actionLabel={isFiltering ? undefined : 'Ajouter du matériel'}
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
