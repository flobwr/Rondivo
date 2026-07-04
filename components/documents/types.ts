export type InvoiceStatus = 'draft' | 'sent' | 'overdue' | 'paid';

export type Invoice = {
  id: string;
  reference: string;
  client: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  daysOverdue?: number;
};

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'expired';

export type Quote = {
  id: string;
  reference: string;
  client: string;
  amount: number;
  status: QuoteStatus;
  validUntil: string;
  daysUntilExpiry?: number;
};

export type ReportStatus = 'toComplete' | 'inProgress' | 'completed' | 'pdfGenerated';

export type Report = {
  id: string;
  title: string;
  client: string;
  date: string;
  status: ReportStatus;
};

export type ContractStatus = 'draft' | 'pendingSignature' | 'signed' | 'expired';

export type Contract = {
  id: string;
  title: string;
  client: string;
  startDate: string;
  status: ContractStatus;
  daysUntilExpiry?: number;
};

export type PhotoPhase = 'before' | 'during' | 'after';

export type InterventionPhoto = {
  id: string;
  phase: PhotoPhase;
  uri: string;
};

export type PhotoIntervention = {
  id: string;
  title: string;
  client: string;
  date: string;
  photos: InterventionPhoto[];
};

export type ImportedDocType = 'pdf' | 'image' | 'word' | 'excel' | 'other';

export type ImportedDocument = {
  id: string;
  name: string;
  date: string;
  size: string;
  type: ImportedDocType;
  client?: string;
  linkedTo?: string;
};

export type SearchResultType =
  | 'client'
  | 'invoice'
  | 'quote'
  | 'report'
  | 'contract'
  | 'importedDoc'
  | 'photo'
  | 'intervention';

export type SearchResult = {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle: string;
  route?: string;
};

export type ActionItem = {
  id: string;
  type: 'invoice' | 'quote' | 'report' | 'contract';
  title: string;
  subtitle: string;
  urgency: 'high' | 'medium' | 'low';
};

export type InvoiceSummary = {
  totalToCollect: number;
  unpaidCount: number;
  overdueAmount: number;
  overdueCount: number;
};

export type QuoteSummary = {
  potentialAmount: number;
  pendingCount: number;
  acceptanceRate: number;
  averageValue: number;
};

export type ContractSummary = {
  activeCount: number;
  expiringSoonCount: number;
  draftCount: number;
};

export type ReportSummary = {
  toCompleteCount: number;
  completedTodayCount: number;
  pdfGeneratedCount: number;
};
