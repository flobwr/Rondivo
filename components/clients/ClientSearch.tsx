import { SearchField } from '@/components/ui/SearchField';
import { type PaletteShape } from '@/theme';

type ClientSearchProps = {
  value: string;
  onChangeText: (text: string) => void;
  onFilterPress: () => void;
  filtersActive?: boolean;
  /** Accepted for compatibility — the DS field reads the theme itself. */
  palette?: PaletteShape;
};

/**
 * Compatibility shim — the Clients search is the DS `SearchField`
 * (inset well, focus ring, filter well with active dot).
 */
export function ClientSearch({ value, onChangeText, onFilterPress, filtersActive }: ClientSearchProps) {
  return (
    <SearchField
      value={value}
      onChangeText={onChangeText}
      placeholder="Rechercher un client…"
      onFilterPress={onFilterPress}
      filtersActive={filtersActive}
    />
  );
}
