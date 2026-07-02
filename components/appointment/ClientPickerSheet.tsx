import { Feather } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ClientAvatar } from '@/components/clients/ClientAvatar';
import { type Client } from '@/components/clients/types';
import { FontSize, Palette, Radius, Spacing } from '@/constants/design';
import { queryClients } from '@/data/clients';
import { PressableScale } from './AppointmentUI';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (client: Client) => void;
  selectedId?: string;
};

export function ClientPickerSheet({ visible, onClose, onSelect, selectedId }: Props) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;
  const [search, setSearch] = useState('');

  useEffect(() => {
    Animated.spring(progress, { toValue: visible ? 1 : 0, useNativeDriver: true, friction: 11, tension: 90 }).start();
    if (!visible) setSearch('');
  }, [visible, progress]);

  const results = useMemo(
    () => queryClients({ search, statuses: [], sort: 'recent' }),
    [search]
  );

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fermer" />
        </Animated.View>

        <Animated.View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 4, transform: [{ translateY }] }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Choisir un client</Text>

          <View style={styles.search}>
            <Feather name="search" size={17} color={Palette.textTertiary} />
            <TextInput
              style={styles.input}
              value={search}
              onChangeText={setSearch}
              placeholder="Rechercher un client…"
              placeholderTextColor={Palette.textTertiary}
              autoFocus
              returnKeyType="search"
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={styles.list}>
            {results.length === 0 ? (
              <Text style={styles.empty}>Aucun client trouvé.</Text>
            ) : (
              results.map((client) => {
                const selected = client.id === selectedId;
                return (
                  <PressableScale
                    key={client.id}
                    onPress={() => {
                      onSelect(client);
                      onClose();
                    }}
                    to={0.98}
                    style={StyleSheet.flatten([styles.row, selected && styles.rowSelected])}
                    accessibilityLabel={client.name}>
                    <ClientAvatar initials={client.initials} tint={client.avatarTint} size={42} elevated />
                    <View style={styles.rowInfo}>
                      <Text style={styles.rowName} numberOfLines={1}>
                        {client.name}
                      </Text>
                      <Text style={styles.rowAddress} numberOfLines={1}>
                        {client.address}
                      </Text>
                    </View>
                    {selected ? <Feather name="check" size={20} color={Palette.blue} /> : null}
                  </PressableScale>
                );
              })
            )}
          </ScrollView>
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
    maxHeight: '86%',
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: Palette.card,
    borderRadius: Radius.tile,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Palette.textPrimary,
    padding: 0,
  },
  list: {
    marginTop: 10,
  },
  empty: {
    fontSize: FontSize.label,
    color: Palette.textSecondary,
    textAlign: 'center',
    paddingVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: Radius.tile,
  },
  rowSelected: {
    backgroundColor: Palette.blueSoft,
  },
  rowInfo: { flex: 1 },
  rowName: {
    fontSize: FontSize.label,
    fontWeight: '700',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  rowAddress: {
    fontSize: FontSize.small,
    fontWeight: '500',
    color: Palette.textTertiary,
    marginTop: 2,
  },
});
