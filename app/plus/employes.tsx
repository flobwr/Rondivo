import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TINT_COLORS } from '@/components/clients/types';
import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { EntityCard } from '@/components/plus/resource/EntityCard';
import { Palette, Spacing } from '@/constants/design';
import { EMPLOYEE_STATUS_META, EMPLOYEES, Employee, EmployeeStatus } from '@/data/plus/employees';
import { VEHICLES } from '@/data/plus/vehicles';

// Not a separate "availability" field — just a real cross-reference against
// the fleet, so this stays true instead of inventing a live status.
const EMPLOYEES_ON_INTERVENTION = new Set(
  VEHICLES.filter((v) => v.status === 'en-intervention' && v.assignedToId).map((v) => v.assignedToId)
);

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export default function EmployesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EmployeeStatus | null>(null);

  const counts = useMemo(() => {
    const c: Record<EmployeeStatus, number> = { actif: 0, inactif: 0 };
    for (const e of EMPLOYEES) c[e.status] += 1;
    return c;
  }, []);

  const filtered = useMemo(() => {
    let list = EMPLOYEES;
    if (status) list = list.filter((e) => e.status === status);
    if (search.trim()) {
      const q = normalize(search);
      list = list.filter((e) => normalize(e.name).includes(q) || normalize(e.poste).includes(q));
    }
    return list;
  }, [status, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: EMPLOYEES.length, color: Palette.blue },
    { key: 'actif', label: 'Actifs', count: counts.actif, color: EMPLOYEE_STATUS_META.actif.color },
    { key: 'inactif', label: 'Inactifs', count: counts.inactif, color: EMPLOYEE_STATUS_META.inactif.color },
  ];

  const handleOpen = (employee: Employee) => router.push(`/plus/employe/${employee.id}` as never);
  const handleAdd = () => router.push('/plus/employe/new' as never);

  const isFiltering = search.trim().length > 0 || status !== null;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Employés" onBack={() => router.back()} onAdd={handleAdd} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un employé, un poste…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={status} onSelect={(k) => setStatus(k as EmployeeStatus | null)} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(e) => e.id}
          renderItem={({ item, index }) => (
            <FadeInItem index={index}>
              <EntityCard
                icon="user"
                avatarInitials={item.initials}
                avatarColor={TINT_COLORS[item.tint].color}
                title={item.name}
                subtitle={EMPLOYEES_ON_INTERVENTION.has(item.id) ? `${item.poste} · En intervention` : item.poste}
                statusLabel={EMPLOYEE_STATUS_META[item.status].label}
                statusColor={EMPLOYEE_STATUS_META[item.status].color}
                statusSoft={EMPLOYEE_STATUS_META[item.status].soft}
                onPress={() => handleOpen(item)}
              />
            </FadeInItem>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.count}>
              {filtered.length} employé{filtered.length > 1 ? 's' : ''}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              icon="users"
              title="Aucun employé"
              subtitle={
                isFiltering
                  ? 'Aucun employé ne correspond à votre recherche.'
                  : 'Ajoutez votre premier employé pour commencer.'
              }
              actionLabel={isFiltering ? undefined : 'Ajouter un employé'}
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
