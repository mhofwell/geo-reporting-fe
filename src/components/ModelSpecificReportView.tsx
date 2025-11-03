import { useState, useEffect } from 'react';
import { Star, ArrowLeft, Download, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getModelReport, type ModelSpecificReport } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ReportTabs } from './report/ReportTabs';
import { OverviewTab } from './report/OverviewTab';
import { CompetitionTab } from './report/CompetitionTab';
import { InsightsTab } from './report/InsightsTab';
import { GapsTab } from './report/GapsTab';
import { DetailsTab } from './report/DetailsTab';
import { useReportViewStore } from '@/store/reportViewStore';
import { cn } from '@/lib/utils';

interface ModelSpecificReportViewProps {
  analysisRunId: string;
  modelName: 'CLAUDE_SONNET_4' | 'GPT_4';
  onNavigateToUnified: () => void;
  onNavigateToOtherModel: (modelName: 'CLAUDE_SONNET_4' | 'GPT_4') => void;
  onToggleFavorite?: (queryGroupId: string) => void;
  onNewAnalysis?: () => void;
  isFavorite?: boolean;
}

/**
 * ModelSpecificReportView displays analysis results filtered to a single AI model.
 *
 * This component shows model-specific performance metrics, insights, and competitive
 * analysis for either Claude or GPT-4. It reuses the existing report tab structure
 * but filters all data to show only the selected model's results.
 *
 * Key Features:
 * - Model-specific theming (blue for Claude, green for GPT)
 * - Prominent model badge in header
 * - Quick navigation to unified report or other model's report
 * - Reuses existing tab components (Overview, Competition, Insights, Gaps, Details)
 * - Favorite/unfavorite functionality
 */
export function ModelSpecificReportView({
  analysisRunId,
  modelName,
  onNavigateToUnified,
  onNavigateToOtherModel,
  onToggleFavorite,
  onNewAnalysis,
  isFavorite = false,
}: ModelSpecificReportViewProps) {
  const [report, setReport] = useState<ModelSpecificReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { activeTab } = useReportViewStore();

  // Model-specific theming
  const modelConfig = {
    CLAUDE_SONNET_4: {
      displayName: 'Claude Sonnet 4',
      shortName: 'Claude',
      color: 'blue',
      bgClass: 'bg-blue-500/10',
      borderClass: 'border-blue-500/20',
      textClass: 'text-blue-600',
      badgeClass: 'bg-blue-500 text-white',
      accentClass: 'bg-blue-500',
      otherModel: 'GPT_4' as const,
      otherModelName: 'GPT-4',
    },
    GPT_4: {
      displayName: 'GPT-4',
      shortName: 'GPT-4',
      color: 'green',
      bgClass: 'bg-green-500/10',
      borderClass: 'border-green-500/20',
      textClass: 'text-green-600',
      badgeClass: 'bg-green-500 text-white',
      accentClass: 'bg-green-500',
      otherModel: 'CLAUDE_SONNET_4' as const,
      otherModelName: 'Claude',
    },
  };

  const config = modelConfig[modelName];

  useEffect(() => {
    async function fetchReport() {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getModelReport(analysisRunId, modelName);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model-specific report');
        console.error('Error fetching model report:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReport();
  }, [analysisRunId, modelName]);

  const handleToggleFavorite = () => {
    if (report && onToggleFavorite) {
      onToggleFavorite(report.queryGroup.id);
    }
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download report for', modelName);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto p-6">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !report) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Failed to load report. Please try again.'}
          </AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-4">
          <Button onClick={onNavigateToUnified} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Unified Report
          </Button>
          {onNewAnalysis && (
            <Button onClick={onNewAnalysis}>Start New Analysis</Button>
          )}
        </div>
      </div>
    );
  }

  // Convert ModelSpecificReport to AnalysisResult format for existing tab components
  // This allows us to reuse all existing tab components without modification
  const analysisResult = {
    analysisId: report.analysisRunId,
    company: report.queryGroup.companyName,
    industry: report.queryGroup.industry,
    shareOfVoice: report.metrics.overallSOV,
    totalQueries: report.metrics.overallMentionRate * 100, // Approximate from mention rate
    brandMentions: Math.round(report.metrics.overallMentionRate * 100),
    competitorsDetected: report.metrics.topCompetitors.length,
    topCompetitors: report.metrics.topCompetitors.map(comp => ({
      name: comp.name,
      shareOfVoice: comp.avgSOV,
      mentionCount: comp.mentions,
    })),
    positionBreakdown: {
      first: 0, // These would need to come from the API
      second: 0,
      thirdOrLater: 0,
    },
    insights: [], // These would be in the report
    attributes: {
      unbranded: {
        pricing: {},
        skillLevel: {},
        features: {},
        limitations: {},
        sentiment: {},
      },
      branded: {
        pricing: {},
        skillLevel: {},
        features: {},
        limitations: {},
        sentiment: {},
      },
    },
    visibilityGaps: report.metrics.gaps.topGaps.map(query => ({
      query,
      competitors: [],
    })),
    sampleMentions: [],
    reportPath: '',
    executionTime: report.executionTimeMs / 1000,
  };

  return (
    <div className="space-y-0 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className={cn('p-6 border-b', config.bgClass, config.borderClass)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">
                {report.queryGroup.companyName}
              </h1>
              <Badge className={cn('text-base px-4 py-1', config.badgeClass)}>
                <Sparkles className="h-4 w-4 mr-2" />
                {config.displayName} Analysis
              </Badge>
              <button
                onClick={handleToggleFavorite}
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  className={cn(
                    'h-5 w-5',
                    isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
                  )}
                />
              </button>
            </div>
            <p className="text-muted-foreground">{report.queryGroup.industry}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={onNavigateToUnified} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Unified Report
            </Button>
            <Button
              onClick={() => onNavigateToOtherModel(config.otherModel)}
              variant="outline"
              size="sm"
            >
              View {config.otherModelName}
            </Button>
            <Button onClick={handleDownload} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {onNewAnalysis && (
              <Button onClick={onNewAnalysis} size="sm">
                <FileText className="h-4 w-4 mr-2" />
                New Report
              </Button>
            )}
          </div>
        </div>

        {/* Model-Specific Alert */}
        <Alert className={cn('mt-4', config.bgClass, config.borderClass)}>
          <AlertDescription className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className={cn('font-medium', config.textClass)}>
                Showing results from {config.displayName} only
              </span>
            </span>
            <Button
              onClick={onNavigateToUnified}
              variant="link"
              size="sm"
              className={config.textClass}
            >
              Compare with {config.otherModelName}
            </Button>
          </AlertDescription>
        </Alert>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card className="bg-card/80 border-border">
            <CardHeader className="pb-3">
              <CardDescription>Share of Voice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn('text-3xl font-bold', config.textClass)}>
                {report.metrics.overallSOV.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border">
            <CardHeader className="pb-3">
              <CardDescription>Mention Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={cn('text-3xl font-bold', config.textClass)}>
                {(report.metrics.overallMentionRate * 100).toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border">
            <CardHeader className="pb-3">
              <CardDescription>Top Competitor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {report.metrics.topCompetitors[0]?.name || 'None'}
              </div>
              {report.metrics.topCompetitors[0] && (
                <p className="text-sm text-muted-foreground mt-1">
                  {report.metrics.topCompetitors[0].avgSOV.toFixed(1)}% SOV
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border">
            <CardHeader className="pb-3">
              <CardDescription>Visibility Gaps</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {report.metrics.gaps.missingQueries}
              </div>
              <p className="text-sm text-muted-foreground mt-1">queries</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="relative">
        {/* Model indicator bar */}
        <motion.div
          className={cn('absolute top-0 left-0 right-0 h-1', config.accentClass)}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
        />

        <ReportTabs />
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && <OverviewTab result={analysisResult} />}
        {activeTab === 'competition' && <CompetitionTab result={analysisResult} />}
        {activeTab === 'insights' && <InsightsTab result={analysisResult} />}
        {activeTab === 'gaps' && <GapsTab result={analysisResult} />}
        {activeTab === 'details' && <DetailsTab result={analysisResult} />}
      </div>

      {/* Footer Stats */}
      <div className="text-center text-sm text-muted-foreground pb-6 px-6 border-t pt-6">
        <div className={cn('inline-flex items-center gap-2 mb-2', config.textClass)}>
          <Sparkles className="h-4 w-4" />
          <span className="font-medium">Powered by {config.displayName}</span>
        </div>
        <p className="text-muted-foreground">
          Analysis completed in {(report.executionTimeMs / 1000).toFixed(1)}s
        </p>
        <p className="mt-1 text-muted-foreground">
          Detected {report.metrics.topCompetitors.length} competitors across{' '}
          {report.metrics.gaps.missingQueries + Math.round(report.metrics.overallMentionRate * 100)} queries
        </p>
      </div>

      {/* Comparison CTA */}
      <div className={cn('p-6 border-t', config.bgClass, config.borderClass)}>
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-xl">Compare Model Performance</CardTitle>
            <CardDescription>
              See how {config.displayName} results compare to {config.otherModelName} and get a unified
              view of your brand visibility across all AI models.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={onNavigateToUnified} className={config.accentClass}>
              View Unified Report
            </Button>
            <Button onClick={() => onNavigateToOtherModel(config.otherModel)} variant="outline">
              View {config.otherModelName} Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
