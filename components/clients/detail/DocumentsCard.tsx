import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette } from '@/constants/design';
import { type ClientDocument } from '@/data/client-details';
import { PressableScale, SectionCard, TintIcon } from './primitives';

type Props = {
  documents: ClientDocument[];
  onOpenDocument: (document: ClientDocument) => void;
  onSeeAll: () => void;
  limit?: number;
};

function DocumentRow({ document, onPress }: { document: ClientDocument; onPress: () => void }) {
  return (
    <PressableScale onPress={onPress} to={0.98} style={styles.row} accessibilityLabel={document.name}>
      <TintIcon icon={document.icon} tint={document.tint} size={40} iconSize={17} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {document.name}
        </Text>
        <Text style={styles.meta}>
          {document.kind} • {document.size}
        </Text>
      </View>
      <Feather name="download" size={17} color={Palette.textTertiary} />
    </PressableScale>
  );
}

export function DocumentsCard({ documents, onOpenDocument, onSeeAll, limit = 3 }: Props) {
  return (
    <SectionCard
      icon="paperclip"
      iconTint="blue"
      title="Documents"
      footerLabel="Voir tous les documents"
      onFooterPress={onSeeAll}>
      {documents.slice(0, limit).map((document, index) => (
        <View key={document.id}>
          {index > 0 ? <View style={styles.separator} /> : null}
          <DocumentRow document={document} onPress={() => onOpenDocument(document)} />
        </View>
      ))}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  meta: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginVertical: 2,
  },
});
