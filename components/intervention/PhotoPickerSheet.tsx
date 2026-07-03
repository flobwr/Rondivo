import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PressableScale } from '@/components/appointment/AppointmentUI';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickLibrary: () => void;
};

// Same bottom-sheet chrome as ClientPickerSheet/CountryPickerSheet (handle,
// backdrop, spring) — a photo-source picker is still unmistakably Rondivo.
export function PhotoPickerSheet({ visible, onClose, onPickCamera, onPickLibrary }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, { toValue: visible ? 1 : 0, useNativeDriver: true, friction: 11, tension: 90 }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fermer" />
        </Animated.View>

        <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 4, transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Ajouter une photo</Text>

          <View style={styles.options}>
            {Platform.OS !== 'web' ? (
              <>
                <PressableScale onPress={onPickCamera} to={0.98} style={styles.row} accessibilityLabel="Prendre une photo">
                  <View style={[styles.iconTile, { backgroundColor: Palette.blueSoft }]}>
                    <Feather name="camera" size={19} color={Palette.blue} />
                  </View>
                  <Text style={styles.rowLabel}>Prendre une photo</Text>
                  <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
                </PressableScale>
                <View style={styles.separator} />
              </>
            ) : null}

            <PressableScale onPress={onPickLibrary} to={0.98} style={styles.row} accessibilityLabel="Choisir depuis la galerie">
              <View style={[styles.iconTile, { backgroundColor: Palette.greenSoft }]}>
                <Feather name="image" size={19} color={Palette.green} />
              </View>
              <Text style={styles.rowLabel}>Choisir depuis la galerie</Text>
              <Feather name="chevron-right" size={18} color={Palette.textTertiary} />
            </PressableScale>
          </View>

          <PressableScale onPress={onClose} to={0.98} style={styles.cancelButton} accessibilityLabel="Annuler">
            <Text style={styles.cancelText}>Annuler</Text>
          </PressableScale>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(15, 23, 41, 0.38)' },
  sheet: {
    backgroundColor: Palette.screen,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.screen,
    paddingTop: 10,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D7DCE4',
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  options: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Palette.border,
    marginLeft: 14 + 38 + 12,
  },
  iconTile: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: FontSize.label,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.red,
    letterSpacing: -0.1,
  },
});
