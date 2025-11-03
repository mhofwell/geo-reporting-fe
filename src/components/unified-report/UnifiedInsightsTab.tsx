import { motion } from 'framer-motion';
import { Lightbulb, Target, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UnifiedReport } from '@/api/client';

interface UnifiedInsightsTabProps {
  report: UnifiedReport;
}

/**
 * Generate strategic insights based on the unified report data
 */
function generateUnifiedInsights(report: UnifiedReport) {
  const { overallMetrics, modelComparison } = report;
  const insights = [];

  // SOV Performance Insight
  if (overallMetrics.overallSOV > 25) {
    insights.push({
      category: 'Performance',
      icon: TrendingUp,
      title: 'Strong Cross-Platform Presence',
      insight: `With ${overallMetrics.overallSOV.toFixed(1)}% overall share of voice, ${report.companyName} demonstrates strong visibility across both Claude and GPT-4 platforms.`,
      recommendation: 'Maintain current content strategy and monitor for consistency. Focus on expanding into adjacent query categories.',
      priority: 'high'
    });
  } else if (overallMetrics.overallSOV > 15) {
    insights.push({
      category: 'Performance',
      icon: Target,
      title: 'Moderate Visibility with Growth Potential',
      insight: `Current ${overallMetrics.overallSOV.toFixed(1)}% SOV indicates established presence with significant room for improvement.`,
      recommendation: 'Identify high-value query categories where competitors are winning and create targeted content to improve positioning.',
      priority: 'medium'
    });
  } else {
    insights.push({
      category: 'Performance',
      icon: Zap,
      title: 'Building Brand Visibility',
      insight: `At ${overallMetrics.overallSOV.toFixed(1)}% SOV, focus on establishing foundational presence across both platforms.`,
      recommendation: 'Prioritize content creation for high-traffic unbranded queries. Build authoritative resources that AI models can reference.',
      priority: 'high'
    });
  }

  // Model Agreement Insight
  if (overallMetrics.modelAgreementScore > 0.8) {
    insights.push({
      category: 'Cross-Platform',
      icon: CheckCircle2,
      title: 'High Model Consensus',
      insight: `${(overallMetrics.modelAgreementScore * 100).toFixed(0)}% model agreement indicates consistent brand positioning across AI platforms.`,
      recommendation: 'Your content strategy is effective across platforms. Continue current approach and expand to new query categories.',
      priority: 'low'
    });
  } else {
    const sovDiff = Math.abs(overallMetrics.claudeSOV - overallMetrics.gptSOV);
    insights.push({
      category: 'Cross-Platform',
      icon: Target,
      title: 'Platform-Specific Optimization Opportunity',
      insight: `${sovDiff.toFixed(1)}% difference in SOV between Claude and GPT-4 suggests platform-specific behavior.`,
      recommendation: overallMetrics.claudeSOV > overallMetrics.gptSOV
        ? 'Investigate why GPT-4 shows lower visibility. Review content formats and sources that GPT-4 may prioritize differently.'
        : 'Analyze Claude\'s content preferences. Consider enhancing technical depth or authoritative sources that Claude may favor.',
      priority: 'high'
    });
  }

  // Competitive Positioning
  const claudeTopComp = modelComparison.claude.topCompetitors[0];
  const gptTopComp = modelComparison.gpt.topCompetitors[0];

  if (claudeTopComp && gptTopComp) {
    if (claudeTopComp.name === gptTopComp.name) {
      insights.push({
        category: 'Competition',
        icon: Target,
        title: 'Consistent Top Competitor',
        insight: `${claudeTopComp.name} leads across both platforms with average ${((claudeTopComp.sov + gptTopComp.sov) / 2).toFixed(1)}% SOV.`,
        recommendation: `Conduct competitive analysis on ${claudeTopComp.name}'s content strategy. Identify query categories where they dominate and create superior content.`,
        priority: 'high'
      });
    } else {
      insights.push({
        category: 'Competition',
        icon: Lightbulb,
        title: 'Platform-Specific Competition',
        insight: `Different top competitors across models: ${claudeTopComp.name} (Claude) vs ${gptTopComp.name} (GPT-4).`,
        recommendation: 'Each platform favors different competitors. Develop platform-specific content strategies targeting each competitor\'s weaknesses.',
        priority: 'medium'
      });
    }
  }

  // Positioning Quality
  const avgPosition = (modelComparison.claude.avgPosition + modelComparison.gpt.avgPosition) / 2;
  if (avgPosition <= 1.5) {
    insights.push({
      category: 'Positioning',
      icon: TrendingUp,
      title: 'Excellent Position Quality',
      insight: `Average position of ${avgPosition.toFixed(1)} indicates strong first-position presence across both models.`,
      recommendation: 'Maintain content quality and freshness. Monitor for position drops and refresh content proactively.',
      priority: 'low'
    });
  } else if (avgPosition > 2.5) {
    insights.push({
      category: 'Positioning',
      icon: Target,
      title: 'Position Improvement Needed',
      insight: `Average position of ${avgPosition.toFixed(1)} suggests opportunities to improve ranking in AI responses.`,
      recommendation: 'Focus on content depth, expertise signals, and recency. Add structured data and clear value propositions.',
      priority: 'high'
    });
  }

  return insights;
}

export function UnifiedInsightsTab({ report }: UnifiedInsightsTabProps) {
  const insights = generateUnifiedInsights(report);
  const { modelComparison } = report;

  return (
    <div className="space-y-6">
      {/* Strategic Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Strategic Insights</CardTitle>
            <CardDescription>Cross-platform analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {insights.map((insight, index) => {
              const Icon = insight.icon;
              const priorityColor =
                insight.priority === 'high'
                  ? 'bg-red-500/10 border-red-500/20 text-red-700'
                  : insight.priority === 'medium'
                  ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700'
                  : 'bg-green-500/10 border-green-500/20 text-green-700';

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <Badge>{insight.category}</Badge>
                    </div>
                    <Badge variant="secondary" className={`text-xs ${priorityColor}`}>
                      {insight.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{insight.title}</h3>
                  <p className="text-sm text-foreground mb-3">{insight.insight}</p>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm">
                      <span className="font-semibold text-primary">Recommendation:</span> {insight.recommendation}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>

      {/* Attribute Analysis - Claude vs GPT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Attribute Analysis by Model</CardTitle>
            <CardDescription>Top positioning attributes identified by each AI model</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              {/* Claude Attributes */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-blue-500 text-white">Claude Sonnet 4</Badge>
                  <span className="text-sm text-muted-foreground">Top Attributes</span>
                </div>
                <div className="space-y-3">
                  {modelComparison.claude.topAttributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-blue-600">#{idx + 1}</span>
                        <span className="font-medium">{attr}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-700 border-blue-500/20">
                        Claude
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* GPT Attributes */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-green-500 text-white">GPT-4</Badge>
                  <span className="text-sm text-muted-foreground">Top Attributes</span>
                </div>
                <div className="space-y-3">
                  {modelComparison.gpt.topAttributes.map((attr, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-green-600">#{idx + 1}</span>
                        <span className="font-medium">{attr}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                        GPT
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Attribute Divergence Note */}
            <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground">
                <Lightbulb className="h-4 w-4 inline mr-1 text-primary" />
                <strong>Note:</strong> Different attribute emphasis across models may indicate varying content interpretation.
                Optimize for both by ensuring comprehensive coverage of key positioning attributes.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-primary/5 to-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Recommended Action Items</CardTitle>
            <CardDescription>Prioritized next steps for optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights
                .filter(i => i.priority === 'high')
                .map((insight, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-card rounded-lg border border-border">
                    <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm mb-1">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.recommendation}</p>
                    </div>
                    <Badge variant="secondary" className="bg-red-500/10 text-red-700 border-red-500/20 text-xs">
                      HIGH
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
