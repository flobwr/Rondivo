import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { DocumentsTone } from './palette';
import { DocumentModule } from './types';

const TILE = 40;

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

  const translateY = enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });

  return (
    <Animated.View style={{ opacity: enter, transform: [{ translateY }] }}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Animated.View style={[styles.card, { transform: [{ scale: pressScale }] }]}>
          <View style={styles.iconTile}>
            <Feather name={module.icon} size={18} color={Palette.blue} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {module.title}
            </Text>

            {module.stats?.map((stat, i) => {
              const tone = stat.tone ? DocumentsTone[stat.tone] : null;
              return (
                <View key={i} style={[styles.statRow, i === 0 ? styles.statRowFirst : null]}>
                  {tone ? <View style={[styles.dot, { backgroundColor: tone.color }]} /> : null}
                  <Text
                    style={[styles.statText, tone ? { color: tone.color, fontWeight: '600' } : null]}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {stat.text}
                  </Text>
                </View>
              );
            })}

            {module.count !== undefined ? (
              <Text style={styles.count} numberOfLines={1} ellipsizeMode="tail">
                {module.count} {module.unit}
              </Text>
            ) : null}
          </View>

          <Feather name="chevron-right" size={16} color={Palette.textTertiary} style={styles.chevron} />
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
    paddingVertical: 13,
    paddingHorizontal: 16,
    ...actionShadow,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: Radius.tile - 2,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.sm + 2,
    marginRight: Spacing.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statRowFirst: {
    marginTop: 3,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    flexShrink: 0,
  },
  statText: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
  },
  count: {
    fontSize: FontSize.small,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 3,
  },
  chevron: {
    opacity: 0.7,
  },
});
