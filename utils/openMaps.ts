import { Linking, Platform } from 'react-native';

/** Opens the native Maps app (Apple/Google) at the given address — the platform's own app, not an in-app map. */
export function openMapsTo(address: string) {
  const query = encodeURIComponent(address);
  const url = Platform.select({
    ios: `maps://?daddr=${query}`,
    android: `geo:0,0?q=${query}`,
    default: `https://maps.google.com/?q=${query}`,
  });
  Linking.openURL(url);
}
