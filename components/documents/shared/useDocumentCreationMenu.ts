import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { ActionSheetItem } from './ActionSheetMenu';

/**
 * The single "create a document" menu — shared by the Documents module's "+"
 * and the Home screen's "Nouveau document" card, so both open the exact same
 * sheet with the exact same items instead of two menus drifting apart.
 */
export function useDocumentCreationMenu() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const open = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setVisible(true);
  };

  const close = () => setVisible(false);

  const items: ActionSheetItem[] = [
    { key: 'devis', icon: 'edit-3', label: 'Nouveau devis', onPress: () => router.push('/devis/new' as never) },
    { key: 'facture', icon: 'file-text', label: 'Nouvelle facture', onPress: () => router.push('/facture/new' as never) },
    { key: 'contrat', icon: 'file', label: 'Nouveau contrat', onPress: () => router.push('/contrat/new' as never) },
    { key: 'rapport', icon: 'clipboard', label: 'Nouveau rapport', onPress: () => router.push('/rapport/new' as never) },
    { key: 'import', icon: 'upload', label: 'Importer un document', onPress: () => router.push('/documents-importes' as never) },
  ];

  return { visible, open, close, items };
}
