import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { SectionCard } from './SectionCard';

type Props = {
  address: string;
  travelMinutes: number;
  travelKm: number;
  onNavigate?: () => void;
};

export function AddressCard({ address, travelMinutes, travelKm, onNavigate }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const kmLabel = travelKm.toFixed(1).replace('.', ',');

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <SectionCard icon="map-pin" iconColor={Palette.blue} iconBackground={Palette.blueSoft} title="Adresse">
      <Text style={styles.address}>{address}</Text>

      <View style={styles.travelRow}>
        <View style={styles.travelInfo}>
          <Feather name="truck" size={13} color={Palette.textTertiary} />
          <Text style={styles.travelText}>
            {travelMinutes} min · {kmLabel} km
          </Text>
        </View>

        <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onNavigate} hitSlop={6}>
          <Animated.View style={[styles.navButton, { transform: [{ scale }] }]}>
            <Feather name="navigation" size={14} color={Palette.blue} />
            <Text style={styles.navButtonText}>Itinéraire</Text>
          </Animated.View>
        </Pressable>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  address: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  travelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
  },
  travelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  travelText: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Palette.blueSoft,
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  navButtonText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
