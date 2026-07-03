import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { DocumentModule } from './types';

const TILE = 48;

export function ModuleCard({
  module,
  index,
  onPress,
}: {
  module: DocumentModule;
  index: number;
  onPress?: () => void;
}) {
  const enter = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(enter, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 70,
      delay: index * 45,
    }).start();
  }, [enter, index]);

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.985, useNativeDriver: true, friction: 7, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  const tint = module.highlight?.tone === 'red' ? Palette.notification : Palette.orange;

  return (
    <Animated.View style={{ opacity: enter, transform: [{ translateY }] }}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Animated.View style={[styles.card, { transform: [{ scale: pressScale }] }]}>
          <View style={styles.iconTile}>
            <Feather name={module.icon} size={21} color={Palette.blue} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {module.title}
            </Text>
            <Text style={styles.count} numberOfLines={1} ellipsizeMode="tail">
              {module.count} {module.unit}
            </Text>

            {module.highlight ? (
              <View style={styles.highlightRow}>
                <View style={[styles.dot, { backgroundColor: tint }]} />
                <Text style={[styles.highlightText, { color: tint }]} numberOfLines={1} ellipsizeMode="tail">
                  {module.highlight.text}
                </Text>
              </View>
            ) : null}

            {module.secondary ? (
              <Text style={styles.secondary} numberOfLines={1} ellipsizeMode="tail">
                {module.secondary}
              </Text>
            ) : null}
          </View>

          <Feather name="chevron-right" size={20} color={Palette.textTertiary} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 16,
    paddingHorizontal: 18,
    ...actionShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.tile,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  count: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    marginTop: 3,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    flexShrink: 0,
  },
  highlightText: {
    fontSize: FontSize.small,
    fontWeight: '600',
    letterSpacing: -0.1,
    flexShrink: 1,
  },
  secondary: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    marginTop: 3,
  },
});
