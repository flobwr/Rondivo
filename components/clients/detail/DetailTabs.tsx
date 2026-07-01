import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/constants/design';
import { PressableScale } from './primitives';

export type DetailTab = 'resume' | 'interventions' | 'documents' | 'finances' | 'notes';

export const TAB_ORDER: DetailTab[] = ['resume', 'interventions', 'documents', 'finances', 'notes'];

const TAB_LABELS: Record<DetailTab, string> = {
  resume: 'Résumé',
  interventions: 'Interventions',
  documents: 'Documents',
  finances: 'Finances',
  notes: 'Notes',
};

type Props = {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
};

export function DetailTabs({ active, onChange }: Props) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {TAB_ORDER.map((tab) => {
          const isActive = tab === active;
          return (
            <PressableScale
              key={tab}
              onPress={() => onChange(tab)}
              to={0.95}
              haptic={false}
              style={styles.tab}
              accessibilityLabel={TAB_LABELS[tab]}>
              <Text style={[styles.label, isActive && styles.labelActive]}>{TAB_LABELS[tab]}</Text>
              <View style={[styles.underline, isActive && styles.underlineActive]} />
            </PressableScale>
          );
        })}
      </ScrollView>
      <View style={styles.baseline} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  content: {
    gap: 24,
    paddingHorizontal: Spacing.xs,
  },
  tab: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  label: {
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textTertiary,
    letterSpacing: -0.2,
  },
  labelActive: {
    color: Palette.blue,
    fontWeight: '700',
  },
  underline: {
    height: 2.5,
    width: '100%',
    borderRadius: 2,
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  underlineActive: {
    backgroundColor: Palette.blue,
  },
  baseline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
  },
});
