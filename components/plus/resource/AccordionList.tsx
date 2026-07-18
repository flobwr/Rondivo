import { Feather } from '@expo/vector-icons';
import { LayoutAnimation, Platform, StyleSheet, Text, UIManager, View } from 'react-native';
import { useState } from 'react';

import { PressableScale } from '@/components/documents/shared/primitives';
import { cardShadow, FontSize, Palette, Radius, Spacing } from '@/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type AccordionItem = { key: string; question: string; answer: string };

/** Expand-in-place Q&A rows — Centre d'aide and Tutoriels share this exact shape. */
export function AccordionList({ items }: { items: AccordionItem[] }) {
  const [openKey, setOpenKey] = useState<string | null>(null);

  const toggle = (key: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenKey((prev) => (prev === key ? null : key));
  };

  return (
    <View style={styles.card}>
      {items.map((item, index) => {
        const open = openKey === item.key;
        return (
          <View key={item.key}>
            {index > 0 ? <View style={styles.separator} /> : null}
            <PressableScale onPress={() => toggle(item.key)} to={0.99} style={styles.row} accessibilityLabel={item.question}>
              <Text style={styles.question}>{item.question}</Text>
              <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={Palette.textTertiary} />
            </PressableScale>
            {open ? <Text style={styles.answer}>{item.answer}</Text> : null}
          </View>
        );
      })}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    paddingVertical: 14,
  },
  question: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  answer: {
    fontSize: 13.5,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    lineHeight: 20,
    paddingBottom: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.separator,
  },
});
