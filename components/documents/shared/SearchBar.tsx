import { SearchField } from '@/components/ui/SearchField';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onFilterPress?: () => void;
  filtersActive?: boolean;
};

/**
 * Compatibility shim — every call site now renders the DS `SearchField`
 * (inset well, focus ring, filter well). New screens should import
 * `SearchField` from `@/components/ui` directly.
 */
export function SearchBar(props: Props) {
  return <SearchField {...props} />;
}
