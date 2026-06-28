import { Feather } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

type Action = {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  background: string;
};

const ACTIONS: Action[] = [
  { label: 'Devis', icon: 'file-text', color: Palette.blue, background: Palette.blueSoft },
  { label: 'Factures', icon: 'file-text', color: Palette.orange, background: Palette.orangeSoft },
  { label: 'Notes', icon: 'message-square', color: Palette.purple, background: Palette.purpleSoft },
  { label: 'Tâches', icon: 'check', color: Palette.green, background: Palette.greenSoft },
];

function ActionCard({ label, icon, color, background }: Action) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.timing(scale, { toValue: 0.98, duration: 120, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.timing(scale, { toValue: 1, duration: 160, useNativeDriver: true }).start();

  return (
    <Pressable style={styles.wrapper} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.iconTile, { backgroundColor: background }]}>
          <Feather name={icon} size={ICON_SIZE} color={color} />
        </View>
        <Text
          style={styles.label}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.9}>
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

// 30px tile = ~25% smaller than original 40px — compact, proportioned
const TILE = 30;
const TILE_RADIUS = 10;
const ICON_SIZE = 14;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    // 10px gap slightly widens each card vs previous 12px
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
    // paddingVertical perfectly symmetric — icon and label equidistant from edges
    paddingVertical: 8,
    alignItems: 'center',
    // gap separates tile from label with a touch more air than before (7 vs 6)
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
    fontSize: 16,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 19,
    textAlign: 'center',
    paddingHorizontal: 3,
  },
});
