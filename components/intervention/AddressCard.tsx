import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { createThemedStyles, FontSize, Palette, Radius, Spacing } from '@/theme';
import { SectionCard } from './SectionCard';

type Props = {
  address: string;
  travelMinutes: number;
  travelKm: number;
  onNavigate?: () => void;
};

function useMiniPress() {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };
  return { scale, onPressIn, onPressOut };
}

export function AddressCard({ address, travelMinutes, travelKm, onNavigate }: Props) {
  const [copied, setCopied] = useState(false);
  const copyPress = useMiniPress();
  const navPress = useMiniPress();
  const kmLabel = travelKm.toFixed(1).replace('.', ',');

  const handleCopy = async () => {
    await Clipboard.setStringAsync(address);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
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

        <View style={styles.actions}>
          <Pressable
            onPressIn={copyPress.onPressIn}
            onPressOut={copyPress.onPressOut}
            onPress={handleCopy}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={copied ? 'Adresse copiée' : 'Copier l’adresse'}>
            <Animated.View style={[styles.iconButton, { transform: [{ scale: copyPress.scale }] }]}>
              <Feather name={copied ? 'check' : 'copy'} size={15} color={Palette.blue} />
            </Animated.View>
          </Pressable>

          <Pressable onPressIn={navPress.onPressIn} onPressOut={navPress.onPressOut} onPress={onNavigate} hitSlop={6}>
            <Animated.View style={[styles.navButton, { transform: [{ scale: navPress.scale }] }]}>
              <Feather name="navigation" size={14} color={Palette.blue} />
              <Text style={styles.navButtonText}>Itinéraire</Text>
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </SectionCard>
  );
}

const styles = createThemedStyles(() => StyleSheet.create({
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
}));
