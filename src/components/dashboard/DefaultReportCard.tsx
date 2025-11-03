import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, TrendingUp, AlertCircle } from 'lucide-react';
import { type DefaultReportSummary } from '@/api/client';

interface DefaultReportCardProps {
  report: DefaultReportSummary;
  onViewReport: (analysisRunId: string) => void;
  onToggleFavorite: (queryGroupId: string) => void;
}

/**
 * Get the model agreement indicator color and label based on score.
 * - High agreement (0.9-1.0): Green
 * - Moderate agreement (0.7-0.89): Yellow/Amber
 * - Low agreement (below 0.7): Red/Warning
 */
function getAgreementIndicator(score: number): {
  color: 'success' | 'warning' | 'destructive';
  label: string;
  className: string;
} {
  if (score >= 0.9) {
    return {
      color: 'success',
      label: 'High Agreement',
      className: 'bg-green-100 text-green-800 border-green-200',
    };
  } else if (score >= 0.7) {
    return {
      color: 'warning',
      label: 'Moderate Agreement',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
  } else {
    return {
      color: 'destructive',
      label: 'Low Agreement',
      className: 'bg-red-100 text-red-800 border-red-200',
    };
  }
}

/**
 * Format a date string to a relative time (e.g., "2 days ago").
 */
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays === 0) {
    if (diffInHours === 0) {
      return 'Just now';
    }
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
}

export function DefaultReportCard({
  report,
  onViewReport,
  onToggleFavorite,
}: DefaultReportCardProps) {
  const agreementIndicator = getAgreementIndicator(report.modelAgreementScore);

  return (
    <Card className="relative hover:shadow-lg transition-shadow duration-200 group">
      {/* Favorite Star Icon */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(report.queryGroupId);
        }}
        className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted transition-colors z-10"
        aria-label="Remove from favorites"
      >
        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
      </button>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg pr-8">{report.companyName}</CardTitle>
        <CardDescription className="text-sm">{report.industry}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Overall SOV - Most Prominent */}
        <div className="text-center py-2">
          <div className="text-4xl font-bold text-primary">{report.overallSOV.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">Overall Share of Voice</p>
        </div>

        {/* Model Comparison - Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          {/* Claude SOV */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Claude</span>
              <span className="font-semibold">{report.claudeSOV.toFixed(1)}%</span>
            </div>
            <Progress value={report.claudeSOV} className="h-2 bg-muted" />
          </div>

          {/* GPT SOV */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">GPT</span>
              <span className="font-semibold">{report.gptSOV.toFixed(1)}%</span>
            </div>
            <Progress value={report.gptSOV} className="h-2 bg-muted" />
          </div>
        </div>

        {/* Model Agreement Indicator */}
        <div className="flex items-center justify-center">
          <Badge variant="outline" className={`${agreementIndicator.className} border`}>
            {agreementIndicator.label} ({(report.modelAgreementScore * 100).toFixed(0)}%)
          </Badge>
        </div>

        {/* Top Competitor */}
        {report.topCompetitor ? (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Top Competitor</p>
                <p className="text-sm font-semibold">{report.topCompetitor.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-destructive">
                {report.topCompetitor.sov.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {report.topCompetitor.sov > report.overallSOV ? 'Ahead' : 'Behind'}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">No competitors detected</p>
            </div>
          </div>
        )}

        {/* Last Run Timestamp */}
        <div className="text-center text-xs text-muted-foreground pt-2 border-t">
          Last updated {formatRelativeTime(report.lastRunAt)}
        </div>

        {/* View Report Button */}
        <Button
          onClick={() => onViewReport(report.analysisRunId)}
          className="w-full"
          variant="default"
        >
          View Report
        </Button>
      </CardContent>
    </Card>
  );
}
