import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { IconTile } from '../IconTile';

export type CategoryStat = {
  text: string;
  tone: 'red' | 'amber' | 'grey';
};

type Props = {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  stats: CategoryStat[];
  onPress: () => void;
};

const TONE_COLOR: Record<CategoryStat['tone'], string> = {
  red: Palette.red,
  amber: '#B7791F',
  grey: Palette.textTertiary,
};

export function CategoryCard({ icon, title, stats, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <IconTile background={Palette.blueSoft} size={44}>
        <Feather name={icon} size={20} color={Palette.blue} />
      </IconTile>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statRow}>
            {stat.tone !== 'grey' ? (
              <View style={[styles.dot, { backgroundColor: TONE_COLOR[stat.tone] }]} />
            ) : null}
            <Text
              style={[styles.statText, { color: TONE_COLOR[stat.tone] }]}
              numberOfLines={1}
              ellipsizeMode="tail">
              {stat.text}
            </Text>
          </View>
        ))}
      </View>

      <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
  content: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: FontSize.section,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
