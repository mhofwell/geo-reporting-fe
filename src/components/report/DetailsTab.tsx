import type { AnalysisResult } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DetailsTabProps {
  result: AnalysisResult;
}

export function DetailsTab({ result }: DetailsTabProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Analysis Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total Queries</p>
              <p className="text-2xl font-semibold">{result.totalQueries}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Brand Mentions</p>
              <p className="text-2xl font-semibold">{result.brandMentions}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Competitors Detected</p>
              <p className="text-2xl font-semibold">{result.competitorsDetected}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Execution Time</p>
              <p className="text-2xl font-semibold">{result.executionTime}s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Analysis Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm font-medium">Analysis ID</span>
            <span className="text-sm text-muted-foreground font-mono">{result.analysisId}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm font-medium">Company</span>
            <span className="text-sm text-muted-foreground">{result.company}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm font-medium">Industry</span>
            <span className="text-sm text-muted-foreground">{result.industry}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm font-medium">Share of Voice</span>
            <span className="text-sm text-muted-foreground">{result.shareOfVoice.toFixed(2)}%</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm font-medium">Visibility Gaps</span>
            <span className="text-sm text-muted-foreground">{result.visibilityGaps.length} queries</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
