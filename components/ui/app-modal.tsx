import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View } from 'react-native';

import { Overlay, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { Duration } from '@/constants/motion';
import { AppText } from './app-text';

export type AppModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  /** Tapping the scrim closes the modal. Defaults to true. */
  dismissOnBackdrop?: boolean;
  children?: React.ReactNode;
};

/**
 * A centred dialog. Built on React Native's Modal (no extra dependency) with a
 * fading scrim and a scale-in card. Use for confirmations and short prompts;
 * for option lists / forms sliding from the bottom, prefer AppBottomSheet.
 */
export function AppModal({ visible, onClose, title, dismissOnBackdrop = true, children }: AppModalProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: visible ? 1 : 0,
      duration: Duration.fast,
      useNativeDriver: true,
    }).start();
  }, [visible, progress]);

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Pressable
          style={styles.backdrop}
          onPress={dismissOnBackdrop ? onClose : undefined}
          accessibilityRole="button"
          accessibilityLabel="Fermer"
        />
        <Animated.View style={[styles.card, { opacity: progress, transform: [{ scale }] }]}>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.section,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Overlay.scrim,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    padding: Spacing.cardPadding,
    ...cardShadow,
  },
  title: {
    marginBottom: Spacing.md,
  },
});
