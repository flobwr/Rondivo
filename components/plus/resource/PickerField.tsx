import { useState } from 'react';

import { ActionSheetMenu, type ActionSheetItem } from '@/components/documents/shared/ActionSheetMenu';
import { FormField } from '@/components/documents/shared/FormScaffold';
import { FeatherIconName } from '@/components/documents/types';

export type PickerOption = {
  key: string;
  label: string;
  icon: FeatherIconName;
  description?: string;
};

/**
 * A `FormField` selector row wired to an `ActionSheetMenu` — the one enum
 * picker used across Employés/Véhicules/Matériel forms (rôle, statut, type,
 * catégorie, état) so every "choose one of a few options" field behaves and
 * looks identical.
 */
export function PickerField({
  label,
  value,
  options,
  onSelect,
  sheetTitle,
}: {
  label: string;
  value: PickerOption | undefined;
  options: PickerOption[];
  onSelect: (key: string) => void;
  sheetTitle?: string;
}) {
  const [open, setOpen] = useState(false);

  const items: ActionSheetItem[] = options.map((option) => ({
    key: option.key,
    icon: option.icon,
    label: option.label,
    onPress: () => onSelect(option.key),
  }));

  return (
    <>
      <FormField
        label={label}
        value={value?.label}
        placeholder="Choisir"
        onPress={() => setOpen(true)}
        subtitle={value?.description}
      />
      <ActionSheetMenu visible={open} title={sheetTitle ?? label} items={items} onClose={() => setOpen(false)} />
    </>
  );
}
