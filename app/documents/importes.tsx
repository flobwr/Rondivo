import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BottomNav } from '@/components/home/bottom-nav';
import { ListToolbar } from '@/components/documents/ListToolbar';
import { PhotoPlaceholder } from '@/components/documents/PhotoPlaceholder';
import { ScreenHeader } from '@/components/documents/ScreenHeader';
import { IMPORTED_DOCS, ImportedDoc, ImportedDocKind } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const KIND_STYLE: Record<ImportedDocKind, { icon: React.ComponentProps<typeof Feather>['name']; color: string; background: string }> = {
  PDF: { icon: 'file-text', color: Palette.red, background: Palette.redSoft },
  Image: { icon: 'image', color: Palette.blue, background: Palette.blueSoft },
  Document: { icon: 'file', color: Palette.purple, background: Palette.purpleSoft },
};

type ChipKey = 'all' | ImportedDocKind;

const CHIP_ORDER: ChipKey[] = ['all', 'PDF', 'Image', 'Document'];
const CHIP_LABEL: Record<ChipKey, string> = {
  all: 'Tous',
  PDF: 'PDF',
  Image: 'Images',
  Document: 'Documents',
};

function DocRow({ doc }: { doc: ImportedDoc }) {
  const style = KIND_STYLE[doc.kind];
  const hasContext = Boolean(doc.client || doc.intervention);

  return (
    <View style={styles.card}>
      {doc.kind === 'Image' ? (
        <PhotoPlaceholder seed={doc.id} style={styles.thumb} iconSize={17} />
      ) : (
        <View style={[styles.iconTile, { backgroundColor: style.background }]}>
          <Feather name={style.icon} size={19} color={style.color} />
        </View>
      )}

      <View style={styles.rowContent}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {doc.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          <Text style={[styles.kindLabel, { color: style.color }]}>{doc.kind}</Text> · {doc.size} ·{' '}
          {doc.date}
        </Text>
        {hasContext ? (
          <Text style={styles.context} numberOfLines={1} ellipsizeMode="tail">
            {[doc.client, doc.intervention].filter(Boolean).join(' · ')}
          </Text>
        ) : null}
      </View>

      <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
    </View>
  );
}

export default function ImportedDocsScreen() {
  const [search, setSearch] = useState('');
  const [chip, setChip] = useState<ChipKey>('all');
  const [sortRecent, setSortRecent] = useState(true);

  const filtered = useMemo(() => {
    let list = IMPORTED_DOCS;
    if (chip !== 'all') list = list.filter((d) => d.kind === chip);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.client?.toLowerCase().includes(q) ||
          d.intervention?.toLowerCase().includes(q)
      );
    }
    return sortRecent ? list : [...list].reverse();
  }, [chip, search, sortRecent]);

  const chips = CHIP_ORDER.map((key) => ({
    key,
    label: CHIP_LABEL[key],
    count: key === 'all' ? IMPORTED_DOCS.length : IMPORTED_DOCS.filter((d) => d.kind === key).length,
  }));

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScreenHeader
          title="Documents importés"
          right={<Feather name="more-horizontal" size={19} color={Palette.textPrimary} />}
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ListToolbar
            searchPlaceholder="Rechercher un fichier, un client…"
            searchValue={search}
            onSearchChange={setSearch}
            chips={chips}
            selectedChip={chip}
            onSelectChip={(key) => setChip(key as ChipKey)}
            resultLabel={`${filtered.length} document${filtered.length > 1 ? 's' : ''}`}
            sortLabel={sortRecent ? 'Plus récents' : 'Plus anciens'}
            onToggleSort={() => setSortRecent((v) => !v)}
          />

          <View style={styles.list}>
            {filtered.length > 0 ? (
              filtered.map((doc) => <DocRow key={doc.id} doc={doc} />)
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>Aucun document ne correspond à ces critères.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      <BottomNav activeIndex={3} />
    </View>
  );
}

const TILE = 44;

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
  list: {
    gap: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
    ...cardShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  thumb: {
    width: TILE,
    height: TILE,
    borderRadius: 14,
    flexShrink: 0,
  },
  rowContent: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  meta: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
  },
  kindLabel: {
    fontWeight: '700',
  },
  context: {
    fontSize: FontSize.small,
    color: Palette.textSecondary,
    marginTop: 1,
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
