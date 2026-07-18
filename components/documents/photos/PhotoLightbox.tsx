import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Alert, Modal, Share, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FontSize, Palette } from '@/theme';
import { PressableScale } from '@/components/documents/shared/primitives';
import { PHOTO_CATEGORY_LABEL, PHOTO_CATEGORY_ORDER, InterventionPhoto } from '@/data/documents/photos';

type Props = {
  photo: InterventionPhoto | null;
  onClose: () => void;
  onDelete: (photo: InterventionPhoto) => void;
  onChangeCategory: (photo: InterventionPhoto) => void;
};

function ActionButton({
  icon,
  label,
  onPress,
  destructive,
}: {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <PressableScale onPress={onPress} to={0.9} style={styles.actionButton} accessibilityLabel={label}>
      <View style={[styles.actionIcon, destructive ? styles.actionIconDestructive : null]}>
        <Feather name={icon} size={19} color={destructive ? Palette.red : Palette.white} />
      </View>
      <Text style={[styles.actionLabel, destructive ? { color: Palette.red } : null]}>{label}</Text>
    </PressableScale>
  );
}

// The next phase in the cycle — tapping "Changer la phase" repeatedly walks
// avant -> pendant -> après -> avant without needing a separate picker sheet.
function nextCategory(current: InterventionPhoto['category']) {
  const index = PHOTO_CATEGORY_ORDER.indexOf(current);
  return PHOTO_CATEGORY_ORDER[(index + 1) % PHOTO_CATEGORY_ORDER.length];
}

export function PhotoLightbox({ photo, onClose, onDelete, onChangeCategory }: Props) {
  return (
    <Modal visible={!!photo} animationType="fade" onRequestClose={onClose} transparent={false}>
      {photo ? (
        <View style={styles.root}>
          <Image source={{ uri: photo.uri }} style={styles.image} contentFit="contain" />

          <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
            <View style={styles.header}>
              <PressableScale onPress={onClose} to={0.9} style={styles.closeButton} accessibilityLabel="Fermer">
                <Feather name="x" size={20} color={Palette.white} />
              </PressableScale>
              <View style={styles.headerMeta}>
                <Text style={styles.headerTitle}>{PHOTO_CATEGORY_LABEL[photo.category]}</Text>
              </View>
              <View style={styles.closeButton} />
            </View>

            <View style={styles.footer}>
              <ActionButton
                icon="repeat"
                label={`→ ${PHOTO_CATEGORY_LABEL[nextCategory(photo.category)]}`}
                onPress={() => onChangeCategory(photo)}
              />
              <ActionButton
                icon="share"
                label="Partager"
                onPress={() => Share.share({ url: photo.uri, message: photo.uri })}
              />
              <ActionButton
                icon="download"
                label="Télécharger"
                onPress={() => Alert.alert('Télécharger', 'Cette action sera bientôt disponible.')}
              />
              <ActionButton icon="trash-2" label="Supprimer" destructive onPress={() => onDelete(photo)} />
            </View>
          </SafeAreaView>
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  image: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerMeta: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  actionButton: {
    alignItems: 'center',
    gap: 6,
  },
  actionIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconDestructive: {
    backgroundColor: 'rgba(239,68,68,0.16)',
  },
  actionLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Palette.white,
    letterSpacing: -0.1,
  },
});
