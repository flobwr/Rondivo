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
import { formatShortDate } from '@/data/documents/date-utils';
import {
  VEHICLE_STATUS_META,
  VEHICLE_STATUS_ORDER,
  VEHICLE_TYPE_LABEL,
  VEHICLES,
  Vehicle,
  VehicleStatus,
} from '@/data/plus/vehicles';

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export default function VehiculesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<VehicleStatus | null>(null);

  const counts = useMemo(() => {
    const c = { disponible: 0, 'en-intervention': 0, maintenance: 0 } as Record<VehicleStatus, number>;
    for (const v of VEHICLES) c[v.status] += 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = VEHICLES;
    if (status) list = list.filter((v) => v.status === status);
    if (search.trim()) {
      const q = normalize(search);
      list = list.filter((v) => normalize(v.name).includes(q) || normalize(v.plate).includes(q));
    }
    return list;
  }, [status, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: VEHICLES.length, color: Palette.blue },
    ...VEHICLE_STATUS_ORDER.map((s) => ({ key: s, label: VEHICLE_STATUS_META[s].label, count: counts[s], color: VEHICLE_STATUS_META[s].color })),
  ];

  const handleOpen = (vehicle: Vehicle) => router.push(`/plus/vehicule/${vehicle.id}` as never);
  const handleAdd = () => router.push('/plus/vehicule/new' as never);
  const isFiltering = search.trim().length > 0 || status !== null;

  // A quiet fleet-status recap — never invented, just the same counts already
  // powering the filter chips above, read together instead of one at a time.
  const summary = VEHICLE_STATUS_ORDER.filter((s) => counts[s] > 0)
    .map((s) => `${counts[s]} ${VEHICLE_STATUS_META[s].label.toLowerCase()}`)
    .join(' · ');

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Véhicules" onBack={() => router.back()} onAdd={handleAdd} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un véhicule, une plaque…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={status} onSelect={(k) => setStatus(k as VehicleStatus | null)} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(v) => v.id}
          renderItem={({ item, index }) => (
            <FadeInItem index={index}>
              <EntityCard
                icon="truck"
                title={item.name}
                subtitle={`${VEHICLE_TYPE_LABEL[item.type]} · ${item.plate}`}
                meta={`${item.mileage.toLocaleString('fr-FR')} km${
                  item.nextServiceDate ? ` · Entretien ${formatShortDate(item.nextServiceDate)}` : ''
                }`}
                statusLabel={VEHICLE_STATUS_META[item.status].label}
                statusColor={VEHICLE_STATUS_META[item.status].color}
                statusSoft={VEHICLE_STATUS_META[item.status].soft}
                onPress={() => handleOpen(item)}
              />
            </FadeInItem>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View style={styles.summaryWrap}>
              <Text style={styles.count}>
                {filtered.length} véhicule{filtered.length > 1 ? 's' : ''}
                {summary ? <Text style={styles.summary}> · {summary}</Text> : null}
              </Text>
            </View>
          }
          ListEmptyComponent={
            <EmptyState
              icon="truck"
              title="Aucun véhicule"
              subtitle={isFiltering ? 'Aucun véhicule ne correspond à votre recherche.' : 'Ajoutez votre premier véhicule pour commencer.'}
              actionLabel={isFiltering ? undefined : 'Ajouter un véhicule'}
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
    marginBottom: Spacing.md,
  },
  list: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  summaryWrap: {
    marginBottom: Spacing.md,
  },
  count: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  summary: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    opacity: 0.82,
  },
  separator: {
    height: 8,
  },
});
