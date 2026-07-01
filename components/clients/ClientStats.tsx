import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { Palette } from '@/constants/design';
import { actionShadow } from '@/constants/shadow';
import { STATUS_META, type ClientStatus } from '@/components/clients/types';

type StatDef = {
  key: ClientStatus | 'new-clients';
  label: string;
  icon: React.ComponentProps<typeof Feather>['name'];
  color: string;
  soft: string;
  count: number;
};

type ClientStatsProps = {
  counts: Record<ClientStatus, number>;
  newClientsCount: number;
  activeKey: ClientStatus | 'new-clients' | null;
  onSelect: (key: ClientStatus | 'new-clients') => void;
};

function StatCard({ def, active, onPress }: { def: StatDef; active: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, friction: 5, tension: 300 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4, tension: 100 }).start();
  };

  return (
    <Pressable style={styles.wrapper} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View
        style={[
          styles.card,
          { transform: [{ scale }] },
          active ? { borderColor: def.color, backgroundColor: def.soft } : null,
        ]}>
        <View style={[styles.iconTile, { backgroundColor: def.soft }]}>
          <Feather name={def.icon} size={14} color={def.color} />
        </View>
        <Text style={styles.count}>{def.count}</Text>
        <Text style={styles.label} numberOfLines={2}>
          {def.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

function ClientStatsComponent({ counts, newClientsCount, activeKey, onSelect }: ClientStatsProps) {
  const defs: StatDef[] = [
    {
      key: 'action-required',
      label: STATUS_META['action-required'].label,
      icon: STATUS_META['action-required'].icon,
      color: STATUS_META['action-required'].color,
      soft: STATUS_META['action-required'].soft,
      count: counts['action-required'],
    },
    {
      key: 'follow-up',
      label: STATUS_META['follow-up'].label,
      icon: STATUS_META['follow-up'].icon,
      color: STATUS_META['follow-up'].color,
      soft: STATUS_META['follow-up'].soft,
      count: counts['follow-up'],
    },
    {
      key: 'up-to-date',
      label: STATUS_META['up-to-date'].label,
      icon: STATUS_META['up-to-date'].icon,
      color: STATUS_META['up-to-date'].color,
      soft: STATUS_META['up-to-date'].soft,
      count: counts['up-to-date'],
    },
    {
      key: 'new-clients',
      label: 'Nouveaux',
      icon: 'users',
      color: Palette.blue,
      soft: Palette.blueSoft,
      count: newClientsCount,
    },
  ];

  return (
    <View style={styles.row}>
      {defs.map((def) => (
        <StatCard key={def.key} def={def} active={activeKey === def.key} onPress={() => onSelect(def.key)} />
      ))}
    </View>
  );
}

export const ClientStats = memo(ClientStatsComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  wrapper: {
    flex: 1,
  },
  card: {
    backgroundColor: Palette.cardMuted,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E4E8EF',
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 5,
    ...actionShadow,
  },
  iconTile: {
    width: 26,
    height: 26,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: Palette.textSecondary,
    letterSpacing: -0.1,
    lineHeight: 13,
  },
});
