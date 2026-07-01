import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius } from '@/constants/design';
import { STATUS_META, type ClientStatus } from '@/components/clients/types';

type ClientStatusBadgeProps = {
  status: ClientStatus;
};

// Small, fine pill with a matching status dot. Kept deliberately compact so the
// name above it always wins the horizontal space.
function ClientStatusBadgeComponent({ status }: ClientStatusBadgeProps) {
  const meta = STATUS_META[status];

  return (
    <View style={[styles.pill, { backgroundColor: meta.soft }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.text, { color: meta.color }]} numberOfLines={1}>
        {meta.label}
      </Text>
    </View>
  );
}

export const ClientStatusBadge = memo(ClientStatusBadgeComponent);

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: Radius.pill,
    paddingHorizontal: 9,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
