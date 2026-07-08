import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

// Canonical photo-source picker — shared by the Documents/Photos module and
// the live Intervention screen, so there is exactly one permissions/quality
// policy for "add a photo" across the app.
const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  quality: 0.8,
  allowsEditing: false,
};

async function launch(result: ImagePicker.ImagePickerResult): Promise<string | null> {
  if (result.canceled || result.assets.length === 0) return null;
  return result.assets[0].uri;
}

// Camera capture isn't available on Expo web — callers should hide/disable
// the "Prendre une photo" option there rather than call this.
export async function pickFromCamera(): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) return null;
  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  return launch(result);
}

export async function pickFromLibrary(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return null;
  const result = await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS);
  return launch(result);
}
