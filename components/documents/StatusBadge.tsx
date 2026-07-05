import { StyleSheet, Text, View } from 'react-native';

import { Palette, Radius } from '@/constants/design';

export type BadgeTone = 'neutral' | 'blue' | 'red' | 'amber' | 'green' | 'purple';

const TONE_COLORS: Record<BadgeTone, { fg: string; bg: string }> = {
  neutral: { fg: Palette.textSecondary, bg: '#EEF0F3' },
  blue: { fg: Palette.blue, bg: Palette.blueSoft },
  red: { fg: Palette.red, bg: Palette.redSoft },
  amber: { fg: '#9A6B14', bg: Palette.orangeSoft },
  green: { fg: '#128A5E', bg: Palette.greenSoft },
  purple: { fg: Palette.purple, bg: Palette.purpleSoft },
};

type Props = {
  label: string;
  tone: BadgeTone;
};

export function StatusBadge({ label, tone }: Props) {
  const colors = TONE_COLORS[tone];
  return (
    <View style={[styles.pill, { backgroundColor: colors.bg }]}>
      <View style={[styles.dot, { backgroundColor: colors.fg }]} />
      <Text style={[styles.label, { color: colors.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
});
