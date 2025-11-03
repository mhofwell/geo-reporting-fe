import type { AnalysisResult } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GapsTabProps {
  result: AnalysisResult;
}

export function GapsTab({ result }: GapsTabProps) {
  return (
    <div className="space-y-6">
      {/* Visibility Gaps */}
      {result.visibilityGaps.length > 0 ? (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Visibility Gaps</CardTitle>
            <CardDescription>
              Queries where competitors appear but {result.company} does not
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {result.visibilityGaps.map((gap, index) => (
                <div key={index} className="border border-destructive/20 bg-destructive/5 rounded-lg p-4">
                  <p className="font-medium mb-2">{gap.query}</p>
                  <div className="flex flex-wrap gap-2">
                    {gap.competitors.map((comp, idx) => (
                      <Badge key={idx} variant="destructive">
                        {comp.name} (#{comp.position})
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Gap Summary */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Gap Summary</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">{result.company}</span> is absent from{' '}
                  <span className="font-semibold text-destructive">{result.visibilityGaps.length}</span>{' '}
                  unbranded queries ({((result.visibilityGaps.length / result.totalQueries) * 100).toFixed(1)}% of total unbranded queries).
                </p>
                <p>
                  <span className="font-semibold">Most frequent in gaps:</span>{' '}
                  {(() => {
                    const competitorCounts: Record<string, number> = {};
                    result.visibilityGaps.forEach(gap => {
                      gap.competitors.forEach(comp => {
                        competitorCounts[comp.name] = (competitorCounts[comp.name] || 0) + 1;
                      });
                    });
                    const sorted = Object.entries(competitorCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3);
                    return sorted.map(([name, count]) => `${name} (${count} queries)`).join(', ');
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card border-border">
          <CardContent className="pt-6 text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold mb-2">No Visibility Gaps!</h3>
            <p className="text-sm text-muted-foreground">
              {result.company} appears in all analyzed queries where competitors are mentioned.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
