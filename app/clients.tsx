import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ClientCard } from '@/components/clients/ClientCard';
import { ClientFilterChips } from '@/components/clients/ClientFilterChips';
import { ClientFilterSheet } from '@/components/clients/ClientFilterSheet';
import { ClientHeader } from '@/components/clients/ClientHeader';
import { ClientListSkeleton } from '@/components/clients/ClientCardSkeleton';
import { ClientsEmptyState, ClientsErrorState, type EmptyMode } from '@/components/clients/ClientListStates';
import { ClientSearch } from '@/components/clients/ClientSearch';
import {
  type Client,
  type ClientStatus,
  type SortKey,
  type ViewMode,
} from '@/components/clients/types';
import { Palette, Spacing } from '@/constants/design';
import { countByStatus } from '@/data/clients';
import { useClients } from '@/hooks/use-clients';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePersistentState } from '@/hooks/use-persistent-state';

export default function ClientsScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<ClientStatus[]>([]);
  // Sort + view are remembered across visits within the session.
  const [sortKey, setSortKey] = usePersistentState<SortKey>('clients.sort', 'priority');
  const [viewMode, setViewMode] = usePersistentState<ViewMode>('clients.view', 'comfortable');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The input stays instant; the query (and thus the fetch) settles after typing.
  const debouncedSearch = useDebouncedValue(searchQuery, 280);
  const query = useMemo(
    () => ({ search: debouncedSearch, statuses: selectedStatuses, sort: sortKey }),
    [debouncedSearch, selectedStatuses, sortKey]
  );

  const {
    clients,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    error,
    total,
    refresh,
    loadMore,
    retry,
  } = useClients(query);

  // Chip counts reflect the whole dataset, independent of the active filters.
  const counts = useMemo(() => countByStatus(), []);
  const allCount = useMemo(
    () => Object.values(counts).reduce((sum, n) => sum + n, 0),
    [counts]
  );

  const toggleStatus = useCallback((status: ClientStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  }, []);

  // Chips are single-select quick shortcuts: pick one status, or "Tous" clears.
  const handleChipSelect = useCallback((status: ClientStatus | null) => {
    setSelectedStatuses(status ? [status] : []);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSortKey('priority');
    setSearchQuery('');
  }, [setSortKey]);

  const toggleViewMode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setViewMode((prev) => (prev === 'comfortable' ? 'compact' : 'comfortable'));
  }, [setViewMode]);

  const handleAddPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Creation flow not built yet — the button is wired and ready for it.
    Alert.alert('Nouveau client', 'Le formulaire de création arrive bientôt.');
  }, []);

  const handleOpenClient = useCallback(
    (client: Client) => {
      router.push(`/client/${client.id}`);
    },
    [router]
  );

  const handleCall = useCallback((client: Client) => {
    Linking.openURL(`tel:${client.phone.replace(/\s+/g, '')}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Client }) => (
      <ClientCard client={item} variant={viewMode} onPress={handleOpenClient} onCall={handleCall} />
    ),
    [viewMode, handleOpenClient, handleCall]
  );

  const filtersActive = selectedStatuses.length > 0 || sortKey !== 'priority';
  const activeStatus: ClientStatus | null =
    selectedStatuses.length === 1 ? selectedStatuses[0] : null;

  // Premium micro-interaction: cross-fade the list when the filter/sort changes.
  const listFade = useRef(new Animated.Value(1)).current;
  const filterSignature = `${selectedStatuses.join(',')}|${sortKey}`;
  useEffect(() => {
    listFade.setValue(0.35);
    Animated.timing(listFade, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [filterSignature, listFade]);

  const emptyMode: EmptyMode =
    searchQuery.length > 0 ? 'no-results' : selectedStatuses.length > 0 ? 'no-filter-match' : 'no-clients';

  const listHeader = (
    <View>
      <View style={styles.chipsWrap}>
        <ClientFilterChips
          counts={counts}
          total={allCount}
          activeStatus={activeStatus}
          onSelect={handleChipSelect}
        />
      </View>

      <View style={styles.toolbar}>
        <Text style={styles.count}>
          {isInitialLoading ? 'Chargement…' : `${total} client${total > 1 ? 's' : ''}`}
        </Text>

        <Pressable
          style={styles.viewToggle}
          onPress={toggleViewMode}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={viewMode === 'comfortable' ? 'Vue compacte' : 'Vue détaillée'}>
          <Feather name={viewMode === 'comfortable' ? 'list' : 'grid'} size={17} color={Palette.textPrimary} />
        </Pressable>
      </View>
    </View>
  );

  const listEmpty = isInitialLoading ? (
    <ClientListSkeleton />
  ) : error ? (
    <ClientsErrorState onRetry={retry} />
  ) : (
    <ClientsEmptyState mode={emptyMode} onReset={resetFilters} />
  );

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        {/* Fixed — keeps the search field focused while typing */}
        <View style={styles.fixedHeader}>
          <ClientHeader onAddPress={handleAddPress} />
          <View style={styles.searchWrap}>
            <ClientSearch
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFilterPress={() => setFiltersOpen(true)}
              filtersActive={filtersActive}
            />
          </View>
        </View>

        <Animated.View style={[styles.flex, { opacity: listFade }]}>
          <FlatList
            data={clients}
            keyExtractor={(client) => client.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
            ListHeaderComponent={listHeader}
            ListEmptyComponent={listEmpty}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={9}
            removeClippedSubviews
            onEndReachedThreshold={0.4}
            onEndReached={loadMore}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={refresh}
                tintColor={Palette.blue}
                colors={[Palette.blue]}
              />
            }
            ListFooterComponent={
              isLoadingMore ? (
                <View style={styles.footerLoader}>
                  <ActivityIndicator color={Palette.blue} />
                </View>
              ) : null
            }
          />
        </Animated.View>
      </SafeAreaView>

      <BottomNav activeIndex={2} />

      <ClientFilterSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        selectedStatuses={selectedStatuses}
        onToggleStatus={toggleStatus}
        sortKey={sortKey}
        onChangeSort={setSortKey}
        onReset={resetFilters}
        resultCount={total}
      />
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
  flex: {
    flex: 1,
  },
  fixedHeader: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  searchWrap: {
    marginTop: Spacing.lg,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
    flexGrow: 1,
  },
  chipsWrap: {
    // Full-bleed so the chips can scroll edge to edge, cancelling the list padding.
    marginHorizontal: -Spacing.screen,
    marginBottom: Spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  count: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  viewToggle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Palette.cardMuted,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 10,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
