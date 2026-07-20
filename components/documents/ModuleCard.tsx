import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { actionShadow, FontSize, Palette, Radius, Spacing, type PaletteShape } from '@/theme';
import { DocumentsTone } from './palette';
import { DocumentModule } from './types';

const TILE = 34;

export function ModuleCard({
  module,
  index,
  onPress,
  palette = Palette,
}: {
  module: DocumentModule;
  index: number;
  onPress?: () => void;
  /** Defaults to the static light palette — pass `useTheme().palette` from screens that opted into dark mode. */
  palette?: PaletteShape;
}) {
  const enter = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const styles = useMemo(() => createStyles(palette), [palette]);

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
  // A module carrying a real "red" alert (unpaid invoice, overdue…) should
  // read as needing attention — not with a loud outline, but the same quiet
  // way "Départ dépassé" earns colour on the Home: the icon tile takes the
  // alert's tinted wash and ink. No border, no shouting.
  const critical = module.stats?.some((s) => s.tone === 'red') ?? false;
  const tile = critical ? DocumentsTone.red : null;

  return (
    <Animated.View style={{ opacity: enter, transform: [{ translateY }] }}>
      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
        <Animated.View style={[styles.card, { transform: [{ scale: pressScale }] }]}>
          <View style={[styles.iconTile, tile ? { backgroundColor: tile.soft } : null]}>
            <Feather name={module.icon} size={16} color={tile ? tile.color : palette.blue} />
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

          <Feather name="chevron-right" size={16} color={palette.textTertiary} style={styles.chevron} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

function createStyles(Palette: PaletteShape) {
  return StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: Palette.card,
      borderRadius: Radius.card,
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: 'transparent',
      ...actionShadow,
    },
    iconTile: {
      width: TILE,
      height: TILE,
      borderRadius: Radius.tile - 4,
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
      fontSize: 16,
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
}
