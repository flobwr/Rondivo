import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/theme';
import { FeatherIconName } from '../types';
import { PressableScale } from './primitives';

export type ActionSheetItem = {
  key: string;
  icon: FeatherIconName;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

type Props = {
  visible: boolean;
  title?: string;
  items: ActionSheetItem[];
  onClose: () => void;
};

// Same bottom-sheet chrome as the rest of the app (handle, backdrop, spring) —
// the one menu shape reused for the Documents "+" and every detail screen's
// "more actions" sheet.
export function ActionSheetMenu({ visible, title, items, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, { toValue: visible ? 1 : 0, useNativeDriver: true, friction: 11, tension: 90 }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  const handleSelect = (item: ActionSheetItem) => {
    onClose();
    item.onPress();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fermer" />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 4, transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          {title ? <Text style={styles.title}>{title}</Text> : null}

          <View style={styles.options}>
            {items.map((item, index) => (
              <View key={item.key}>
                {index > 0 ? <View style={styles.separator} /> : null}
                <PressableScale onPress={() => handleSelect(item)} to={0.98} style={styles.row} accessibilityLabel={item.label}>
                  <View style={[styles.iconTile, item.destructive ? styles.iconTileDestructive : styles.iconTileDefault]}>
                    <Feather name={item.icon} size={18} color={item.destructive ? Palette.red : Palette.blue} />
                  </View>
                  <Text style={[styles.rowLabel, item.destructive ? { color: Palette.red } : null]}>{item.label}</Text>
                </PressableScale>
              </View>
            ))}
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
  iconTileDefault: {
    backgroundColor: Palette.blueSoft,
  },
  iconTileDestructive: {
    backgroundColor: Palette.redSoft,
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
    marginBottom: 8,
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
});
