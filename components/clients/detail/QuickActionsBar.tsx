import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { type FeatherIconName, type Tint } from '@/components/clients/types';
import { Palette } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';

type Action = {
  key: string;
  icon: FeatherIconName;
  label: string;
  color: string;
  background: string;
  onPress: () => void;
};

type Props = {
  onCall: () => void;
  onMessage: () => void;
  onNewIntervention: () => void;
  onNewQuote: () => void;
  onNewInvoice: () => void;
};

const TILE = 36;
const TILE_RADIUS = 12;
const ICON_SIZE = 17;

// Same DNA as the Home quick actions: cardMuted tile, hairline border,
// colored soft icon chip, identical press spring + haptic.
function ActionCard({ icon, label, color, background, onPress }: Omit<Action, 'key'>) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 100 }).start();
  };

  return (
    <Pressable style={styles.wrapper} onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} accessibilityRole="button" accessibilityLabel={label}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.iconTile, { backgroundColor: background }]}>
          <Feather name={icon} size={ICON_SIZE} color={color} />
        </View>
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const TINTS: Record<Tint, { color: string; background: string }> = {
  blue: { color: Palette.blue, background: Palette.blueSoft },
  orange: { color: Palette.orange, background: Palette.orangeSoft },
  purple: { color: Palette.purple, background: Palette.purpleSoft },
  green: { color: Palette.green, background: Palette.greenSoft },
  red: { color: Palette.red, background: Palette.redSoft },
};

export function QuickActionsBar({ onCall, onMessage, onNewIntervention, onNewQuote, onNewInvoice }: Props) {
  const actions: Action[] = [
    { key: 'call', icon: 'phone', label: 'Appeler', ...TINTS.green, onPress: onCall },
    { key: 'msg', icon: 'message-square', label: 'Message', ...TINTS.blue, onPress: onMessage },
    { key: 'inter', icon: 'calendar', label: 'Intervention', ...TINTS.purple, onPress: onNewIntervention },
    { key: 'quote', icon: 'file-text', label: 'Devis', ...TINTS.orange, onPress: onNewQuote },
    { key: 'invoice', icon: 'credit-card', label: 'Facture', ...TINTS.blue, onPress: onNewInvoice },
  ];

  return (
    <View style={styles.row}>
      {actions.map(({ key, ...action }) => (
        <ActionCard key={key} {...action} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
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
    paddingHorizontal: 2,
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
    fontSize: 11.5,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 15,
    textAlign: 'center',
  },
});
