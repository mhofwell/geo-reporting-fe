import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Award, Target, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UnifiedReport } from '@/api/client';

interface UnifiedOverviewTabProps {
  report: UnifiedReport;
}

export function UnifiedOverviewTab({ report }: UnifiedOverviewTabProps) {
  const { overallMetrics, modelComparison } = report;

  // Prepare position distribution chart data
  const positionData = [
    {
      position: '1st',
      claude: modelComparison.claude.avgPosition <= 1.5 ? 60 : modelComparison.claude.avgPosition <= 2.5 ? 30 : 10,
      gpt: modelComparison.gpt.avgPosition <= 1.5 ? 60 : modelComparison.gpt.avgPosition <= 2.5 ? 30 : 10,
    },
    {
      position: '2nd',
      claude: modelComparison.claude.avgPosition <= 1.5 ? 30 : modelComparison.claude.avgPosition <= 2.5 ? 50 : 30,
      gpt: modelComparison.gpt.avgPosition <= 1.5 ? 30 : modelComparison.gpt.avgPosition <= 2.5 ? 50 : 30,
    },
    {
      position: '3rd+',
      claude: modelComparison.claude.avgPosition <= 1.5 ? 10 : modelComparison.claude.avgPosition <= 2.5 ? 20 : 60,
      gpt: modelComparison.gpt.avgPosition <= 1.5 ? 10 : modelComparison.gpt.avgPosition <= 2.5 ? 20 : 60,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1 text-primary">Executive Summary</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {report.companyName} achieves an overall {overallMetrics.overallSOV.toFixed(1)}% share of voice across
                  both Claude and GPT-4 models. With a model agreement score of {(overallMetrics.modelAgreementScore * 100).toFixed(0)}%,
                  {overallMetrics.modelAgreementScore > 0.8
                    ? ' the brand demonstrates highly consistent visibility across AI platforms.'
                    : overallMetrics.modelAgreementScore > 0.6
                    ? ' there is moderate consistency in brand visibility across platforms with some variance to investigate.'
                    : ' significant differences exist between models, suggesting platform-specific optimization opportunities.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Hero Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Overall SOV */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Overall SOV</p>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-bold text-primary">
                {overallMetrics.overallSOV.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Combined across models
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-700 border-blue-500/20">
                  Claude: {overallMetrics.claudeSOV.toFixed(1)}%
                </Badge>
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                  GPT: {overallMetrics.gptSOV.toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Agreement */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Model Agreement</p>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-bold text-primary">
                {(overallMetrics.modelAgreementScore * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Cross-platform consistency
              </p>
              <Badge
                variant={overallMetrics.modelAgreementScore > 0.8 ? 'default' : 'secondary'}
                className="text-xs mt-2"
              >
                {overallMetrics.modelAgreementScore > 0.8
                  ? 'High Consensus'
                  : overallMetrics.modelAgreementScore > 0.6
                  ? 'Moderate Alignment'
                  : 'Review Needed'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Average Position */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Avg Position</p>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-bold text-primary">
                {((modelComparison.claude.avgPosition + modelComparison.gpt.avgPosition) / 2).toFixed(1)}
              </p>
              <p className="text-xs text-muted-foreground">
                Combined ranking
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  Claude: {modelComparison.claude.avgPosition.toFixed(1)}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  GPT: {modelComparison.gpt.avgPosition.toFixed(1)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Position Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Position Distribution by Model</CardTitle>
            <CardDescription>How often you appear in top positions across Claude and GPT-4</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={positionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="position"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value) => `${Number(value).toFixed(0)}%`}
                />
                <Legend />
                <Bar
                  dataKey="claude"
                  name="Claude Sonnet 4"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                />
                <Bar
                  dataKey="gpt"
                  name="GPT-4"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Competitors Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Top Competitors by Model</CardTitle>
            <CardDescription>Leading competitors identified by each AI model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              {/* Claude Top Competitors */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                    Claude Sonnet 4
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {modelComparison.claude.topCompetitors.slice(0, 3).map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                        <span className="font-medium">{comp.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600">
                        {comp.sov.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* GPT Top Competitors */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-500/10 text-green-700 border-green-500/20">
                    GPT-4
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {modelComparison.gpt.topCompetitors.slice(0, 3).map((comp, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-muted-foreground">#{idx + 1}</span>
                        <span className="font-medium">{comp.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {comp.sov.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
