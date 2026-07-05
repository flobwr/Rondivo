import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { SectionLabel } from './SectionLabel';

type Props = {
  label?: string;
  children: React.ReactNode;
};

/** Labeled white card that auto-separates its FormRow children with hairlines. */
export function FormCard({ label, children }: Props) {
  const items = React.Children.toArray(children);
  return (
    <View>
      {label ? <SectionLabel>{label}</SectionLabel> : null}
      <View style={styles.card}>
        {items.map((child, index) => (
          <View key={index}>
            {index > 0 ? <View style={styles.separator} /> : null}
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingHorizontal: Spacing.lg,
    ...cardShadow,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
});
