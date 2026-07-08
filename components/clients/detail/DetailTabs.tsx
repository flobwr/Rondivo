import { SegmentedTabs } from '@/components/ui/SegmentedTabs';

export type DetailTab = 'resume' | 'interventions' | 'documents' | 'finances' | 'notes';

export const TAB_ORDER: DetailTab[] = ['resume', 'interventions', 'documents', 'finances', 'notes'];

const TAB_LABELS: Record<DetailTab, string> = {
  resume: 'Résumé',
  interventions: 'Interventions',
  documents: 'Documents',
  finances: 'Finances',
  notes: 'Notes',
};

type Props = {
  active: DetailTab;
  onChange: (tab: DetailTab) => void;
};

export function DetailTabs({ active, onChange }: Props) {
  const tabs = TAB_ORDER.map((key) => ({ key, label: TAB_LABELS[key] }));
  return <SegmentedTabs tabs={tabs} active={active} onChange={onChange} />;
}
