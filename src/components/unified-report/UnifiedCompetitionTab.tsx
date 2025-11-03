import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UnifiedReport } from '@/api/client';

interface UnifiedCompetitionTabProps {
  report: UnifiedReport;
}

/**
 * Merge and average competitor data from both models
 */
function mergeCompetitors(
  claudeCompetitors: Array<{ name: string; sov: number }>,
  gptCompetitors: Array<{ name: string; sov: number }>
) {
  const competitorMap = new Map<string, { claudeSOV?: number; gptSOV?: number }>();

  claudeCompetitors.forEach(comp => {
    competitorMap.set(comp.name, { claudeSOV: comp.sov });
  });

  gptCompetitors.forEach(comp => {
    const existing = competitorMap.get(comp.name);
    if (existing) {
      existing.gptSOV = comp.sov;
    } else {
      competitorMap.set(comp.name, { gptSOV: comp.sov });
    }
  });

  return Array.from(competitorMap.entries())
    .map(([name, data]) => ({
      name,
      claudeSOV: data.claudeSOV || 0,
      gptSOV: data.gptSOV || 0,
      overallSOV: ((data.claudeSOV || 0) + (data.gptSOV || 0)) / 2,
      difference: Math.abs((data.claudeSOV || 0) - (data.gptSOV || 0)),
      hasDisagreement: data.claudeSOV === undefined || data.gptSOV === undefined
    }))
    .sort((a, b) => b.overallSOV - a.overallSOV);
}

export function UnifiedCompetitionTab({ report }: UnifiedCompetitionTabProps) {
  const { companyName, modelComparison, overallMetrics } = report;
  const mergedCompetitors = mergeCompetitors(
    modelComparison.claude.topCompetitors,
    modelComparison.gpt.topCompetitors
  );

  // Prepare data for the comparison chart (top 5 competitors + brand)
  const chartData = [
    {
      name: companyName,
      claude: overallMetrics.claudeSOV,
      gpt: overallMetrics.gptSOV,
      isBrand: true
    },
    ...mergedCompetitors.slice(0, 5).map(comp => ({
      name: comp.name,
      claude: comp.claudeSOV,
      gpt: comp.gptSOV,
      isBrand: false
    }))
  ];

  return (
    <div className="space-y-6">
      {/* Competitive Landscape Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Competitive Landscape Comparison</CardTitle>
            <CardDescription>
              Share of Voice across Claude Sonnet 4 and GPT-4 for top competitors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  type="number"
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Share of Voice (%)', position: 'bottom', fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                />
                <Legend />
                <Bar
                  dataKey="claude"
                  name="Claude SOV"
                  fill="#3b82f6"
                  radius={[0, 8, 8, 0]}
                />
                <Bar
                  dataKey="gpt"
                  name="GPT SOV"
                  fill="#10b981"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Competitor Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Competitor Analysis</CardTitle>
            <CardDescription>Detailed cross-model competitor comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Competitor</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Overall SOV</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Claude SOV</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">GPT SOV</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Difference</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {/* Brand Row */}
                  <tr className="bg-primary/10 font-semibold">
                    <td className="py-3 px-4">{companyName}</td>
                    <td className="text-center py-3 px-4 text-primary">
                      {overallMetrics.overallSOV.toFixed(1)}%
                    </td>
                    <td className="text-center py-3 px-4 text-blue-600">
                      {overallMetrics.claudeSOV.toFixed(1)}%
                    </td>
                    <td className="text-center py-3 px-4 text-green-600">
                      {overallMetrics.gptSOV.toFixed(1)}%
                    </td>
                    <td className="text-center py-3 px-4 text-muted-foreground">
                      {Math.abs(overallMetrics.claudeSOV - overallMetrics.gptSOV).toFixed(1)}%
                    </td>
                    <td className="text-center py-3 px-4">
                      <Badge variant="default" className="text-xs">
                        Your Brand
                      </Badge>
                    </td>
                  </tr>

                  {/* Competitor Rows */}
                  {mergedCompetitors.map((comp, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-muted/30 ${comp.hasDisagreement ? 'bg-yellow-500/5' : ''}`}
                    >
                      <td className="py-3 px-4 font-medium">{comp.name}</td>
                      <td className="text-center py-3 px-4">
                        {comp.overallSOV.toFixed(1)}%
                      </td>
                      <td className="text-center py-3 px-4 text-blue-600">
                        {comp.claudeSOV > 0 ? `${comp.claudeSOV.toFixed(1)}%` : '-'}
                      </td>
                      <td className="text-center py-3 px-4 text-green-600">
                        {comp.gptSOV > 0 ? `${comp.gptSOV.toFixed(1)}%` : '-'}
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className={comp.difference > 10 ? 'text-yellow-600 font-semibold' : 'text-muted-foreground'}>
                          {comp.difference.toFixed(1)}%
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        {comp.hasDisagreement ? (
                          <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                            Divergent
                          </Badge>
                        ) : comp.difference > 10 ? (
                          <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-700 border-orange-500/20">
                            High Variance
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                            Aligned
                          </Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p>
                <strong>Divergent:</strong> Competitor appears in only one model&apos;s results.
                <strong className="ml-3">High Variance:</strong> &gt;10% difference in SOV between models.
                <strong className="ml-3">Aligned:</strong> Consistent across both models.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Gap Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Competitive Gap Analysis</CardTitle>
            <CardDescription>Key insights from cross-model competitive intelligence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mergedCompetitors.slice(0, 3).map((comp, idx) => (
              <div key={idx} className="border-l-4 border-muted pl-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{comp.name}</h3>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      Avg SOV: {comp.overallSOV.toFixed(1)}%
                    </Badge>
                    {comp.hasDisagreement && (
                      <Badge variant="secondary" className="text-xs bg-yellow-500/10 text-yellow-700 border-yellow-500/20">
                        Model-Specific
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">Claude SOV:</span>
                    <span className="font-semibold text-blue-600">
                      {comp.claudeSOV > 0 ? `${comp.claudeSOV.toFixed(1)}%` : 'Not detected'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">GPT SOV:</span>
                    <span className="font-semibold text-green-600">
                      {comp.gptSOV > 0 ? `${comp.gptSOV.toFixed(1)}%` : 'Not detected'}
                    </span>
                  </div>

                  {comp.hasDisagreement ? (
                    <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      <strong>Platform-Specific Detection:</strong> This competitor appears primarily in{' '}
                      {comp.claudeSOV > comp.gptSOV ? 'Claude' : 'GPT-4'} responses, suggesting platform-specific
                      competitive positioning opportunities.
                    </p>
                  ) : comp.difference > 10 ? (
                    <p className="text-orange-700 dark:text-orange-300 mt-2">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      <strong>High Variance:</strong> {comp.difference.toFixed(1)}% SOV difference between models.
                      Consider reviewing platform-specific content strategies.
                    </p>
                  ) : (
                    <p className="text-muted-foreground mt-2">
                      <strong>Consistent Presence:</strong> This competitor shows aligned visibility across both AI platforms.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
