import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TINT_COLORS, type Client } from '@/components/clients/types';
import { badgeShadow } from '@/theme';

// A soft top-down light, painted over the tinted disc so the avatar reads as a
// physical token catching light from above rather than a flat circle. Very
// discreet — the initials always stay the clearest thing on it.
const SHEEN = ['rgba(255,255,255,0.34)', 'rgba(255,255,255,0)'] as const;

type ClientAvatarProps = {
  initials: string;
  tint: Client['avatarTint'];
  size?: number;
  /** Adds a subtle depth + contrast ring. Opt-in so the flat fiche avatars stay
   *  unchanged; the client list turns it on for a more premium feel. */
  elevated?: boolean;
};

// ~20% smaller than the previous 52px default, per the polish brief.
function ClientAvatarComponent({ initials, tint, size = 44, elevated = false }: ClientAvatarProps) {
  const { color, soft } = TINT_COLORS[tint];

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: soft },
        elevated && { borderWidth: StyleSheet.hairlineWidth, borderColor: color + '33', ...badgeShadow },
      ]}>
      <LinearGradient
        colors={SHEEN}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.85 }}
        style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
        pointerEvents="none"
      />
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
