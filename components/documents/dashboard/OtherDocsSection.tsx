import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { IconTile } from '../IconTile';

type Row = {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  subtitle: string;
  onPress: () => void;
};

type Props = {
  rows: Row[];
};

export function OtherDocsSection({ rows }: Props) {
  return (
    <View>
      <Text style={styles.sectionLabel}>Autres documents</Text>
      <View style={styles.card}>
        {rows.map((row, index) => (
          <View key={row.title}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <Pressable style={styles.row} onPress={row.onPress}>
              <IconTile background={Palette.blueSoft}>
                <Feather name={row.icon} size={18} color={Palette.blue} />
              </IconTile>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                <Text style={styles.rowSubtitle}>{row.subtitle}</Text>
              </View>
              <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    color: Palette.textTertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  rowSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
});
