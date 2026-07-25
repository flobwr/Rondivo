import { useCallback, useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Overlay, Palette, Radius, Spacing } from '@/constants/design';
import { Timing } from '@/constants/motion';
import { AppText } from './app-text';

export type AppBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Tapping the scrim closes the sheet. Defaults to true. */
  dismissOnBackdrop?: boolean;
  children?: React.ReactNode;
};

/**
 * A sheet that slides up from the bottom edge. Dependency-free (RN Modal +
 * Animated), safe-area aware, with a grab handle and optional title. Use for
 * option pickers, quick forms and contextual actions.
 *
 * For gesture-driven, snap-point sheets later on, this API is intentionally
 * compatible with swapping in @gorhom/bottom-sheet behind the same props.
 */
export function AppBottomSheet({
  visible,
  onClose,
  title,
  dismissOnBackdrop = true,
  children,
}: AppBottomSheetProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;

  const animateTo = useCallback(
    (to: number, cb?: () => void) => {
      Animated.timing(progress, { toValue: to, useNativeDriver: true, ...Timing.overlay }).start(
        cb ? () => cb() : undefined
      );
    },
    [progress]
  );

  useEffect(() => {
    if (visible) {
      animateTo(1);
    } else {
      // Hidden by the Modal instantly; reset so the next open slides up again.
      progress.setValue(0);
    }
  }, [visible, animateTo, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [600, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={dismissOnBackdrop ? onClose : undefined}
            accessibilityRole="button"
            accessibilityLabel="Fermer"
          />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { paddingBottom: insets.bottom + Spacing.lg, transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          {title ? (
            <AppText variant="title3" style={styles.title}>
              {title}
            </AppText>
          ) : null}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Overlay.scrim,
  },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: Radius.hero,
    borderTopRightRadius: Radius.hero,
    paddingHorizontal: Spacing.cardPadding,
    paddingTop: Spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
    backgroundColor: Palette.border,
    marginBottom: Spacing.lg,
  },
  title: {
    marginBottom: Spacing.md,
  },
});
