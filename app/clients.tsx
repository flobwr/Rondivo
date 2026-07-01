import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Linking, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientFilters } from '@/components/clients/ClientFilters';
import { ClientHeader } from '@/components/clients/ClientHeader';
import { ClientSearch } from '@/components/clients/ClientSearch';
import { ClientStats } from '@/components/clients/ClientStats';
import { SORT_META, type Client, type ClientStatus, type SortKey, type ViewMode } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { CLIENTS } from '@/data/clients';

function normalize(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function matchesQuery(client: Client, query: string) {
  if (!query) return true;
  const q = normalize(query);
  return (
    normalize(client.name).includes(q) ||
    normalize(client.phone).includes(q) ||
    normalize(client.address).includes(q) ||
    normalize(client.email).includes(q) ||
    (client.company ? normalize(client.company).includes(q) : false)
  );
}

function sortClients(clients: Client[], sortKey: SortKey) {
  const sorted = [...clients];
  if (sortKey === 'name') {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortKey === 'recent') {
    sorted.sort((a, b) => a.lastInterventionDaysAgo - b.lastInterventionDaysAgo);
  } else {
    sorted.sort((a, b) => a.priority - b.priority || a.lastInterventionDaysAgo - b.lastInterventionDaysAgo);
  }
  return sorted;
}

function statKeyToStatus(key: ClientStatus | 'new-clients'): ClientStatus {
  return key === 'new-clients' ? 'new' : key;
}

export default function ClientsScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<ClientStatus[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('priority');
  const [viewMode, setViewMode] = useState<ViewMode>('comfortable');

  const counts = useMemo(() => {
    const result: Record<ClientStatus, number> = {
      'action-required': 0,
      'follow-up': 0,
      'up-to-date': 0,
      new: 0,
    };
    for (const client of CLIENTS) {
      result[client.status] += 1;
    }
    return result;
  }, []);

  const visibleClients = useMemo(() => {
    const filtered = CLIENTS.filter(
      (client) =>
        matchesQuery(client, searchQuery) &&
        (selectedStatuses.length === 0 || selectedStatuses.includes(client.status))
    );
    return sortClients(filtered, sortKey);
  }, [searchQuery, selectedStatuses, sortKey]);

  const toggleStatus = useCallback((status: ClientStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  }, []);

  const handleStatSelect = useCallback(
    (key: ClientStatus | 'new-clients') => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      toggleStatus(statKeyToStatus(key));
    },
    [toggleStatus]
  );

  const resetFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSortKey('priority');
  }, []);

  const toggleViewMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode((prev) => (prev === 'comfortable' ? 'compact' : 'comfortable'));
  }, []);

  const handleAddPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Nouveau client', 'Le formulaire de création arrive bientôt.');
  }, []);

  const handleOpenClient = useCallback(
    (client: Client) => {
      router.push(`/client/${client.id}`);
    },
    [router]
  );

  const handleCall = useCallback((client: Client) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Linking.openURL(`tel:${client.phone.replace(/\s+/g, '')}`);
  }, []);

  const handleNavigate = useCallback((client: Client) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const query = encodeURIComponent(client.address);
    const url = Platform.select({
      ios: `maps://?daddr=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url!);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Client }) => (
      <ClientCard
        client={item}
        variant={viewMode}
        onPress={handleOpenClient}
        onCall={handleCall}
        onNavigate={handleNavigate}
      />
    ),
    [viewMode, handleOpenClient, handleCall, handleNavigate]
  );

  const activeStatCount = selectedStatuses.length;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <FlatList
          data={visibleClients}
          keyExtractor={(client) => client.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={9}
          removeClippedSubviews
          ListHeaderComponent={
            <View style={styles.header}>
              <ClientHeader onAddPress={handleAddPress} />

              <View style={styles.section}>
                <ClientSearch
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onFilterPress={() => setFiltersOpen((prev) => !prev)}
                  filtersActive={activeStatCount > 0}
                />
              </View>

              <View style={styles.section}>
                <ClientFilters
                  visible={filtersOpen}
                  selectedStatuses={selectedStatuses}
                  onToggleStatus={toggleStatus}
                  sortKey={sortKey}
                  onChangeSort={setSortKey}
                  onReset={resetFilters}
                />
              </View>

              <View style={styles.section}>
                <ClientStats
                  counts={counts}
                  newClientsCount={counts.new}
                  activeKey={
                    selectedStatuses.length === 1
                      ? selectedStatuses[0] === 'new'
                        ? 'new-clients'
                        : selectedStatuses[0]
                      : null
                  }
                  onSelect={handleStatSelect}
                />
              </View>

              <View style={styles.toolbar}>
                <Text style={styles.count}>{visibleClients.length} clients</Text>

                <View style={styles.toolbarActions}>
                  <Pressable
                    style={styles.sortPill}
                    onPress={() => setFiltersOpen((prev) => !prev)}
                    hitSlop={6}>
                    <Feather name="sliders" size={13} color={Palette.textSecondary} />
                    <Text style={styles.sortText}>Tri : {SORT_META[sortKey].label}</Text>
                  </Pressable>

                  <Pressable style={styles.viewToggle} onPress={toggleViewMode} hitSlop={6}>
                    <Feather
                      name={viewMode === 'comfortable' ? 'list' : 'align-justify'}
                      size={17}
                      color={Palette.textPrimary}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aucun client trouvé</Text>
              <Text style={styles.emptySubtitle}>Essayez une autre recherche ou réinitialisez les filtres.</Text>
            </View>
          }
        />
      </SafeAreaView>

      <BottomNav activeIndex={2} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palette.screen,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  header: {
    paddingTop: Spacing.lg,
  },
  section: {
    marginTop: Spacing.section,
  },
  separator: {
    height: Spacing.md,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.section,
    marginBottom: Spacing.md,
  },
  count: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  toolbarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  sortText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  viewToggle: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: Palette.cardMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 6,
    textAlign: 'center',
  },
});
