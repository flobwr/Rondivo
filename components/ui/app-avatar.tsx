import { Image, ImageSource } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import { FontWeight, LetterSpacing, Palette } from '@/constants/design';
import { AppText } from './app-text';

type Size = 'sm' | 'md' | 'lg';

export type AppAvatarProps = {
  /** Remote/local image. When absent, initials are shown. */
  source?: ImageSource | string;
  /** Full name — used to derive initials when no image is provided. */
  name?: string;
  /** Explicit initials override. */
  initials?: string;
  size?: Size;
  /** Circle background when showing initials. */
  background?: string;
};

const DIMENSION: Record<Size, { box: number; font: number }> = {
  sm: { box: 36, font: 13 },
  md: { box: 48, font: 16 },
  lg: { box: 64, font: 22 },
};

function toInitials(name?: string) {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * User/client avatar. Shows an image when available (via expo-image, with the
 * app's caching/decoding), otherwise falls back to initials on a coloured
 * circle. Replaces the hand-built "FM" avatar in the header.
 */
export function AppAvatar({
  source,
  name,
  initials,
  size = 'md',
  background = Palette.blueAvatar,
}: AppAvatarProps) {
  const d = DIMENSION[size];
  const radius = d.box / 2;
  const label = initials ?? toInitials(name);

  if (source) {
    return (
      <Image
        source={typeof source === 'string' ? { uri: source } : source}
        style={{ width: d.box, height: d.box, borderRadius: radius }}
        contentFit="cover"
        transition={150}
      />
    );
  }

  return (
    <View
      style={[styles.fallback, { width: d.box, height: d.box, borderRadius: radius, backgroundColor: background }]}>
      <AppText style={[styles.initials, { fontSize: d.font }]} color="inverse">
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.wide,
  },
});
