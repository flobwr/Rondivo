import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SEARCH_RESULTS_DUPONT } from '@/components/documents/mock-data';
import type { SearchResult, SearchResultType } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const TYPE_CONFIG: Record<
  SearchResultType,
  { icon: React.ComponentProps<typeof Feather>['name']; color: string; bg: string; label: string }
> = {
  client: { icon: 'user', color: Palette.blue, bg: Palette.blueSoft, label: 'Client' },
  invoice: { icon: 'file-text', color: Palette.orange, bg: Palette.orangeSoft, label: 'Facture' },
  quote: { icon: 'edit-3', color: Palette.blue, bg: Palette.blueSoft, label: 'Devis' },
  report: { icon: 'clipboard', color: Palette.green, bg: Palette.greenSoft, label: 'Rapport' },
  contract: { icon: 'briefcase', color: Palette.purple, bg: Palette.purpleSoft, label: 'Contrat' },
  importedDoc: { icon: 'folder', color: Palette.textSecondary, bg: '#F3F4F6', label: 'Document' },
  photo: { icon: 'camera', color: Palette.blue, bg: Palette.blueSoft, label: 'Photo' },
  intervention: { icon: 'tool', color: Palette.orange, bg: Palette.orangeSoft, label: 'Intervention' },
};

const RECENT_SEARCHES = ['Julie Fontaine', 'FA-2026', 'chaudière'];

const SUGGESTIONS = [
  'Factures impayées',
  'Devis en attente',
  'Rapports à terminer',
  'Contrats actifs',
];

function SearchResultRow({ result }: { result: SearchResult }) {
  const config = TYPE_CONFIG[result.type];

  return (
    <Pressable
      style={styles.resultRow}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}>
      <View style={[styles.resultIcon, { backgroundColor: config.bg }]}>
        <Feather name={config.icon} size={16} color={config.color} />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {result.title}
        </Text>
        <Text style={styles.resultSubtitle} numberOfLines={1}>
          {result.subtitle}
        </Text>
      </View>
      <View style={styles.typeBadge}>
        <Text style={[styles.typeLabel, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    </Pressable>
  );
}

export default function DocumentsSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const fadeIn = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  const hasResults = query.toLowerCase().includes('dupont');
  const results = hasResults ? SEARCH_RESULTS_DUPONT : [];

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [fadeIn]);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <Animated.View style={[styles.flex, { opacity: fadeIn }]}>
          <View style={styles.searchHeader}>
            <View style={styles.searchBar}>
              <Feather name="search" size={18} color={Palette.textTertiary} />
              <TextInput
                ref={inputRef}
                style={styles.searchInput}
                placeholder="Rechercher un document, un client..."
                placeholderTextColor={Palette.textTertiary}
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                autoCorrect={false}
              />
              {query.length > 0 ? (
                <Pressable hitSlop={8} onPress={handleClear}>
                  <Feather name="x" size={18} color={Palette.textTertiary} />
                </Pressable>
              ) : null}
            </View>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled">
            {query.length === 0 ? (
              <>
                {RECENT_SEARCHES.length > 0 ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recherches récentes</Text>
                    {RECENT_SEARCHES.map((search) => (
                      <Pressable
                        key={search}
                        style={styles.recentRow}
                        onPress={() => setQuery(search)}>
                        <Feather
                          name="clock"
                          size={16}
                          color={Palette.textTertiary}
                        />
                        <Text style={styles.recentText}>{search}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Suggestions</Text>
                  <View style={styles.suggestionsGrid}>
                    {SUGGESTIONS.map((s) => (
                      <Pressable
                        key={s}
                        style={styles.suggestionChip}
                        onPress={() => setQuery(s)}>
                        <Text style={styles.suggestionText}>{s}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </>
            ) : results.length > 0 ? (
              <View style={styles.resultsCard}>
                <Text style={styles.resultsCount}>
                  {results.length} résultats pour « {query} »
                </Text>
                {results.map((result, index) => (
                  <View key={result.id}>
                    {index > 0 ? <View style={styles.separator} /> : null}
                    <SearchResultRow result={result} />
                  </View>
                ))}
              </View>
            ) : query.length >= 2 ? (
              <View style={styles.emptyResults}>
                <Feather
                  name="search"
                  size={48}
                  color={Palette.textTertiary}
                />
                <Text style={styles.emptyTitle}>Aucun résultat</Text>
                <Text style={styles.emptySubtitle}>
                  Essayez un autre terme de recherche
                </Text>
              </View>
            ) : null}
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.body,
    color: Palette.textPrimary,
    padding: 0,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: FontSize.body,
    color: Palette.blue,
    fontWeight: '500',
  },
  scroll: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: Spacing.section,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textSecondary,
    marginBottom: Spacing.md,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  recentText: {
    fontSize: FontSize.body,
    color: Palette.textPrimary,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  suggestionChip: {
    backgroundColor: Palette.blueSoft,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.pill,
  },
  suggestionText: {
    fontSize: FontSize.label,
    color: Palette.blue,
    fontWeight: '500',
  },
  resultsCard: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.md,
    ...cardShadow,
  },
  resultsCount: {
    fontSize: FontSize.small,
    color: Palette.textSecondary,
    marginBottom: Spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  resultIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  resultTitle: {
    fontSize: FontSize.cardLabel,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  resultSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  typeLabel: {
    fontSize: FontSize.tiny,
    fontWeight: '600',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  emptyResults: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
  },
});
