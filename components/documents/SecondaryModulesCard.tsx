import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { DocumentModule } from './types';

const TILE = 28;

function SecondaryRow({ module, onPress }: { module: DocumentModule; onPress?: () => void }) {
  const pressScale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(pressScale, { toValue: 0.985, useNativeDriver: true, friction: 7, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(pressScale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[styles.row, { transform: [{ scale: pressScale }] }]}>
        <View style={styles.iconTile}>
          <Feather name={module.icon} size={14} color={Palette.blue} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {module.title}
          </Text>
          <Text style={styles.count} numberOfLines={1}>
            {module.count} {module.unit}
          </Text>
        </View>
        <Feather name="chevron-right" size={15} color={Palette.textTertiary} style={styles.chevron} />
      </Animated.View>
    </Pressable>
  );
}

// The three lower-priority modules (Photos, Contrats, Documents importés) live
// in one quiet card rather than as full-size ModuleCards — same information,
// far less visual weight, so the eye keeps landing on Factures/Devis/Rapports.
export function SecondaryModulesCard({
  modules,
  onModulePress,
}: {
  modules: DocumentModule[];
  onModulePress: (module: DocumentModule) => void;
}) {
  return (
    <View>
      <Text style={styles.sectionLabel}>Autres documents</Text>
      <View style={styles.card}>
        {modules.map((module, index) => (
          <View key={module.id}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <SecondaryRow module={module} onPress={() => onModulePress(module)} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: Palette.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: Spacing.sm + 2,
  },
  iconTile: {
    width: TILE,
    height: TILE,
    borderRadius: 9,
    backgroundColor: Palette.blueSoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  count: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    letterSpacing: -0.1,
    marginTop: 1,
  },
  chevron: {
    opacity: 0.7,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
});
