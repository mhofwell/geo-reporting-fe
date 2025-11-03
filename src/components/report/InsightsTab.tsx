import type { AnalysisResult } from '@/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InsightsTabProps {
  result: AnalysisResult;
}

export function InsightsTab({ result }: InsightsTabProps) {
  return (
    <div className="space-y-6">
      {/* Strategic Insights */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Strategic Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.insights.map((insight, index) => (
            <div key={index} className="border-l-4 border-primary pl-6 py-4 bg-primary/5 rounded-r-lg">
              <div className="flex items-center mb-2">
                <Badge>{insight.category}</Badge>
              </div>
              <p className="font-medium mb-2">{insight.insight}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Recommendation:</span> {insight.recommendation}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attribute Analysis */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Attribute Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            {/* Unbranded */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Unbranded Queries</h3>
              <div className="space-y-4">
                {Object.entries(result.attributes.unbranded).map(([category, values]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(values).map(([key, count]) => (
                        <Badge key={key} variant="secondary">
                          {key} ({count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branded */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Branded Queries</h3>
              <div className="space-y-4">
                {Object.entries(result.attributes.branded).map(([category, values]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2 capitalize">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(values).map(([key, count]) => (
                        <Badge key={key} variant="outline" className="bg-green-500/10 border-green-500/20">
                          {key} ({count})
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Mentions */}
      {result.sampleMentions.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Sample Mentions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result.sampleMentions.map((mention, index) => (
              <div key={index} className="border border-green-500/20 bg-green-500/5 rounded-lg p-4">
                <p className="font-medium mb-2 text-sm">{mention.query}</p>
                <p className="text-sm italic text-muted-foreground">&ldquo;{mention.excerpt}&rdquo;</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
