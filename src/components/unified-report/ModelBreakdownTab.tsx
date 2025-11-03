import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UnifiedReport } from '@/api/client';

interface ModelBreakdownTabProps {
  report: UnifiedReport;
}

/**
 * Calculate if there's a significant difference between two values
 */
function hasSignificantDifference(value1: number, value2: number, threshold = 15): boolean {
  return Math.abs(value1 - value2) >= threshold;
}

/**
 * Find divergent competitors (appears in one model but not the other)
 */
function findDivergentCompetitors(
  claudeCompetitors: Array<{ name: string; sov: number }>,
  gptCompetitors: Array<{ name: string; sov: number }>
) {
  const claudeNames = new Set(claudeCompetitors.map(c => c.name));
  const gptNames = new Set(gptCompetitors.map(c => c.name));

  const claudeOnly = claudeCompetitors.filter(c => !gptNames.has(c.name));
  const gptOnly = gptCompetitors.filter(c => !claudeNames.has(c.name));

  return { claudeOnly, gptOnly };
}

export function ModelBreakdownTab({ report }: ModelBreakdownTabProps) {
  const { overallMetrics, modelComparison } = report;

  // Calculate divergences
  const sovDiverges = hasSignificantDifference(overallMetrics.claudeSOV, overallMetrics.gptSOV);
  const mentionRateDiverges = hasSignificantDifference(
    modelComparison.claude.mentionRate,
    modelComparison.gpt.mentionRate
  );
  const positionDiverges = hasSignificantDifference(
    modelComparison.claude.avgPosition * 10, // Scale up for comparison
    modelComparison.gpt.avgPosition * 10,
    5 // 0.5 position difference threshold
  );

  const { claudeOnly, gptOnly } = findDivergentCompetitors(
    modelComparison.claude.topCompetitors.slice(0, 5),
    modelComparison.gpt.topCompetitors.slice(0, 5)
  );

  const hasDivergences = sovDiverges || mentionRateDiverges || positionDiverges || claudeOnly.length > 0 || gptOnly.length > 0;

  return (
    <div className="space-y-6">
      {/* Divergence Summary Alert */}
      {hasDivergences && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert className="bg-yellow-500/10 border-yellow-500/20">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-sm text-yellow-900 dark:text-yellow-100">
              <strong>Model Divergence Detected:</strong> Significant differences found between Claude and GPT-4.
              Review the breakdown below for platform-specific optimization opportunities.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Split-Screen Model Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Model Performance Comparison</CardTitle>
            <CardDescription>Side-by-side analysis of Claude Sonnet 4 vs GPT-4</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Claude Column */}
              <div className={`p-6 rounded-lg border-2 ${sovDiverges ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-blue-500/5 border-blue-500/20'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Claude Sonnet 4</h3>
                  <Badge className="bg-blue-500 text-white">Model A</Badge>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Share of Voice</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-blue-600">
                        {overallMetrics.claudeSOV.toFixed(1)}%
                      </p>
                      {sovDiverges && (
                        <div className="flex items-center gap-1 text-xs">
                          {overallMetrics.claudeSOV > overallMetrics.gptSOV ? (
                            <>
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="text-green-600">+{(overallMetrics.claudeSOV - overallMetrics.gptSOV).toFixed(1)}%</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3 text-red-600" />
                              <span className="text-red-600">{(overallMetrics.claudeSOV - overallMetrics.gptSOV).toFixed(1)}%</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Mention Rate</p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {modelComparison.claude.mentionRate.toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Average Position</p>
                    <p className="text-2xl font-semibold text-blue-600">
                      {modelComparison.claude.avgPosition.toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* Top Competitors */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">TOP 3 COMPETITORS</p>
                  <div className="space-y-2">
                    {modelComparison.claude.topCompetitors.slice(0, 3).map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{comp.name}</span>
                        <span className="text-blue-600 font-semibold">{comp.sov.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Attributes */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">TOP ATTRIBUTES</p>
                  <div className="flex flex-wrap gap-1">
                    {modelComparison.claude.topAttributes.slice(0, 3).map((attr, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* GPT Column */}
              <div className={`p-6 rounded-lg border-2 ${sovDiverges ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">GPT-4</h3>
                  <Badge className="bg-green-500 text-white">Model B</Badge>
                </div>

                {/* Metrics */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Share of Voice</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-green-600">
                        {overallMetrics.gptSOV.toFixed(1)}%
                      </p>
                      {sovDiverges && (
                        <div className="flex items-center gap-1 text-xs">
                          {overallMetrics.gptSOV > overallMetrics.claudeSOV ? (
                            <>
                              <TrendingUp className="h-3 w-3 text-green-600" />
                              <span className="text-green-600">+{(overallMetrics.gptSOV - overallMetrics.claudeSOV).toFixed(1)}%</span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3 text-red-600" />
                              <span className="text-red-600">{(overallMetrics.gptSOV - overallMetrics.claudeSOV).toFixed(1)}%</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Mention Rate</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {modelComparison.gpt.mentionRate.toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Average Position</p>
                    <p className="text-2xl font-semibold text-green-600">
                      {modelComparison.gpt.avgPosition.toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* Top Competitors */}
                <div className="mt-6 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">TOP 3 COMPETITORS</p>
                  <div className="space-y-2">
                    {modelComparison.gpt.topCompetitors.slice(0, 3).map((comp, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{comp.name}</span>
                        <span className="text-green-600 font-semibold">{comp.sov.toFixed(1)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Attributes */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">TOP ATTRIBUTES</p>
                  <div className="flex flex-wrap gap-1">
                    {modelComparison.gpt.topAttributes.slice(0, 3).map((attr, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {attr}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Divergence Analysis */}
      {hasDivergences && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Divergence Analysis</CardTitle>
              <CardDescription>Key differences between model outputs requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sovDiverges && (
                <Alert className="bg-yellow-500/10 border-yellow-500/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm">
                    <strong>SOV Variance:</strong>{' '}
                    {overallMetrics.claudeSOV > overallMetrics.gptSOV
                      ? `Claude shows ${(overallMetrics.claudeSOV - overallMetrics.gptSOV).toFixed(1)}% higher SOV than GPT-4`
                      : `GPT-4 shows ${(overallMetrics.gptSOV - overallMetrics.claudeSOV).toFixed(1)}% higher SOV than Claude`}
                    . Consider platform-specific content optimization.
                  </AlertDescription>
                </Alert>
              )}

              {mentionRateDiverges && (
                <Alert className="bg-yellow-500/10 border-yellow-500/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm">
                    <strong>Mention Rate Difference:</strong> Models show different brand mention frequencies.
                    {modelComparison.claude.mentionRate > modelComparison.gpt.mentionRate
                      ? ' Claude mentions your brand more consistently.'
                      : ' GPT-4 mentions your brand more consistently.'}
                  </AlertDescription>
                </Alert>
              )}

              {(claudeOnly.length > 0 || gptOnly.length > 0) && (
                <Alert className="bg-yellow-500/10 border-yellow-500/20">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-sm">
                    <strong>Competitor Detection Variance:</strong>
                    {claudeOnly.length > 0 && (
                      <div className="mt-2">
                        Claude uniquely identifies: {claudeOnly.map(c => c.name).join(', ')}
                      </div>
                    )}
                    {gptOnly.length > 0 && (
                      <div className="mt-2">
                        GPT-4 uniquely identifies: {gptOnly.map(c => c.name).join(', ')}
                      </div>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
