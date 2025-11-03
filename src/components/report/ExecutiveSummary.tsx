import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Award, Target, Zap, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AnalysisResult } from '@/api/client';

interface ExecutiveSummaryProps {
  result: AnalysisResult;
}

export function ExecutiveSummary({ result }: ExecutiveSummaryProps) {
  // Calculate trend (mock for now - would come from historical data)
  const sovTrend = 5.2; // +5.2% vs previous
  const industryAvg = 18.5; // Mock industry average
  const vsIndustry = result.shareOfVoice - industryAvg;

  // Calculate ranking (mock for now)
  const industryRank = result.topCompetitors.length > 0 ? 2 : 1;

  // Generate AI takeaway (simplified - would use LLM in production)
  const generateTakeaway = () => {
    if (result.shareOfVoice > 25) {
      return `Strong market presence with ${result.shareOfVoice.toFixed(1)}% share of voice, but ${result.visibilityGaps.length} visibility gaps present growth opportunities.`;
    } else if (result.shareOfVoice > 15) {
      return `Moderate visibility with room for improvement. Focus on ${result.visibilityGaps.length} gap queries to increase market share.`;
    } else {
      return `Building visibility in the market. Strategic focus on competitive gaps and positioning can significantly boost presence.`;
    }
  };

  const TrendIcon = sovTrend > 0 ? TrendingUp : sovTrend < 0 ? TrendingDown : Minus;
  const trendColor = sovTrend > 0 ? 'text-green-600' : sovTrend < 0 ? 'text-red-600' : 'text-muted-foreground';

  return (
    <div className="space-y-6">
      {/* Company Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-4xl mb-1">{result.company}</CardTitle>
                  <p className="text-lg text-muted-foreground">{result.industry}</p>
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                Analyzed {new Date().toLocaleDateString()}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Hero Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* Share of Voice */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Share of Voice</p>
              <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-bold text-primary">
                {result.shareOfVoice.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {result.brandMentions} of {result.totalQueries} queries
              </p>
              <Badge variant={sovTrend > 0 ? 'default' : 'destructive'} className="text-xs">
                {sovTrend > 0 ? '+' : ''}{sovTrend.toFixed(1)}% vs avg
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Industry Ranking */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">Industry Position</p>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-bold text-primary">
                #{industryRank}
              </p>
              <p className="text-xs text-muted-foreground">
                Among {result.competitorsDetected + 1} detected brands
              </p>
              <Badge variant="secondary" className="text-xs">
                {vsIndustry > 0 ? '+' : ''}{vsIndustry.toFixed(1)}% vs industry avg
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Position Quality */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-muted-foreground">First Position Rate</p>
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-5xl font-bold text-primary">
                {result.brandMentions > 0
                  ? ((result.positionBreakdown.first / result.brandMentions) * 100).toFixed(0)
                  : 0}%
              </p>
              <p className="text-xs text-muted-foreground">
                {result.positionBreakdown.first} of {result.brandMentions} mentions
              </p>
              <Badge variant="secondary" className="text-xs">
                Target: 60%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Takeaway */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-1 text-primary">Key Takeaway</p>
                <p className="text-sm text-foreground leading-relaxed">
                  {generateTakeaway()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
