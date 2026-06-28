import { Feather } from '@expo/vector-icons';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
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
          <Feather name={icon} size={18} color={color} />
        </View>
        <Text
          style={styles.label}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}>
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

const TILE = 40;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  wrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.card,
    borderWidth: 1,
    borderColor: Palette.border,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
    ...actionShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FontSize.cardLabel,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginTop: 5,
    textAlign: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 4,
  },
});
