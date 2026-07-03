import { LayoutAnimation, Platform, UIManager } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Same 180ms opacity-based easing as the appointment form — every accordion,
// suggestion list and inline row across the app's forms should feel identical.
export const easeLayout = () =>
  LayoutAnimation.configureNext({
    duration: 180,
    update: { type: LayoutAnimation.Types.easeInEaseOut },
    create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
  });

export const PAYMENT_METHODS = ['Espèces', 'Carte bancaire', 'Virement', 'Chèque'];
