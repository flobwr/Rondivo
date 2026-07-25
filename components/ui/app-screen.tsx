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
  /** Overlaying footer (e.g. a BottomNav). It floats above the scroll area. */
  footer?: React.ReactNode;
  /**
   * Extra bottom padding for the scroll content, so the last item is not
   * trapped under an overlaying footer. Pass `useBottomNavSpace()` when the
   * footer is the app's BottomNav — the design system stays unaware of it.
   */
  contentBottomInset?: number;
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
  contentBottomInset = 0,
  background = 'screen',
  style,
  children,
  ...rest
}: AppScreenProps) {
  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        padded ? styles.paddedContent : styles.content,
        contentBottomInset ? { paddingBottom: contentBottomInset + Spacing.section } : null,
      ]}>
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
