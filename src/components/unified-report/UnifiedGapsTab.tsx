import { motion } from 'framer-motion';
import { AlertTriangle, Search, TrendingUp, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UnifiedReport } from '@/api/client';

interface UnifiedGapsTabProps {
  report: UnifiedReport;
}

/**
 * Generate mock visibility gaps based on report data
 * In production, this would come from the API with actual query-level gap analysis
 */
function generateGapAnalysis(report: UnifiedReport) {
  const { modelComparison } = report;

  // Mock gap data - in production this would come from the backend
  const gaps = [
    {
      query: `Best ${report.industry} tools for enterprise`,
      models: ['Claude', 'GPT-4'],
      competitors: [
        { name: modelComparison.claude.topCompetitors[0]?.name || 'Competitor A', position: 1, model: 'both' },
        { name: modelComparison.gpt.topCompetitors[1]?.name || 'Competitor B', position: 2, model: 'both' }
      ],
      priority: 'high',
      estimatedSOVImpact: 8.5
    },
    {
      query: `${report.industry} comparison guide`,
      models: ['GPT-4'],
      competitors: [
        { name: modelComparison.gpt.topCompetitors[0]?.name || 'Competitor A', position: 1, model: 'gpt' }
      ],
      priority: 'high',
      estimatedSOVImpact: 6.2
    },
    {
      query: `How to choose ${report.industry} solution`,
      models: ['Claude'],
      competitors: [
        { name: modelComparison.claude.topCompetitors[0]?.name || 'Competitor A', position: 1, model: 'claude' },
        { name: modelComparison.claude.topCompetitors[2]?.name || 'Competitor C', position: 3, model: 'claude' }
      ],
      priority: 'medium',
      estimatedSOVImpact: 5.1
    },
    {
      query: `${report.industry} for small business`,
      models: ['Claude', 'GPT-4'],
      competitors: [
        { name: modelComparison.gpt.topCompetitors[1]?.name || 'Competitor B', position: 1, model: 'both' }
      ],
      priority: 'medium',
      estimatedSOVImpact: 4.8
    },
    {
      query: `Top-rated ${report.industry} platforms 2025`,
      models: ['GPT-4'],
      competitors: [
        { name: modelComparison.gpt.topCompetitors[0]?.name || 'Competitor A', position: 1, model: 'gpt' },
        { name: modelComparison.gpt.topCompetitors[1]?.name || 'Competitor B', position: 2, model: 'gpt' }
      ],
      priority: 'high',
      estimatedSOVImpact: 7.3
    }
  ];

  return gaps.sort((a, b) => b.estimatedSOVImpact - a.estimatedSOVImpact);
}

export function UnifiedGapsTab({ report }: UnifiedGapsTabProps) {
  const gaps = generateGapAnalysis(report);
  const totalPotentialSOV = gaps.reduce((sum, gap) => sum + gap.estimatedSOVImpact, 0);

  const highPriorityGaps = gaps.filter(g => g.priority === 'high');
  const mediumPriorityGaps = gaps.filter(g => g.priority === 'medium');

  return (
    <div className="space-y-6">
      {/* Gap Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="bg-primary/5 border-primary/20">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription>
            <strong>Visibility Opportunity:</strong> We identified {gaps.length} queries where {report.companyName} is absent
            but competitors appear. Addressing these gaps could increase overall SOV by up to {totalPotentialSOV.toFixed(1)}%.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Gap Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Total Gaps</p>
              <Search className="h-4 w-4 text-primary" />
            </div>
            <p className="text-4xl font-bold text-primary">{gaps.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Queries missing brand presence</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">High Priority</p>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <p className="text-4xl font-bold text-red-600">{highPriorityGaps.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Immediate attention required</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Potential SOV Gain</p>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-4xl font-bold text-green-600">+{totalPotentialSOV.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground mt-1">If all gaps addressed</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gap Breakdown by Priority */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Visibility Gaps by Priority</CardTitle>
            <CardDescription>Queries where competitors appear but {report.companyName} is absent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* High Priority Gaps */}
            {highPriorityGaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="text-lg font-semibold">High Priority Gaps</h3>
                  <Badge variant="secondary" className="bg-red-500/10 text-red-700 border-red-500/20">
                    {highPriorityGaps.length} gaps
                  </Badge>
                </div>
                <div className="space-y-4">
                  {highPriorityGaps.map((gap, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="border border-red-500/20 bg-red-500/5 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Search className="h-4 w-4 text-red-600" />
                            <h4 className="font-semibold">{gap.query}</h4>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-muted-foreground">Affected Models:</span>
                            {gap.models.map((model, midx) => (
                              <Badge
                                key={midx}
                                variant="secondary"
                                className={`text-xs ${
                                  model === 'Claude'
                                    ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                                    : 'bg-green-500/10 text-green-700 border-green-500/20'
                                }`}
                              >
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600">
                            +{gap.estimatedSOVImpact.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Est. SOV Impact</p>
                        </div>
                      </div>

                      <div className="border-t border-red-500/20 pt-3 mt-3">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Competitors appearing:</p>
                        <div className="flex flex-wrap gap-2">
                          {gap.competitors.map((comp, cidx) => (
                            <div key={cidx} className="flex items-center gap-2 bg-muted/30 rounded px-3 py-1">
                              <span className="text-xs font-bold text-red-600">#{comp.position}</span>
                              <span className="text-sm font-medium">{comp.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-muted/50 rounded">
                        <p className="text-xs">
                          <Target className="h-3 w-3 inline mr-1 text-primary" />
                          <strong>Recommendation:</strong> Create comprehensive content addressing this query.
                          Focus on unique value propositions and expertise signals that competitors may be missing.
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Medium Priority Gaps */}
            {mediumPriorityGaps.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">Medium Priority Gaps</h3>
                  <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                    {mediumPriorityGaps.length} gaps
                  </Badge>
                </div>
                <div className="space-y-4">
                  {mediumPriorityGaps.map((gap, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: (highPriorityGaps.length + idx) * 0.05 }}
                      className="border border-yellow-500/20 bg-yellow-500/5 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Search className="h-4 w-4 text-yellow-600" />
                            <h4 className="font-semibold">{gap.query}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Affected Models:</span>
                            {gap.models.map((model, midx) => (
                              <Badge
                                key={midx}
                                variant="secondary"
                                className={`text-xs ${
                                  model === 'Claude'
                                    ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                                    : 'bg-green-500/10 text-green-700 border-green-500/20'
                                }`}
                              >
                                {model}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-yellow-600">
                            +{gap.estimatedSOVImpact.toFixed(1)}%
                          </div>
                          <p className="text-xs text-muted-foreground">Est. SOV Impact</p>
                        </div>
                      </div>

                      <div className="border-t border-yellow-500/20 pt-3 mt-3">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Competitors appearing:</p>
                        <div className="flex flex-wrap gap-2">
                          {gap.competitors.map((comp, cidx) => (
                            <div key={cidx} className="flex items-center gap-2 bg-muted/30 rounded px-3 py-1">
                              <span className="text-xs font-bold text-yellow-600">#{comp.position}</span>
                              <span className="text-sm font-medium">{comp.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Gap Closure Action Plan</CardTitle>
            <CardDescription>Strategic approach to improve visibility</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-card rounded-lg border border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Phase 1: Quick Wins
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Address top 3 high-priority gaps</li>
                  <li>• Create targeted content for each query</li>
                  <li>• Optimize for both Claude and GPT-4 preferences</li>
                  <li>• Expected SOV gain: +{highPriorityGaps.slice(0, 3).reduce((sum, g) => sum + g.estimatedSOVImpact, 0).toFixed(1)}%</li>
                </ul>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Phase 2: Strategic Expansion
                </h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Address remaining high-priority gaps</li>
                  <li>• Target medium-priority opportunities</li>
                  <li>• Build comprehensive resource library</li>
                  <li>• Expected total SOV gain: +{totalPotentialSOV.toFixed(1)}%</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
