import { Feather } from '@expo/vector-icons';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/documents/shared/EmptyState';
import { IconTile, PressableScale } from '@/components/documents/shared/primitives';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow, iconButtonShadow } from '@/constants/shadow';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { usePersistentState } from '@/hooks/use-persistent-state';
import { SEARCH_TYPE_ICON, SEARCH_TYPE_LABEL, SearchResult, SearchResultType, searchAll } from '@/data/documents/search';

const RESULT_ORDER: SearchResultType[] = ['client', 'facture', 'devis', 'rapport', 'contrat', 'photo', 'import'];
const MAX_RECENT = 5;

function ResultRow({ result, onPress }: { result: SearchResult; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.resultRow} accessibilityLabel={result.title}>
      <IconTile icon={SEARCH_TYPE_ICON[result.type]} color={Palette.blue} soft={Palette.blueSoft} size={34} iconSize={15} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={1} ellipsizeMode="tail">
          {result.title}
        </Text>
        <Text style={styles.resultSubtitle} numberOfLines={1} ellipsizeMode="tail">
          {result.subtitle}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={Palette.textTertiary} style={{ opacity: 0.7 }} />
    </PressableScale>
  );
}

export default function DocumentsSearchScreen() {
  const router = useRouter();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 200);
  const [recent, setRecent] = usePersistentState<string[]>('documents-search-recent', []);

  const results = useMemo(() => searchAll(debouncedQuery), [debouncedQuery]);

  const grouped = useMemo(() => {
    return RESULT_ORDER.map((type) => ({ type, items: results.filter((r) => r.type === type) })).filter(
      (g) => g.items.length > 0
    );
  }, [results]);

  const rememberQuery = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setRecent((prev) => [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT));
  };

  const handleOpenResult = (result: SearchResult) => {
    rememberQuery(query);
    router.push(result.route as never);
  };

  const handleRecentPress = (value: string) => {
    setQuery(value);
    inputRef.current?.focus();
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <View style={styles.header}>
          <PressableScale onPress={() => router.back()} to={0.9} style={styles.backButton} accessibilityLabel="Retour">
            <Feather name="chevron-left" size={24} color={Palette.textPrimary} />
          </PressableScale>

          <View style={styles.searchBox}>
            <Feather name="search" size={18} color={Palette.textTertiary} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder="Client, facture, devis, intervention…"
              placeholderTextColor={Palette.textTertiary}
              style={styles.input}
              autoFocus
              returnKeyType="search"
              clearButtonMode="while-editing"
              onSubmitEditing={() => rememberQuery(query)}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {query.trim() === '' ? (
            <>
              {recent.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>Recherches récentes</Text>
                  <View style={styles.recentList}>
                    {recent.map((value) => (
                      <PressableScale
                        key={value}
                        onPress={() => handleRecentPress(value)}
                        to={0.97}
                        style={styles.recentChip}
                        accessibilityLabel={value}>
                        <Feather name="clock" size={13} color={Palette.textTertiary} />
                        <Text style={styles.recentText}>{value}</Text>
                      </PressableScale>
                    ))}
                  </View>
                </View>
              ) : null}

              <EmptyState
                icon="search"
                title="Recherche globale"
                subtitle="Tapez un nom de client, un numéro de facture ou de devis, une intervention…"
              />
            </>
          ) : grouped.length === 0 ? (
            <EmptyState icon="search" title="Aucun résultat" subtitle={`Rien ne correspond à « ${query.trim()} ».`} />
          ) : (
            grouped.map((group) => (
              <View key={group.type} style={styles.section}>
                <Text style={styles.sectionLabel}>{SEARCH_TYPE_LABEL[group.type]}</Text>
                <View style={styles.resultsCard}>
                  {group.items.map((result, index) => (
                    <View key={result.id}>
                      {index > 0 ? <View style={styles.separator} /> : null}
                      <ResultRow result={result} onPress={() => handleOpenResult(result)} />
                    </View>
                  ))}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: Spacing.screen,
    paddingTop: 6,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: Palette.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...iconButtonShadow,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: Spacing.lg,
    height: 46,
    gap: 10,
    ...cardShadow,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    padding: 0,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 2,
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.card,
    borderRadius: Radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  recentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  resultsCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  resultSubtitle: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
});
