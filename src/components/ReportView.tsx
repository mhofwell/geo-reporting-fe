import type { AnalysisResult } from '../api/client';
import { ReportTabs } from './report/ReportTabs';
import { OverviewTab } from './report/OverviewTab';
import { CompetitionTab } from './report/CompetitionTab';
import { InsightsTab } from './report/InsightsTab';
import { GapsTab } from './report/GapsTab';
import { DetailsTab } from './report/DetailsTab';
import { useReportViewStore } from '@/store/reportViewStore';

interface ReportViewProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
}

export function ReportView({ result }: ReportViewProps) {
  const { activeTab } = useReportViewStore();

  return (
    <div className="space-y-0 max-w-6xl">
      <ReportTabs />

      <div className="mt-6">
        {activeTab === 'overview' && <OverviewTab result={result} />}
        {activeTab === 'competition' && <CompetitionTab result={result} />}
        {activeTab === 'insights' && <InsightsTab result={result} />}
        {activeTab === 'gaps' && <GapsTab result={result} />}
        {activeTab === 'details' && <DetailsTab result={result} />}
      </div>

      {/* Footer Stats */}
      <div className="text-center text-sm text-muted-foreground pt-6">
        <p>Analysis completed in {result.executionTime}s</p>
        <p className="mt-1">
          Detected {result.competitorsDetected} competitor mentions across {result.totalQueries} queries
        </p>
      </div>
    </div>
  );
}
