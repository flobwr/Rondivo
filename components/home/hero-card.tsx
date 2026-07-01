import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { heroShadow } from '@/constants/shadow';

type HeroCardProps = {
  isEmpty?: boolean;
};

const GPS = 48;

export function HeroCard({ isEmpty = false }: HeroCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const gpsScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, {
      toValue: 0.978,
      useNativeDriver: true,
      friction: 6,
      tension: 300,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 120,
    }).start();
  };

  const onGpsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Animated.sequence([
      Animated.spring(gpsScale, {
        toValue: 0.86,
        useNativeDriver: true,
        friction: 5,
        tension: 400,
      }),
      Animated.spring(gpsScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 4,
        tension: 150,
      }),
    ]).start();
  };

  if (isEmpty) {
    return (
      <LinearGradient
        colors={['#C2CBD8', '#B8C4D2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}>
        <Text style={styles.eyebrow}>PROCHAINE INTERVENTION</Text>
        <Text style={[styles.client, { fontSize: 24, opacity: 0.55 }]}>Journée libre</Text>
        <Text style={[styles.metaText, { marginTop: 8, opacity: 0.6 }]}>
          Aucune intervention prévue aujourd&apos;hui
        </Text>
        <Pressable style={styles.emptyAction} hitSlop={8}>
          <Text style={styles.emptyActionText}>Créer une intervention</Text>
          <Feather name="plus" size={14} color={Palette.white} />
        </Pressable>
      </LinearGradient>
    );
  }

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <LinearGradient
          colors={[Palette.gradientStart, Palette.gradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}>
          <Text style={styles.eyebrow}>PROCHAINE INTERVENTION</Text>
          <Text style={styles.client}>Martin Dupont</Text>

          <View style={styles.metaRow}>
            <Ionicons name="time-outline" size={17} color={Palette.white} />
            <Text style={styles.metaText}>10:30 {'•'} Entretien chaudière</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerInfo}>
              <View style={styles.footerColumn}>
                <Text style={styles.footerLabel}>DÉPART CONSEILLÉ</Text>
                <Text
                  style={styles.footerValueLarge}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.9}>
                  10:12
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.footerColumnGrow}>
                <Text style={styles.footerLabel}>TRAJET</Text>
                <Text
                  style={styles.footerValue}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}>
                  18 min {'•'} 7,4 km
                </Text>
                <Text
                  style={styles.footerSub}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}>
                  via Av. Félix Faure
                </Text>
              </View>
            </View>

            <Pressable onPress={onGpsPress} hitSlop={8}>
              <Animated.View style={[styles.gpsButton, { transform: [{ scale: gpsScale }] }]}>
                <Feather name="navigation" size={22} color={Palette.blue} />
              </Animated.View>
            </Pressable>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.hero,
    paddingHorizontal: Spacing.cardPadding,
    paddingTop: 16,
    paddingBottom: 18,
    ...heroShadow,
  },
  eyebrow: {
    color: Palette.white,
    opacity: 0.75,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  client: {
    color: Palette.white,
    fontSize: FontSize.hero,
    fontWeight: '800',
    marginTop: 5,
    letterSpacing: -0.8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    gap: 7,
  },
  metaText: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.92,
    letterSpacing: -0.1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  footerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  footerColumn: {
    flexShrink: 1,
    minWidth: 70,
  },
  footerColumnGrow: {
    flexShrink: 0,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.30)',
    marginHorizontal: 12,
  },
  footerLabel: {
    color: Palette.white,
    opacity: 0.70,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.0,
  },
  footerValueLarge: {
    color: Palette.white,
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  footerValue: {
    color: Palette.white,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    letterSpacing: -0.1,
  },
  footerSub: {
    color: Palette.white,
    opacity: 0.70,
    fontSize: FontSize.tiny,
    fontWeight: '500',
    marginTop: 3,
  },
  gpsButton: {
    width: GPS,
    height: GPS,
    borderRadius: GPS / 2,
    backgroundColor: Palette.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 18,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.20)',
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  emptyActionText: {
    color: Palette.white,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
