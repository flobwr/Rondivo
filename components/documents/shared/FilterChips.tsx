import { ChipRow } from '@/components/ui/ChipRow';

export type ChipDef = {
  key: string;
  label: string;
  count: number;
  color: string;
};

/**
 * Compatibility shim — the Documents filter strip is the DS `ChipRow`
 * (monochrome ink selection, status colours confined to the dots).
 */
export function FilterChips({
  defs,
  activeKey,
  onSelect,
}: {
  defs: ChipDef[];
  activeKey: string | null;
  onSelect: (key: string | null) => void;
}) {
  return (
    <ChipRow
      items={defs.map((def) => ({
        key: def.key,
        label: def.label,
        count: def.count,
        dotColor: def.key === 'all' ? undefined : def.color,
      }))}
      activeKey={activeKey}
      onSelect={onSelect}
    />
  );
}
