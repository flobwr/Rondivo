import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { PressableScale } from '@/components/ui/PressableScale';
import { FontSize, Palette, Radius } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { DocumentItem, DocumentStatus } from './types';

const STATUS_COLOR: Record<DocumentStatus, { color: string; background: string }> = {
  disponible: { color: Palette.green, background: Palette.greenSoft },
  aFaire: { color: Palette.orange, background: Palette.orangeSoft },
  aEnvoyer: { color: Palette.blue, background: Palette.blueSoft },
};

type Props = {
  documents: DocumentItem[];
  onPressDocument?: (document: DocumentItem) => void;
};

export function DocumentsCard({ documents, onPressDocument }: Props) {
  return (
    <SectionCard>
      <View>
        {documents.map((doc, index) => {
          const s = STATUS_COLOR[doc.status];
          return (
            <View key={doc.id}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <PressableScale onPress={() => onPressDocument?.(doc)} to={0.98} style={styles.row}>
                <View style={styles.iconTile}>
                  <Feather name={doc.icon} size={16} color={Palette.textSecondary} />
                </View>
                <View style={styles.info}>
                  <Text style={styles.label} numberOfLines={1}>
                    {doc.label}
                  </Text>
                  <Text style={styles.detail} numberOfLines={2}>
                    {doc.detail}
                  </Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: s.background }]}>
                  <Text style={[styles.statusText, { color: s.color }]} numberOfLines={1}>
                    {doc.statusLabel}
                  </Text>
                </View>
                <Feather name="chevron-right" size={16} color={Palette.textTertiary} />
              </PressableScale>
            </View>
          );
        })}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    gap: 10,
  },
  iconTile: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: Palette.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  detail: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  statusPill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
