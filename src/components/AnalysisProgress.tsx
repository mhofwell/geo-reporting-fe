import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, ChevronDown, ChevronUp, Activity, CheckCircle2, XCircle } from 'lucide-react';
import type { RunningAnalysis } from '@/hooks/useBackgroundAnalysis';
import { cn } from '@/lib/utils';

interface AnalysisProgressProps {
  analyses: RunningAnalysis[];
  onDismiss: (analysisId: string) => void;
}

export function AnalysisProgress({ analyses, onDismiss }: AnalysisProgressProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (analyses.length === 0) {
    return null;
  }

  const runningCount = analyses.filter((a) => a.status === 'running' || a.status === 'pending').length;
  const completedCount = analyses.filter((a) => a.status === 'completed').length;
  const failedCount = analyses.filter((a) => a.status === 'failed').length;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary animate-pulse" />
              <CardTitle className="text-base">
                Background Analyses
                {runningCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({runningCount} running)
                  </span>
                )}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 space-y-3 max-h-96 overflow-y-auto">
            {analyses.map((analysis) => (
              <div
                key={analysis.analysisId}
                className={cn(
                  'p-3 rounded-lg border transition-colors',
                  analysis.status === 'completed' && 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900',
                  analysis.status === 'failed' && 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900',
                  (analysis.status === 'running' || analysis.status === 'pending') && 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {analysis.status === 'completed' && (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      )}
                      {analysis.status === 'failed' && (
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      )}
                      {(analysis.status === 'running' || analysis.status === 'pending') && (
                        <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse flex-shrink-0" />
                      )}
                      <p className="text-sm font-medium truncate">
                        {analysis.reportName}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {analysis.companyName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(analysis.analysisId)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                {(analysis.status === 'running' || analysis.status === 'pending') && (
                  <>
                    <Progress value={analysis.progress} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {analysis.message} ({Math.round(analysis.progress)}%)
                    </p>
                  </>
                )}

                {analysis.status === 'completed' && (
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Analysis completed successfully
                  </p>
                )}

                {analysis.status === 'failed' && (
                  <p className="text-xs text-red-700 dark:text-red-300">
                    {analysis.message || 'Analysis failed'}
                  </p>
                )}
              </div>
            ))}

            {(completedCount > 0 || failedCount > 0) && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  {completedCount > 0 && `${completedCount} completed`}
                  {completedCount > 0 && failedCount > 0 && ' • '}
                  {failedCount > 0 && `${failedCount} failed`}
                </p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
