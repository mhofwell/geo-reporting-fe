import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { AnalysisResult } from '@/api/client';
import { useState } from 'react';

interface PerformanceScorecardProps {
  result: AnalysisResult;
}

export function PerformanceScorecard({ result }: PerformanceScorecardProps) {
  const [showMethodology, setShowMethodology] = useState(false);

  // Calculate performance score (0-100)
  const calculateScore = () => {
    let score = 0;

    // Share of Voice (40 points max)
    score += Math.min(result.shareOfVoice * 1.6, 40);

    // First Position Rate (30 points max)
    if (result.brandMentions > 0) {
      const firstPosRate = (result.positionBreakdown.first / result.brandMentions) * 100;
      score += (firstPosRate / 100) * 30;
    }

    // Coverage (no gaps) (20 points max)
    const gapPenalty = (result.visibilityGaps.length / result.totalQueries) * 20;
    score += Math.max(20 - gapPenalty, 0);

    // Competitive positioning (10 points max)
    if (result.topCompetitors.length > 0) {
      const leadsCompetition = result.shareOfVoice > result.topCompetitors[0].shareOfVoice;
      score += leadsCompetition ? 10 : 5;
    } else {
      score += 10; // No competition detected
    }

    return Math.round(score);
  };

  const score = calculateScore();

  // Determine grade based on score
  const getGrade = (score: number): { grade: string; color: string; label: string } => {
    if (score >= 90) return { grade: 'A', color: 'text-green-600', label: 'Excellent' };
    if (score >= 80) return { grade: 'B+', color: 'text-green-600', label: 'Very Good' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600', label: 'Good' };
    if (score >= 60) return { grade: 'C+', color: 'text-yellow-600', label: 'Fair' };
    if (score >= 50) return { grade: 'C', color: 'text-orange-600', label: 'Needs Work' };
    return { grade: 'D', color: 'text-red-600', label: 'Poor' };
  };

  const { grade, color, label } = getGrade(score);

  // Generate strengths
  const strengths: string[] = [];
  if (result.shareOfVoice > 20) {
    strengths.push(`Strong ${result.shareOfVoice.toFixed(1)}% share of voice`);
  }
  if (result.brandMentions > 0) {
    const firstPosRate = (result.positionBreakdown.first / result.brandMentions) * 100;
    if (firstPosRate > 40) {
      strengths.push(`#1 position in ${firstPosRate.toFixed(0)}% of mentions`);
    }
  }
  if (result.insights.length > 0) {
    const positiveInsights = result.insights.filter(i =>
      i.category === 'STRENGTH' || i.category === 'OPPORTUNITY'
    );
    if (positiveInsights.length > 0) {
      strengths.push(positiveInsights[0].insight.slice(0, 60) + '...');
    }
  }

  // Generate weaknesses
  const weaknesses: string[] = [];
  if (result.visibilityGaps.length > 0) {
    weaknesses.push(`Missing from ${result.visibilityGaps.length} high-value queries`);
  }
  if (result.topCompetitors.length > 0) {
    const topCompetitor = result.topCompetitors[0];
    if (topCompetitor.shareOfVoice > result.shareOfVoice) {
      weaknesses.push(`${topCompetitor.name} leads with ${topCompetitor.shareOfVoice.toFixed(1)}% SOV`);
    }
    const gapLeader = result.visibilityGaps
      .flatMap(gap => gap.competitors.map(c => c.name))
      .reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topGapCompetitor = Object.entries(gapLeader).sort((a, b) => b[1] - a[1])[0];
    if (topGapCompetitor) {
      weaknesses.push(`${topGapCompetitor[0]} has advantage in ${topGapCompetitor[1]} gap queries`);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Performance Score</CardTitle>
              <CardDescription>Overall assessment of AI visibility</CardDescription>
            </div>
            <button
              onClick={() => setShowMethodology(!showMethodology)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="How is this calculated?"
            >
              <Info className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="flex items-center gap-6">
            <div className="flex items-center justify-center">
              <div className={`text-7xl font-bold ${color}`}>{grade}</div>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{label}</span>
                  <Badge variant="secondary">{score}/100</Badge>
                </div>
                <Progress value={score} className="h-3" />
              </div>
              <p className="text-sm text-muted-foreground">
                {score >= 80
                  ? 'Excellent AI visibility performance across key metrics.'
                  : score >= 60
                  ? 'Good foundation with opportunities for improvement.'
                  : 'Significant room for growth in AI visibility.'}
              </p>
            </div>
          </div>

          {/* Methodology (collapsible) */}
          {showMethodology && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4"
            >
              <h4 className="text-sm font-semibold mb-3">Score Calculation</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>• <span className="font-medium">Share of Voice</span> (40 pts): Based on mention rate</p>
                <p>• <span className="font-medium">Position Quality</span> (30 pts): #1 position frequency</p>
                <p>• <span className="font-medium">Coverage</span> (20 pts): Penalized for visibility gaps</p>
                <p>• <span className="font-medium">Competitive Edge</span> (10 pts): Lead vs competitors</p>
              </div>
            </motion.div>
          )}

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h3 className="text-sm font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-2">
                {strengths.length > 0 ? (
                  strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-600 mt-0.5">•</span>
                      <span>{strength}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground italic">
                    Building foundation for strong presence
                  </li>
                )}
              </ul>
            </div>

            {/* Needs Attention */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h3 className="text-sm font-semibold">Needs Attention</h3>
              </div>
              <ul className="space-y-2">
                {weaknesses.length > 0 ? (
                  weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">•</span>
                      <span>{weakness}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted-foreground italic">
                    Strong performance across all areas
                  </li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
