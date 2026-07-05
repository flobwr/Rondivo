import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ActionItem } from '@/constants/documents-data';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { IconTile } from '../IconTile';

const ICONS: Record<ActionItem['icon'], React.ComponentProps<typeof Feather>['name']> = {
  invoice: 'file-text',
  quote: 'edit-3',
  report: 'clipboard',
  contract: 'briefcase',
};

const TONE_COLORS: Record<ActionItem['tone'], { fg: string; bg: string }> = {
  red: { fg: Palette.red, bg: Palette.redSoft },
  amber: { fg: '#B7791F', bg: Palette.orangeSoft },
};

type Props = {
  items: ActionItem[];
};

export function TodoCard({ items }: Props) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>À traiter</Text>
        <Text style={styles.subtitle}>{items.length} actions aujourd’hui</Text>
      </View>

      {items.map((item, index) => {
        const tone = TONE_COLORS[item.tone];
        return (
          <View key={item.id}>
            {index === 0 ? <View style={styles.headerSeparator} /> : <View style={styles.separator} />}
            <Pressable
              style={styles.row}
              onPress={() => router.push({ pathname: item.route as never, params: item.params })}>
              <IconTile background={tone.bg}>
                <Feather name={ICONS[item.icon]} size={18} color={tone.fg} />
              </IconTile>
              <Text style={styles.rowTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    ...cardShadow,
  },
  header: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  headerSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginTop: Spacing.md,
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
  rowTitle: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    lineHeight: 19,
  },
});
