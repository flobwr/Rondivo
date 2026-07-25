import { LayoutAnimation, Platform, UIManager } from 'react-native';

import { Motion } from '@/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * The app's one layout transition: short, opacity-only on create/delete, so a
 * recalculating form reads as instant rather than "animated".
 *
 * Every accordion, suggestion list and inline row across the app's forms goes
 * through this. The Clients form and the Appointment form used to each carry
 * their own identical copy — with the duration typed by hand in both, which is
 * exactly how two forms end up drifting apart.
 */
export const easeLayout = () =>
  LayoutAnimation.configureNext({
    duration: Motion.fast,
    update: { type: LayoutAnimation.Types.easeInEaseOut },
    create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
  });
