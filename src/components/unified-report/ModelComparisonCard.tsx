import { motion } from 'framer-motion';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UnifiedReport } from '@/api/client';

interface ModelComparisonCardProps {
  report: UnifiedReport;
}

/**
 * Calculates the divergence level between two SOV values
 * Returns: 'low' (<10%), 'moderate' (10-20%), 'high' (>20%)
 */
function calculateDivergence(sov1: number, sov2: number): 'low' | 'moderate' | 'high' {
  const diff = Math.abs(sov1 - sov2);
  if (diff < 10) return 'low';
  if (diff < 20) return 'moderate';
  return 'high';
}

/**
 * Get color scheme based on divergence level
 */
function getDivergenceColor(level: 'low' | 'moderate' | 'high') {
  switch (level) {
    case 'low':
      return 'text-green-600 bg-green-500/10 border-green-500/20';
    case 'moderate':
      return 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20';
    case 'high':
      return 'text-red-600 bg-red-500/10 border-red-500/20';
  }
}

export function ModelComparisonCard({ report }: ModelComparisonCardProps) {
  const { overallMetrics, modelComparison } = report;
  const divergenceLevel = calculateDivergence(
    overallMetrics.claudeSOV,
    overallMetrics.gptSOV
  );
  const agreementScore = overallMetrics.modelAgreementScore;

  // Calculate percentage difference
  const sovDifference = Math.abs(overallMetrics.claudeSOV - overallMetrics.gptSOV);
  const mentionRateDiff = Math.abs(
    modelComparison.claude.mentionRate - modelComparison.gpt.mentionRate
  );

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-card to-card border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              Model Comparison Overview
              {agreementScore > 0.8 && (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              Comparing Claude Sonnet 4 vs GPT-4 performance
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className={`text-sm ${getDivergenceColor(divergenceLevel)}`}
          >
            {divergenceLevel === 'low' && 'High Agreement'}
            {divergenceLevel === 'moderate' && 'Moderate Agreement'}
            {divergenceLevel === 'high' && 'Significant Divergence'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall SOV Comparison */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            OVERALL SHARE OF VOICE
          </h3>
          <div className="text-5xl font-bold text-primary mb-2">
            {overallMetrics.overallSOV.toFixed(1)}%
          </div>
          <p className="text-sm text-muted-foreground">
            Combined average across both models
          </p>
        </div>

        {/* Model Bars Side-by-Side */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground">
            MODEL-SPECIFIC SOV
          </h3>

          {/* Claude Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Claude Sonnet 4</span>
              <span className="text-lg font-bold text-blue-600">
                {overallMetrics.claudeSOV.toFixed(1)}%
              </span>
            </div>
            <div className="h-8 bg-muted rounded-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-end pr-3"
                initial={{ width: 0 }}
                animate={{ width: `${overallMetrics.claudeSOV}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {overallMetrics.claudeSOV > 15 && (
                  <span className="text-xs font-semibold text-white">
                    {overallMetrics.claudeSOV.toFixed(1)}%
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          {/* GPT Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">GPT-4</span>
              <span className="text-lg font-bold text-green-600">
                {overallMetrics.gptSOV.toFixed(1)}%
              </span>
            </div>
            <div className="h-8 bg-muted rounded-lg overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-end pr-3"
                initial={{ width: 0 }}
                animate={{ width: `${overallMetrics.gptSOV}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              >
                {overallMetrics.gptSOV > 15 && (
                  <span className="text-xs font-semibold text-white">
                    {overallMetrics.gptSOV.toFixed(1)}%
                  </span>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
          {/* Model Agreement Score */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {(agreementScore * 100).toFixed(0)}%
            </div>
            <p className="text-xs text-muted-foreground">Model Agreement</p>
            <div className="mt-2">
              {agreementScore > 0.8 ? (
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                  High Consensus
                </Badge>
              ) : agreementScore > 0.6 ? (
                <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                  Moderate Alignment
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs bg-red-500/10 text-red-700 border-red-500/20">
                  Low Consensus
                </Badge>
              )}
            </div>
          </div>

          {/* Mention Rate Comparison */}
          <div className="text-center">
            <div className="text-3xl font-bold text-muted-foreground mb-1">
              {((modelComparison.claude.mentionRate + modelComparison.gpt.mentionRate) / 2).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Avg Mention Rate</p>
            <p className="text-xs text-muted-foreground mt-1">
              C: {modelComparison.claude.mentionRate.toFixed(1)}% | G: {modelComparison.gpt.mentionRate.toFixed(1)}%
            </p>
          </div>

          {/* Position Comparison */}
          <div className="text-center">
            <div className="text-3xl font-bold text-muted-foreground mb-1">
              {((modelComparison.claude.avgPosition + modelComparison.gpt.avgPosition) / 2).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">Avg Position</p>
            <p className="text-xs text-muted-foreground mt-1">
              C: {modelComparison.claude.avgPosition.toFixed(1)} | G: {modelComparison.gpt.avgPosition.toFixed(1)}
            </p>
          </div>
        </div>

        {/* Divergence Alerts */}
        {sovDifference > 15 && (
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>Significant SOV Divergence:</strong> Models show {sovDifference.toFixed(1)}% difference in share of voice.
              {overallMetrics.claudeSOV > overallMetrics.gptSOV
                ? ' Claude reports higher visibility than GPT-4.'
                : ' GPT-4 reports higher visibility than Claude.'}
            </AlertDescription>
          </Alert>
        )}

        {mentionRateDiff > 10 && (
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <TrendingUp className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>Mention Rate Variance:</strong> {mentionRateDiff.toFixed(1)}% difference in mention rates across models.
            </AlertDescription>
          </Alert>
        )}

        {/* Model Agreement Insight */}
        {agreementScore > 0.8 && (
          <Alert className="bg-green-500/10 border-green-500/20">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900 dark:text-green-100">
              <strong>Strong Model Consensus:</strong> Both models show highly consistent results,
              indicating reliable brand visibility metrics across AI platforms.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
