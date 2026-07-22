import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { Palette, Spacing } from '@/constants/design';

export type AppScreenProps = ViewProps & {
  /** Wrap content in a padded ScrollView. Set false for fixed layouts. */
  scroll?: boolean;
  /** Apply the standard horizontal screen margin to the content. */
  padded?: boolean;
  /** Safe-area edges to inset. Defaults to just the top. */
  edges?: readonly Edge[];
  /** Fixed footer that sits below the scroll area (e.g. a BottomNav). */
  footer?: React.ReactNode;
  /** Background colour token. Defaults to the app screen colour. */
  background?: keyof typeof Palette;
};

/**
 * The screen scaffold: full-bleed background + SafeAreaView + optional scroll
 * area + a fixed footer slot. Replaces the copy-pasted
 * `root / safeArea / ScrollView / BottomNav` boilerplate in every screen so new
 * screens start consistent and correctly inset.
 */
export function AppScreen({
  scroll = true,
  padded = true,
  edges = ['top'],
  footer,
  background = 'screen',
  style,
  children,
  ...rest
}: AppScreenProps) {
  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[padded ? styles.paddedContent : styles.content]}>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded ? styles.paddedFixed : null, style]} {...rest}>
      {children}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: Palette[background] }]}>
      <SafeAreaView edges={edges} style={styles.flex}>
        {content}
      </SafeAreaView>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing.section,
  },
  paddedContent: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.section,
  },
  paddedFixed: {
    paddingHorizontal: Spacing.screen,
  },
});
