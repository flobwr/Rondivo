import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

type Props = {
  message: string;
  type?: 'warning' | 'info';
};

export function RondivoInsight({ message, type = 'warning' }: Props) {
  const isWarning = type === 'warning';
  const color = isWarning ? '#B45309' : Palette.blue;
  const bg = isWarning ? '#FFFBEB' : '#F0F4FF';

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <Feather
        name={isWarning ? 'alert-circle' : 'info'}
        size={14}
        color={color}
      />
      <Text style={[styles.text, { color }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.tile,
    gap: 6,
    marginTop: 6,
  },
  text: {
    fontSize: FontSize.tiny,
    fontWeight: '500',
    flex: 1,
  },
});
