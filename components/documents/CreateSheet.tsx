import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { cardShadow } from '@/constants/shadow';
import { IconTile } from './IconTile';

export type CreateAction = 'devis' | 'facture' | 'rapport' | 'import';

type Option = {
  key: CreateAction;
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
};

const OPTIONS: Option[] = [
  { key: 'devis', label: 'Nouveau devis', icon: 'edit-3' },
  { key: 'facture', label: 'Nouvelle facture', icon: 'file-text' },
  { key: 'rapport', label: 'Nouveau rapport', icon: 'clipboard' },
  { key: 'import', label: 'Importer un document', icon: 'upload' },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (action: CreateAction) => void;
};

export function CreateSheet({ visible, onClose, onSelect }: Props) {
  const insets = useSafeAreaInsets();

  const handleSelect = (action: CreateAction) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(action);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, Spacing.lg) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Créer</Text>

          <View style={styles.card}>
            {OPTIONS.map((option, index) => (
              <View key={option.key}>
                {index > 0 ? <View style={styles.separator} /> : null}
                <Pressable style={styles.row} onPress={() => handleSelect(option.key)}>
                  <IconTile background={Palette.blueSoft}>
                    <Feather name={option.icon} size={19} color={Palette.blue} />
                  </IconTile>
                  <Text style={styles.rowLabel}>{option.label}</Text>
                </Pressable>
              </View>
            ))}
          </View>

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
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  rowLabel: {
    fontSize: FontSize.body,
    fontWeight: '600',
    color: Palette.textPrimary,
    letterSpacing: -0.1,
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
