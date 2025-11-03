import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Download, Plus, ArrowRight, BarChart3, GitCompare, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { getUnifiedReport, type UnifiedReport } from '@/api/client';
import { ModelComparisonCard } from './unified-report/ModelComparisonCard';
import { UnifiedOverviewTab } from './unified-report/UnifiedOverviewTab';
import { ModelBreakdownTab } from './unified-report/ModelBreakdownTab';
import { UnifiedCompetitionTab } from './unified-report/UnifiedCompetitionTab';
import { UnifiedInsightsTab } from './unified-report/UnifiedInsightsTab';
import { UnifiedGapsTab } from './unified-report/UnifiedGapsTab';

interface UnifiedReportViewProps {
  analysisRunId: string;
  onNavigateToModel: (modelName: 'CLAUDE_SONNET_4' | 'GPT_4') => void;
  onToggleFavorite?: (queryGroupId: string) => void;
  onNewAnalysis?: () => void;
}

type UnifiedReportTab = 'overview' | 'model-breakdown' | 'competition' | 'insights' | 'gaps';

interface Tab {
  id: UnifiedReportTab;
  label: string;
  icon: typeof BarChart3;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    description: 'Executive summary and key metrics'
  },
  {
    id: 'model-breakdown',
    label: 'Model Breakdown',
    icon: GitCompare,
    description: 'Detailed model comparison'
  },
  {
    id: 'competition',
    label: 'Competition',
    icon: Target,
    description: 'Cross-model competitive analysis'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Lightbulb,
    description: 'Strategic recommendations'
  },
  {
    id: 'gaps',
    label: 'Gaps',
    icon: AlertTriangle,
    description: 'Visibility opportunities'
  }
];

export function UnifiedReportView({
  analysisRunId,
  onNavigateToModel,
  onToggleFavorite,
  onNewAnalysis
}: UnifiedReportViewProps) {
  const [report, setReport] = useState<UnifiedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<UnifiedReportTab>('overview');
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUnifiedReport(analysisRunId);
        setReport(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load unified report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [analysisRunId]);

  const handleToggleFavorite = () => {
    if (report && onToggleFavorite) {
      onToggleFavorite(report.queryGroupId);
      setIsFavorite(!isFavorite);
    }
  };

  const handleDownload = () => {
    // TODO: Implement download functionality
    console.log('Download report:', analysisRunId);
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Error state
  if (error || !report) {
    return (
      <div className="space-y-6 max-w-6xl">
        <Alert variant="destructive">
          <AlertDescription>
            {error || 'Failed to load report data'}
          </AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-0 max-w-6xl">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-4xl">{report.companyName}</CardTitle>
                  <button
                    onClick={handleToggleFavorite}
                    className="transition-colors hover:scale-110"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Star
                      className={`h-6 w-6 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                    />
                  </button>
                </div>
                <CardDescription className="text-lg">{report.industry}</CardDescription>

                {/* Model Badges */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-muted-foreground">Models analyzed:</span>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                    Claude Sonnet 4
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">
                    GPT-4
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mt-3">
                  Last analyzed: {new Date(report.lastRunAt).toLocaleString()}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToModel('CLAUDE_SONNET_4')}
                  >
                    View Claude Only
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigateToModel('GPT_4')}
                  >
                    View GPT Only
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {onNewAnalysis && (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={onNewAnalysis}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Report
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Model Comparison Card - Prominent Feature */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-6"
      >
        <ModelComparisonCard report={report} />
      </motion.div>

      {/* Tabs Navigation */}
      <div className="border-b border-border bg-card/50 mt-6">
        <div className="flex space-x-1 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  relative px-4 py-3 text-sm font-medium transition-colors
                  flex items-center gap-2
                  ${isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                title={tab.description}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeUnifiedTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 30
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && <UnifiedOverviewTab report={report} />}
        {activeTab === 'model-breakdown' && <ModelBreakdownTab report={report} />}
        {activeTab === 'competition' && <UnifiedCompetitionTab report={report} />}
        {activeTab === 'insights' && <UnifiedInsightsTab report={report} />}
        {activeTab === 'gaps' && <UnifiedGapsTab report={report} />}
      </div>

      {/* Footer Stats */}
      <div className="text-center text-sm text-muted-foreground pt-6 pb-4">
        <p>Cross-model analysis combining insights from Claude Sonnet 4 and GPT-4</p>
        <p className="mt-1">
          Overall SOV: {report.overallMetrics.overallSOV.toFixed(1)}% |
          Model Agreement: {(report.overallMetrics.modelAgreementScore * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
}
