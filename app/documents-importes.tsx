import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, Animated, FlatList, Modal, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomDock } from '@/components/ui/BottomDock';
import { ClientPickerSheet } from '@/components/appointment/ClientPickerSheet';
import { type Client } from '@/components/clients/types';
import { DetailHeader } from '@/components/documents/shared/DetailHeader';
import { EmptyState } from '@/components/documents/shared/EmptyState';
import { ChipDef, FilterChips } from '@/components/documents/shared/FilterChips';
import { FadeInItem, IconTile, PressableScale } from '@/components/documents/shared/primitives';
import { SearchBar } from '@/components/documents/shared/SearchBar';
import { InterventionPickerSheet } from '@/components/documents/imports/InterventionPickerSheet';
import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';
import { formatShortDate } from '@/data/documents/date-utils';
import { IMPORT_TYPE_META, ImportFileType, ImportedFile, MOCK_IMPORTS, formatFileSize } from '@/data/documents/imports';
import { PhotoIntervention } from '@/data/documents/photos';

function ImportRow({
  file,
  onPress,
  onAssociateClient,
  onAssociateIntervention,
}: {
  file: ImportedFile;
  onPress: () => void;
  onAssociateClient: () => void;
  onAssociateIntervention: () => void;
}) {
  const meta = IMPORT_TYPE_META[file.type];
  const associationParts = [file.clientName, file.interventionLabel].filter(Boolean) as string[];

  const needsAssociation = !file.clientId || !file.interventionId;

  return (
    <View style={styles.row}>
      <PressableScale onPress={onPress} to={0.98} style={styles.rowPress} accessibilityLabel={file.name}>
        {file.type === 'image' ? (
          <Image source={{ uri: `https://picsum.photos/seed/${file.id}/200/200` }} style={styles.thumb} contentFit="cover" />
        ) : (
          <IconTile icon={meta.icon} color={meta.color} soft={meta.soft} size={36} iconSize={16} />
        )}
        <View style={styles.rowInfo}>
          <Text style={styles.rowName} numberOfLines={2} ellipsizeMode="tail">
            {file.name}
          </Text>
          <Text style={styles.rowMeta} numberOfLines={1}>
            <Text style={[styles.rowMetaType, { color: meta.color }]}>{meta.label}</Text>
            {'  ·  '}
            {formatFileSize(file.sizeKb)} · {formatShortDate(file.date)}
          </Text>
          {associationParts.length > 0 ? (
            <Text style={styles.rowAssociation} numberOfLines={1}>
              {associationParts.join(' · ')}
            </Text>
          ) : null}
        </View>
        <Feather name="chevron-right" size={16} color={Palette.textTertiary} style={{ opacity: 0.7 }} />
      </PressableScale>

      {needsAssociation ? (
        <View style={styles.associateRow}>
          {!file.clientId ? (
            <PressableScale
              onPress={onAssociateClient}
              to={0.94}
              style={styles.associateChip}
              accessibilityLabel="Associer à un client">
              <Feather name="user-plus" size={12} color={Palette.blue} />
              <Text style={styles.associateText}>Client</Text>
            </PressableScale>
          ) : null}
          {!file.interventionId ? (
            <PressableScale
              onPress={onAssociateIntervention}
              to={0.94}
              style={styles.associateChip}
              accessibilityLabel="Associer à une intervention">
              <Feather name="briefcase" size={12} color={Palette.blue} />
              <Text style={styles.associateText}>Intervention</Text>
            </PressableScale>
          ) : null}
        </View>
      ) : null}
    </View>
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
          <IconTile icon={meta.icon} color={meta.color} soft={meta.soft} size={56} iconSize={24} />
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
  const [files, setFiles] = useState<ImportedFile[]>(MOCK_IMPORTS);
  const [clientPickerFileId, setClientPickerFileId] = useState<string | null>(null);
  const [interventionPickerFileId, setInterventionPickerFileId] = useState<string | null>(null);
  const listOpacity = useRef(new Animated.Value(1)).current;

  const pulseList = () => {
    listOpacity.setValue(0.4);
    Animated.timing(listOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  };

  const filtered = useMemo(() => {
    let list = files;
    if (type) list = list.filter((f) => f.type === type);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q) || f.clientName?.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [files, type, search]);

  const chipDefs: ChipDef[] = [
    { key: 'all', label: 'Tous', count: files.length, color: Palette.blue },
    { key: 'pdf', label: 'PDF', count: files.filter((f) => f.type === 'pdf').length, color: Palette.red },
    { key: 'image', label: 'Images', count: files.filter((f) => f.type === 'image').length, color: Palette.blue },
    { key: 'doc', label: 'Documents', count: files.filter((f) => f.type === 'doc').length, color: Palette.purple },
  ];

  const handleImport = () => {
    Alert.alert('Importer un document', 'Cette action sera bientôt disponible.');
  };

  const handleSelectClient = (client: Client) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === clientPickerFileId ? { ...f, clientId: client.id, clientName: client.name } : f))
    );
  };

  const handleSelectIntervention = (intervention: PhotoIntervention) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === interventionPickerFileId ? { ...f, interventionId: intervention.id, interventionLabel: intervention.label } : f
      )
    );
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <DetailHeader title="Documents importés" onBack={() => router.back()} onMenu={handleImport} />

        <View style={styles.searchWrap}>
          <SearchBar value={search} onChangeText={setSearch} placeholder="Rechercher un fichier, un client…" />
        </View>

        <View style={styles.chipsWrap}>
          <FilterChips
            defs={chipDefs}
            activeKey={type}
            onSelect={(k) => {
              pulseList();
              setType(k as ImportFileType | null);
            }}
          />
        </View>

        <Animated.View style={{ flex: 1, opacity: listOpacity }}>
          <FlatList
            data={filtered}
            keyExtractor={(f) => f.id}
            renderItem={({ item, index }) => (
              <FadeInItem index={index}>
                <ImportRow
                  file={item}
                  onPress={() => setPreview(item)}
                  onAssociateClient={() => setClientPickerFileId(item.id)}
                  onAssociateIntervention={() => setInterventionPickerFileId(item.id)}
                />
              </FadeInItem>
            )}
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
        </Animated.View>
      </SafeAreaView>

      <BottomDock activeIndex={3} />

      <PreviewModal file={preview} onClose={() => setPreview(null)} />

      <ClientPickerSheet
        visible={!!clientPickerFileId}
        onClose={() => setClientPickerFileId(null)}
        onSelect={handleSelectClient}
      />

      <InterventionPickerSheet
        visible={!!interventionPickerFileId}
        onClose={() => setInterventionPickerFileId(null)}
        onSelect={handleSelectIntervention}
      />
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
    height: 8,
  },
  row: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 10,
    paddingHorizontal: 12,
    ...cardShadow,
  },
  rowPress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  thumb: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: Palette.cardMuted,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 14.5,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  rowMeta: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 3,
  },
  rowMetaType: {
    fontWeight: '700',
  },
  rowAssociation: {
    fontSize: 11.5,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 2,
    opacity: 0.85,
  },
  associateRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
  },
  associateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  associateText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
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
