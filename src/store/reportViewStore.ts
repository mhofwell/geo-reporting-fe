import { create } from 'zustand';

export type ReportTab = 'overview' | 'competition' | 'insights' | 'gaps' | 'details';

interface ReportFilters {
  category?: string;
  competitor?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface ReportViewState {
  activeTab: ReportTab;
  filters: ReportFilters;
  expandedSections: string[];
  comparisonMode: boolean;
  comparisonReportId?: string;

  // Actions
  setActiveTab: (tab: ReportTab) => void;
  setFilters: (filters: Partial<ReportFilters>) => void;
  toggleSection: (sectionId: string) => void;
  clearFilters: () => void;
  setComparisonMode: (enabled: boolean, reportId?: string) => void;
}

export const useReportViewStore = create<ReportViewState>((set) => ({
  activeTab: 'overview',
  filters: {},
  expandedSections: [],
  comparisonMode: false,
  comparisonReportId: undefined,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    })),

  toggleSection: (sectionId) =>
    set((state) => ({
      expandedSections: state.expandedSections.includes(sectionId)
        ? state.expandedSections.filter(id => id !== sectionId)
        : [...state.expandedSections, sectionId]
    })),

  clearFilters: () => set({ filters: {} }),

  setComparisonMode: (enabled, reportId) =>
    set({
      comparisonMode: enabled,
      comparisonReportId: reportId
    }),
}));
