import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';

export type PickerOption = {
  key: string;
  label: string;
  subtitle?: string;
};

type Props = {
  visible: boolean;
  title: string;
  options: PickerOption[];
  selectedKey?: string;
  onSelect: (key: string) => void;
  onClose: () => void;
};

export function PickerModal({ visible, title, options, selectedKey, onSelect, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>{title}</Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              {options.map((option, index) => {
                const active = option.key === selectedKey;
                return (
                  <View key={option.key}>
                    {index > 0 ? <View style={styles.separator} /> : null}
                    <Pressable style={styles.row} onPress={() => onSelect(option.key)}>
                      <View style={styles.rowText}>
                        <Text style={styles.rowLabel}>{option.label}</Text>
                        {option.subtitle ? (
                          <Text style={styles.rowSubtitle}>{option.subtitle}</Text>
                        ) : null}
                      </View>
                      {active ? (
                        <Feather name="check" size={18} color={Palette.blue} />
                      ) : null}
                    </Pressable>
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <Pressable style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelLabel}>Annuler</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 41, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.screen,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
    maxHeight: '75%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.border,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: Spacing.md,
  },
  scroll: {
    flexGrow: 0,
  },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  rowText: {
    flex: 1,
  },
  rowLabel: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
  },
  rowSubtitle: {
    fontSize: FontSize.small,
    color: Palette.textTertiary,
    marginTop: 2,
  },
  cancelButton: {
    backgroundColor: Palette.card,
    borderRadius: Radius.card,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...cardShadow,
  },
  cancelLabel: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
});
