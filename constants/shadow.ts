import { Platform } from 'react-native';

import { Palette } from './design';

/**
 * Soft, subtle elevation used by the white cards (reminders, appointment).
 * Kept in one place so every card shares the exact same shadow.
 */
export const cardShadow = Platform.select({
  ios: {
    shadowColor: Palette.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  android: {
    elevation: 3,
  },
  default: {
    // react-native-web understands boxShadow
    boxShadow: '0px 8px 16px rgba(15, 23, 41, 0.06)',
  },
});
