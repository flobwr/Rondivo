import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Palette, Radius, Spacing } from '@/constants/design';
import {
  SORT_META,
  SORT_ORDER,
  STATUS_META,
  STATUS_ORDER,
  type ClientStatus,
  type SortKey,
} from '@/components/clients/types';

type ClientFilterSheetProps = {
  visible: boolean;
  onClose: () => void;
  selectedStatuses: ClientStatus[];
  onToggleStatus: (status: ClientStatus) => void;
  sortKey: SortKey;
  onChangeSort: (key: SortKey) => void;
  onReset: () => void;
  resultCount: number;
};

function StatusChip({
  label,
  color,
  soft,
  active,
  onPress,
}: {
  label: string;
  color: string;
  soft: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        active
          ? { backgroundColor: soft, borderColor: color }
          : { backgroundColor: Palette.cardMuted, borderColor: '#E4E8EF' },
      ]}>
      <View style={[styles.chipDot, { backgroundColor: color }]} />
      <Text style={[styles.chipText, { color: active ? color : Palette.textPrimary }]}>{label}</Text>
    </Pressable>
  );
}

function SortRow({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={styles.sortRow}>
      <View style={[styles.sortIcon, active ? { backgroundColor: Palette.blueSoft } : null]}>
        <Feather name={icon} size={15} color={active ? Palette.blue : Palette.textSecondary} />
      </View>
      <Text style={[styles.sortLabel, active ? styles.sortLabelActive : null]}>{label}</Text>
      {active ? <Feather name="check" size={18} color={Palette.blue} /> : null}
    </Pressable>
  );
}

export function ClientFilterSheet({
  visible,
  onClose,
  selectedStatuses,
  onToggleStatus,
  sortKey,
  onChangeSort,
  onReset,
  resultCount,
}: ClientFilterSheetProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      friction: 11,
      tension: 90,
    }).start();
  }, [visible, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [height, 0] });
  const hasFilters = selectedStatuses.length > 0 || sortKey !== 'priority';

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, { opacity: progress }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Fermer" />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 16) + 8, transform: [{ translateY }] },
          ]}>
          <View style={styles.handle} />

          <View style={styles.sheetHeader}>
            <Text style={styles.title}>Filtrer et trier</Text>
            {hasFilters ? (
              <Pressable
                hitSlop={8}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onReset();
                }}>
                <Text style={styles.reset}>Réinitialiser</Text>
              </Pressable>
            ) : null}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <Text style={styles.sectionTitle}>Statut</Text>
            <View style={styles.chipRow}>
              {STATUS_ORDER.map((status) => (
                <StatusChip
                  key={status}
                  label={STATUS_META[status].label}
                  color={STATUS_META[status].color}
                  soft={STATUS_META[status].soft}
                  active={selectedStatuses.includes(status)}
                  onPress={() => onToggleStatus(status)}
                />
              ))}
            </View>

            <Text style={[styles.sectionTitle, styles.sectionSpacing]}>Trier par</Text>
            <View style={styles.sortList}>
              {SORT_ORDER.map((key) => (
                <SortRow
                  key={key}
                  label={SORT_META[key].label}
                  icon={SORT_META[key].icon}
                  active={sortKey === key}
                  onPress={() => onChangeSort(key)}
                />
              ))}
            </View>
          </ScrollView>

          <Pressable
            style={styles.applyButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onClose();
            }}>
            <Text style={styles.applyText}>
              Afficher {resultCount} client{resultCount > 1 ? 's' : ''}
            </Text>
          </Pressable>
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
    backgroundColor: 'rgba(15, 23, 41, 0.38)',
  },
  sheet: {
    backgroundColor: Palette.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.screen,
    paddingTop: 10,
    maxHeight: '82%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D7DCE4',
    marginBottom: 14,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.4,
  },
  reset: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Palette.blue,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
    color: Palette.textTertiary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  sectionSpacing: {
    marginTop: 22,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  chipDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  sortList: {
    borderRadius: Radius.tile,
    overflow: 'hidden',
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 11,
  },
  sortIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Palette.cardMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Palette.textPrimary,
    letterSpacing: -0.2,
  },
  sortLabelActive: {
    fontWeight: '700',
  },
  applyButton: {
    backgroundColor: Palette.blue,
    borderRadius: Radius.tile,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 18,
  },
  applyText: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.white,
    letterSpacing: -0.2,
  },
});
