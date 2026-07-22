import { Feather } from '@expo/vector-icons';
import { Animated, StyleSheet, View } from 'react-native';

import { Accent, AccentName, Palette, Radius, Spacing } from '@/constants/design';
import { useEntrance } from '@/hooks/use-entrance';
import { AppButton, AppButtonProps } from './app-button';
import { AppText } from './app-text';

type FeatherName = React.ComponentProps<typeof Feather>['name'];

export type AppEmptyStateProps = {
  icon: FeatherName;
  title: string;
  message?: string;
  accent?: AccentName;
  /** Neutral treatment (grey ring + border) — for errors rather than "empty". */
  tone?: 'accent' | 'neutral';
  /** Primary call-to-action. */
  action?: Pick<AppButtonProps, 'label' | 'onPress' | 'icon' | 'variant'>;
  /** Animate in on mount. Defaults to true. */
  animated?: boolean;
};

/**
 * The centred "nothing here yet" / error block: icon ring, title, message and
 * an optional CTA. Unifies the planning EmptyState, ErrorState, the Home
 * "C'est tout pour aujourd'hui" and the empty reminders card.
 */
export function AppEmptyState({
  icon,
  title,
  message,
  accent = 'blue',
  tone = 'accent',
  action,
  animated = true,
}: AppEmptyStateProps) {
  const { style: enterStyle } = useEntrance({ translateY: 12, fromScale: 1 });
  const a = Accent[accent];
  const neutral = tone === 'neutral';

  const body = (
    <>
      <View
        style={[
          styles.ring,
          { backgroundColor: neutral ? Palette.cardMuted : a.soft },
          neutral ? styles.ringBordered : null,
        ]}>
        <Feather name={icon} size={28} color={neutral ? Palette.textSecondary : a.solid} />
      </View>
      <AppText variant="title3">{title}</AppText>
      {message ? (
        <AppText variant="subhead" color="secondary" style={styles.message}>
          {message}
        </AppText>
      ) : null}
      {action ? (
        <View style={styles.action}>
          <AppButton
            label={action.label}
            onPress={action.onPress}
            icon={action.icon}
            variant={action.variant ?? 'primary'}
          />
        </View>
      ) : null}
    </>
  );

  if (!animated) {
    return <View style={styles.wrapper}>{body}</View>;
  }
  return <Animated.View style={[styles.wrapper, enterStyle]}>{body}</Animated.View>;
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: 64,
  },
  ring: {
    width: 72,
    height: 72,
    borderRadius: Radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  ringBordered: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Palette.border,
  },
  message: {
    textAlign: 'center',
    marginTop: 6,
    marginBottom: Spacing.section,
  },
  action: {
    alignItems: 'center',
  },
});
