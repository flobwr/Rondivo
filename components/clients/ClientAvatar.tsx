import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TINT_COLORS, type Client } from '@/components/clients/types';

type ClientAvatarProps = {
  initials: string;
  tint: Client['avatarTint'];
  size?: number;
};

// ~20% smaller than the previous 52px default, per the polish brief.
function ClientAvatarComponent({ initials, tint, size = 44 }: ClientAvatarProps) {
  const { color, soft } = TINT_COLORS[tint];

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: soft },
      ]}>
      <Text style={[styles.text, { color, fontSize: size * 0.36 }]} numberOfLines={1}>
        {initials}
      </Text>
    </View>
  );
}

export const ClientAvatar = memo(ClientAvatarComponent);

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
