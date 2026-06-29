import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

const NEXT_REMINDER = 'Facture à créer — M. Dupont';

export function RemindersCard() {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  // Two separate Animated.Values so each can use the right driver
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(1)).current;

  const dismiss = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heightAnim, {
        toValue: 0,
        duration: 340,
        delay: 60,
        useNativeDriver: false,
      }),
    ]).start(() => setDismissed(true));
  };

  if (dismissed) return null;

  const maxHeight = heightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 120],
  });

  return (
    <Animated.View style={{ maxHeight, overflow: 'hidden' }}>
      <Animated.View style={{ opacity: opacityAnim }}>
        <Pressable style={styles.card} onPress={() => router.push('/rappels')}>
          <View style={styles.iconTile}>
            <Ionicons name="notifications" size={19} color={Palette.purple} />
          </View>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={styles.eyebrow}>RAPPEL</Text>
              <View style={styles.seeAll}>
                <Text style={styles.seeAllText}>Voir tout</Text>
                <Feather name="chevron-right" size={13} color={Palette.blue} />
              </View>
            </View>

            <Text style={styles.reminder} numberOfLines={1} ellipsizeMode="tail">
              {NEXT_REMINDER}
            </Text>
          </View>

          <Pressable style={styles.doneButton} onPress={dismiss} hitSlop={12}>
            <Feather name="check" size={15} color={Palette.green} />
          </Pressable>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const TILE = 38;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 13,
    paddingHorizontal: 18,
    ...cardShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: 12,
    backgroundColor: Palette.purpleSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eyebrow: {
    fontSize: FontSize.tiny,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Palette.purple,
  },
  seeAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '500',
    color: Palette.blue,
  },
  reminder: {
    fontSize: FontSize.label,
    fontWeight: '500',
    color: Palette.textPrimary,
    marginTop: 4,
    letterSpacing: -0.1,
  },
  doneButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
    flexShrink: 0,
  },
});
