import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Radius } from '@/constants/design';
import { STATUS_META, type ClientStatus } from '@/components/clients/types';

type ClientStatusBadgeProps = {
  status: ClientStatus;
};

function ClientStatusBadgeComponent({ status }: ClientStatusBadgeProps) {
  const meta = STATUS_META[status];

  return (
    <View style={[styles.pill, { backgroundColor: meta.soft }]}>
      <Text style={[styles.text, { color: meta.color }]} numberOfLines={1}>
        {meta.label}
      </Text>
    </View>
  );
}

export const ClientStatusBadge = memo(ClientStatusBadgeComponent);

const styles = StyleSheet.create({
  pill: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
