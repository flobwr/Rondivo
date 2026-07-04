import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ContextualFAB } from '@/components/documents/ContextualFAB';
import { DocumentHeader } from '@/components/documents/DocumentHeader';
import { FilterChips, type FilterChip } from '@/components/documents/FilterChips';
import { IMPORTED_DOCUMENTS } from '@/components/documents/mock-data';
import type { ImportedDocType, ImportedDocument } from '@/components/documents/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const FILE_ICONS: Record<ImportedDocType, { icon: React.ComponentProps<typeof Feather>['name']; color: string; bg: string }> = {
  pdf: { icon: 'file-text', color: '#DC2626', bg: '#FEE2E2' },
  image: { icon: 'image', color: Palette.blue, bg: Palette.blueSoft },
  word: { icon: 'file', color: '#2563EB', bg: '#DBEAFE' },
  excel: { icon: 'grid', color: '#059669', bg: '#D1FAE5' },
  other: { icon: 'file', color: Palette.textSecondary, bg: '#F3F4F6' },
};

const FILTERS: FilterChip[] = [
  { label: 'Tous', count: IMPORTED_DOCUMENTS.length },
  {
    label: 'PDF',
    count: IMPORTED_DOCUMENTS.filter((d) => d.type === 'pdf').length,
    dotColor: '#DC2626',
  },
  {
    label: 'Images',
    count: IMPORTED_DOCUMENTS.filter((d) => d.type === 'image').length,
    dotColor: Palette.blue,
  },
  {
    label: 'Documents',
    count: IMPORTED_DOCUMENTS.filter((d) => d.type === 'word' || d.type === 'excel').length,
    dotColor: '#2563EB',
  },
];

function DocumentCard({ doc }: { doc: ImportedDocument }) {
  const fileConfig = FILE_ICONS[doc.type];
  const isImage = doc.type === 'image';

  return (
    <Pressable
      style={styles.card}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }}>
      <View style={styles.cardContent}>
        {isImage ? (
          <View style={styles.imageThumb}>
            <Feather name="image" size={24} color={Palette.textTertiary} />
          </View>
        ) : (
          <View style={[styles.fileIcon, { backgroundColor: fileConfig.bg }]}>
            <Feather name={fileConfig.icon} size={20} color={fileConfig.color} />
          </View>
        )}
        <View style={styles.docInfo}>
          <Text style={styles.docName} numberOfLines={1}>
            {doc.name}
          </Text>
          <Text style={styles.docMeta}>
            {doc.date} · {doc.size}
            {doc.client ? ` · ${doc.client}` : ''}
          </Text>
          {doc.linkedTo ? (
            <View style={styles.linkTag}>
              <Feather name="link" size={10} color={Palette.blue} />
              <Text style={styles.linkText}>{doc.linkedTo}</Text>
            </View>
          ) : !doc.client ? (
            <Pressable
              style={styles.associateButton}
              hitSlop={4}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}>
              <Feather name="link" size={10} color={Palette.blue} />
              <Text style={styles.associateText}>Associer</Text>
            </Pressable>
          ) : null}
        </View>
        <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
      </View>
    </Pressable>
  );
}

export default function DocumentsImportesScreen() {
  const [filterIndex, setFilterIndex] = useState(0);

  const filterType = ['all', 'pdf', 'image', 'doc'][filterIndex];
  const filtered =
    filterType === 'all'
      ? IMPORTED_DOCUMENTS
      : filterType === 'doc'
        ? IMPORTED_DOCUMENTS.filter(
            (d) => d.type === 'word' || d.type === 'excel',
          )
        : IMPORTED_DOCUMENTS.filter((d) => d.type === filterType);

  const handleFilterChange = useCallback((index: number) => {
    setFilterIndex(index);
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DocumentHeader title="Documents importés" />

        <FilterChips
          chips={FILTERS}
          selectedIndex={filterIndex}
          onSelect={handleFilterChange}
        />

        <View style={styles.listHeader}>
          <Text style={styles.listCount}>{filtered.length} documents</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}>
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </ScrollView>
      </SafeAreaView>

      <ContextualFAB label="Importer un fichier" icon="upload" />
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
  listHeader: {
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  listCount: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  scroll: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 100,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageThumb: {
    width: 44,
    height: 44,
    borderRadius: Radius.tile,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  docName: {
    fontSize: FontSize.cardLabel,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
  docMeta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  linkTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  linkText: {
    fontSize: FontSize.tiny,
    color: Palette.blue,
    fontWeight: '500',
  },
  associateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 999,
    backgroundColor: Palette.blueSoft,
  },
  associateText: {
    fontSize: FontSize.tiny,
    color: Palette.blue,
    fontWeight: '500',
  },
});
