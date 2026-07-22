import { Feather } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { usePressScale } from '@/hooks/use-press-scale';

type Action = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  background: string;
};

const ACTIONS: Action[] = [
  { label: 'Devis', icon: 'file-plus', color: Palette.blue, background: Palette.blueSoft },
  { label: 'Client', icon: 'user-plus', color: Palette.orange, background: Palette.orangeSoft },
  { label: 'Notes', icon: 'message-square', color: Palette.purple, background: Palette.purpleSoft },
  { label: 'Tâches', icon: 'check-square', color: Palette.green, background: Palette.greenSoft },
];

function ActionCard({ label, icon, color, background }: Action) {
  const { scale, onPressIn, onPressOut } = usePressScale({
    to: 0.95,
    springIn: { friction: 5, tension: 300 },
    springOut: { friction: 4, tension: 100 },
  });

  return (
    <Pressable style={styles.wrapper} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.iconTile, { backgroundColor: background }]}>
          <Feather name={icon} size={ICON_SIZE} color={color} />
        </View>
        <Text style={styles.label} numberOfLines={2}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function QuickActions() {
  return (
    <View style={styles.row}>
      {ACTIONS.map((action) => (
        <ActionCard key={action.label} {...action} />
      ))}
    </View>
  );
}

const TILE = 36;
const TILE_RADIUS = 12;
const ICON_SIZE = 17;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  wrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: Palette.cardMuted,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 7,
    ...actionShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: TILE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
    lineHeight: 17,
    textAlign: 'center',
  },
});
