import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { SectionCard } from './SectionCard';
import { MaterialItem } from './types';

type Props = {
  material: MaterialItem[];
  onAdd?: () => void;
};

export function MaterialCard({ material, onAdd }: Props) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, friction: 6, tension: 300 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 120 }).start();
  };

  return (
    <SectionCard icon="package" iconColor={Palette.orange} iconBackground={Palette.orangeSoft} title="Matériel">
      {material.length > 0 ? (
        <View>
          {material.map((item, index) => (
            <View key={item.id}>
              {index > 0 ? <View style={styles.separator} /> : null}
              <View style={styles.row}>
                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.reference} numberOfLines={1}>
                    {item.reference}
                  </Text>
                </View>
                <View style={styles.qtyPill}>
                  <Text style={styles.qtyText}>×{item.quantity}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.empty}>Aucune pièce enregistrée.</Text>
      )}

      <Pressable onPressIn={onPressIn} onPressOut={onPressOut} onPress={onAdd} style={styles.addWrapper}>
        <Animated.View style={[styles.addRow, { transform: [{ scale }] }]}>
          <Feather name="plus-circle" size={16} color={Palette.blue} />
          <Text style={styles.addText}>Ajouter une pièce</Text>
        </Animated.View>
      </Pressable>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  reference: {
    fontSize: 12,
    fontWeight: '400',
    color: Palette.textTertiary,
    marginTop: 2,
  },
  qtyPill: {
    backgroundColor: Palette.cardMuted,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: Spacing.sm,
  },
  qtyText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  empty: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    paddingVertical: 4,
  },
  addWrapper: {
    marginTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Palette.border,
    paddingTop: Spacing.md,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  addText: {
    fontSize: FontSize.small,
    fontWeight: '700',
    color: Palette.blue,
    letterSpacing: -0.1,
  },
});
