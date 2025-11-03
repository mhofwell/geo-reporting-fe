import type { AnalysisResult } from '@/api/client';
import { ExecutiveSummary } from './ExecutiveSummary';
import { PerformanceScorecard } from './PerformanceScorecard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface OverviewTabProps {
  result: AnalysisResult;
}

export function OverviewTab({ result }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <ExecutiveSummary result={result} />
      <PerformanceScorecard result={result} />

      {/* Position Breakdown */}
      {result.brandMentions > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Position Distribution</CardTitle>
            <CardDescription>How often you appear in top positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {result.positionBreakdown.first}
                </div>
                <p className="text-sm text-muted-foreground">1st Position</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((result.positionBreakdown.first / result.brandMentions) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-center p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {result.positionBreakdown.second}
                </div>
                <p className="text-sm text-muted-foreground">2nd Position</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((result.positionBreakdown.second / result.brandMentions) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-center p-6 bg-muted/50 border border-border rounded-lg">
                <div className="text-4xl font-bold text-muted-foreground mb-2">
                  {result.positionBreakdown.thirdOrLater}
                </div>
                <p className="text-sm text-muted-foreground">3rd+ Position</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {((result.positionBreakdown.thirdOrLater / result.brandMentions) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
