import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { PhotoInterventionCard } from '@/components/documents/PhotoInterventionCard';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { PHOTO_INTERVENTIONS, photoStats } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export default function PhotosScreen() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return PHOTO_INTERVENTIONS;
    const q = search.trim().toLowerCase();
    return PHOTO_INTERVENTIONS.filter(
      (item) => item.title.toLowerCase().includes(q) || item.client.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScreenHeader title="Photos" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.searchBar}>
            <Feather name="search" size={18} color={Palette.textTertiary} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Rechercher une intervention, un client…"
              placeholderTextColor={Palette.textTertiary}
              style={styles.searchInput}
            />
          </View>

          <Text style={styles.summary}>
            {photoStats.interventions} interventions · {photoStats.totalPhotos} photos
          </Text>

          <View style={styles.list}>
            {filtered.length > 0 ? (
              filtered.map((intervention) => (
                <PhotoInterventionCard key={intervention.id} intervention={intervention} />
              ))
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Aucune intervention ne correspond à cette recherche.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 14,
    height: 48,
    ...cardShadow,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.label,
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    padding: 0,
  },
  summary: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  list: {
    gap: Spacing.md,
  },
  empty: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 28,
    alignItems: 'center',
    ...cardShadow,
  },
  emptyText: {
    fontSize: FontSize.label,
    color: Palette.textTertiary,
  },
});
