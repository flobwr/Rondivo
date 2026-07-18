import { StyleSheet, Text, View } from 'react-native';

import { FontSize, Palette, Spacing } from '@/theme';

export type LegalSection = { heading: string; body: string };

/** Plain scrollable legal text — shared shape for CGU and Politique de confidentialité. */
export function LegalSections({ sections }: { sections: LegalSection[] }) {
  return (
    <View>
      {sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.heading}>{section.heading}</Text>
          <Text style={styles.body}>{section.body}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  heading: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  body: {
    fontSize: 13.5,
    fontWeight: '400',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    lineHeight: 20,
  },
});
