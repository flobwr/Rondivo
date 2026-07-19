import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TINT_COLORS } from '@/components/clients/types';
import { BottomDock, useBottomDockClearance } from '@/components/ui/BottomDock';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { FadeInItem } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { SkeletonBlock } from '@/components/ui/Shimmer';
import { EntityCard } from '@/components/plus/resource/EntityCard';
import { createThemedStyles, Palette, Spacing } from '@/theme';
import { useAsyncItem } from '@/hooks/use-async-item';
import { useAsyncList } from '@/hooks/use-async-list';
import { EMPLOYEE_STATUS_META, Employee, EmployeeStatus, listEmployees } from '@/services/plus/employees';
import { listVehicles } from '@/services/plus/vehicles';

// Not a separate "availability" field — just a real cross-reference against
// the fleet, so this stays true instead of inventing a live status.
async function fetchEmployeesOnIntervention(): Promise<Set<string>> {
  const vehicles = await listVehicles();
  return new Set(
    vehicles.filter((v) => v.status === 'en-intervention' && v.assignedToId).map((v) => v.assignedToId as string)
  );
}

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

export default function EmployesScreen() {
  const router = useRouter();
  const dockClearance = useBottomDockClearance();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<EmployeeStatus | null>(null);

  const fetchEmployees = useCallback(() => listEmployees(), []);
  const { data: employees, status: loadStatus, refresh } = useAsyncList<Employee>(fetchEmployees);

  const fetchOnIntervention = useCallback(() => fetchEmployeesOnIntervention(), []);
  const { data: EMPLOYEES_ON_INTERVENTION } = useAsyncItem(fetchOnIntervention);
  const onInterventionSet = EMPLOYEES_ON_INTERVENTION ?? new Set<string>();

  const counts = useMemo(() => {
    const c: Record<EmployeeStatus, number> = { actif: 0, inactif: 0 };
    for (const e of employees) c[e.status] += 1;
    return c;
  }, [employees]);

  const filtered = useMemo(() => {
    let list = employees;
    if (status) list = list.filter((e) => e.status === status);
    if (search.trim()) {
      const q = normalize(search);
      list = list.filter((e) => normalize(e.name).includes(q) || normalize(e.poste).includes(q));
    }
    return list;
  }, [employees, status, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: employees.length, color: Palette.blue },
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
            keyExtractor={(e) => e.id}
            renderItem={({ item, index }) => (
              <FadeInItem index={index}>
                <EntityCard
                  icon="user"
                  avatarInitials={item.initials}
                  avatarColor={TINT_COLORS[item.tint].color}
                  title={item.name}
                  subtitle={onInterventionSet.has(item.id) ? `${item.poste} · En intervention` : item.poste}
                  statusLabel={EMPLOYEE_STATUS_META[item.status].label}
                  statusColor={EMPLOYEE_STATUS_META[item.status].color}
                  statusSoft={EMPLOYEE_STATUS_META[item.status].soft}
                  onPress={() => handleOpen(item)}
                />
              </FadeInItem>
            )}
            contentContainerStyle={[styles.list, { paddingBottom: dockClearance }]}
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
        )}
      </SafeAreaView>

      <BottomDock activeIndex={4} />
    </View>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
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
}));
