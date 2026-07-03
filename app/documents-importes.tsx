import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, FlatList, Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { IconTile, PressableScale } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { formatShortDate } from '@/data/documents/date-utils';
import { IMPORT_TYPE_META, ImportFileType, ImportedFile, MOCK_IMPORTS, formatFileSize } from '@/data/documents/imports';

function ImportRow({ file, onPress }: { file: ImportedFile; onPress: () => void }) {
  const meta = IMPORT_TYPE_META[file.type];
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.row} accessibilityLabel={file.name}>
      <IconTile icon={meta.icon} color={Palette.blue} soft={Palette.blueSoft} size={40} iconSize={18} />
      <View style={styles.rowInfo}>
        <Text style={styles.rowName} numberOfLines={1} ellipsizeMode="tail">
          {file.name}
        </Text>
        <Text style={styles.rowMeta} numberOfLines={1}>
          {formatShortDate(file.date)} · {formatFileSize(file.sizeKb)}
          {file.clientName ? ` · ${file.clientName}` : ''}
        </Text>
      </View>
      <Feather name="chevron-right" size={16} color={Palette.textTertiary} style={{ opacity: 0.7 }} />
    </PressableScale>
  );
}

function PreviewModal({ file, onClose }: { file: ImportedFile | null; onClose: () => void }) {
  if (!file) return null;
  const meta = IMPORT_TYPE_META[file.type];

  return (
    <Modal visible={!!file} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.previewBackdrop}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} accessibilityLabel="Fermer" />
        <View style={styles.previewCard}>
          <IconTile icon={meta.icon} color={Palette.blue} soft={Palette.blueSoft} size={56} iconSize={24} />
          <Text style={styles.previewName} numberOfLines={2}>
            {file.name}
          </Text>
          <Text style={styles.previewMeta}>
            {formatShortDate(file.date)} · {formatFileSize(file.sizeKb)}
          </Text>

          {file.type === 'image' ? (
            <Image source={{ uri: `https://picsum.photos/seed/${file.id}/500/300` }} style={styles.previewImage} contentFit="cover" />
          ) : (
            <Text style={styles.previewUnavailable}>Aperçu non disponible pour ce type de fichier.</Text>
          )}

          <View style={styles.previewActions}>
            <PressableScale
              onPress={() => Share.share({ message: file.name })}
              to={0.96}
              style={styles.previewButton}
              accessibilityLabel="Partager">
              <Feather name="share" size={16} color={Palette.white} />
              <Text style={styles.previewButtonText}>Partager</Text>
            </PressableScale>
            <PressableScale onPress={onClose} to={0.96} style={styles.previewCancel} accessibilityLabel="Fermer">
              <Text style={styles.previewCancelText}>Fermer</Text>
            </PressableScale>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function DocumentsImportesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [type, setType] = useState<ImportFileType | null>(null);
  const [preview, setPreview] = useState<ImportedFile | null>(null);

  const filtered = useMemo(() => {
    let list = MOCK_IMPORTS;
    if (type) list = list.filter((f) => f.type === type);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.clientName?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [type, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: MOCK_IMPORTS.length, color: Palette.blue },
    { key: 'pdf', label: 'PDF', count: MOCK_IMPORTS.filter((f) => f.type === 'pdf').length, color: Palette.blue },
    { key: 'image', label: 'Images', count: MOCK_IMPORTS.filter((f) => f.type === 'image').length, color: Palette.blue },
    { key: 'doc', label: 'Documents', count: MOCK_IMPORTS.filter((f) => f.type === 'doc').length, color: Palette.blue },
  ];

  const handleImport = () => {
    Alert.alert('Importer un document', 'Cette action sera bientôt disponible.');
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Documents importés" onBack={() => router.back()} onMenu={handleImport} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un fichier, un client…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips defs={chipDefs} activeKey={type} onSelect={(k) => setType(k as ImportFileType | null)} />
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(f) => f.id}
          renderItem={({ item }) => <ImportRow file={item} onPress={() => setPreview(item)} />}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <Text style={styles.count}>
              {filtered.length} document{filtered.length > 1 ? 's' : ''}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState icon="folder" title="Aucun document" subtitle="Aucun document ne correspond à votre recherche." />
          }
        />
      </SafeAreaView>

      <BottomNav activeIndex={3} />

      <PreviewModal file={preview} onClose={() => setPreview(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Palette.screen },
  safeArea: { flex: 1 },
  searchWrap: {
    paddingHorizontal: Spacing.screen,
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
    height: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 12,
    paddingHorizontal: 14,
    ...cardShadow,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  rowMeta: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  previewBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 41, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.screen,
  },
  previewCard: {
    width: '100%',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.lg + 2,
    alignItems: 'center',
  },
  previewName: {
    fontSize: FontSize.body,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    textAlign: 'center',
    marginTop: 14,
  },
  previewMeta: {
    fontSize: 12.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    marginTop: 16,
    backgroundColor: Palette.cardMuted,
  },
  previewUnavailable: {
    fontSize: 13,
    fontWeight: '400',
    color: Palette.textTertiary,
    textAlign: 'center',
    marginTop: 16,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  previewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 13,
  },
  previewButtonText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: '700',
  },
  previewCancel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.tile,
    paddingVertical: 13,
  },
  previewCancelText: {
    color: Palette.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
