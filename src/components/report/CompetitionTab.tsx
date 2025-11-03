import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AnalysisResult } from '@/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CompetitionTabProps {
  result: AnalysisResult;
}

export function CompetitionTab({ result }: CompetitionTabProps) {
  // Prepare chart data
  const chartData = [
    {
      name: result.company,
      sov: result.shareOfVoice,
      isBrand: true,
    },
    ...result.topCompetitors.map(comp => ({
      name: comp.name,
      sov: comp.shareOfVoice,
      isBrand: false,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Competitive Landscape */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-2xl">Competitive Landscape</CardTitle>
          <CardDescription>Your position in the market</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Mention Rate Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Share of Voice Comparison</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Brand</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Share of Voice</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Mentions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-primary/10">
                    <td className="py-3 px-4 font-semibold">{result.company}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{result.shareOfVoice.toFixed(1)}%</td>
                    <td className="py-3 px-4">{result.brandMentions}</td>
                  </tr>
                  {result.topCompetitors.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-muted/30">
                      <td className="py-3 px-4">{comp.name}</td>
                      <td className="py-3 px-4">{comp.shareOfVoice.toFixed(1)}%</td>
                      <td className="py-3 px-4">{comp.mentionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2 italic">
              Share of Voice = (Queries where brand appears) / (Total unbranded queries)
            </p>
          </div>

          {/* Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Visual Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  label={{ value: 'Share of Voice (%)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip
                  formatter={(value) => `${Number(value).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="sov" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.isBrand ? 'hsl(var(--primary))' : 'hsl(var(--muted))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Intelligence */}
      {result.topCompetitors.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Competitive Intelligence</CardTitle>
            <CardDescription>Detailed competitor analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.topCompetitors.map((comp, idx) => (
              <div key={idx} className="border-l-4 border-muted pl-6 py-4">
                <h3 className="text-lg font-semibold mb-2">
                  {comp.name} - {comp.shareOfVoice.toFixed(1)}% Share of Voice
                </h3>
                <div className="text-sm space-y-2">
                  <p>
                    Appears in {comp.shareOfVoice.toFixed(1)}% of unbranded queries with {comp.mentionCount} total mentions.
                  </p>
                  {result.visibilityGaps.some(gap =>
                    gap.competitors.some(c => c.name === comp.name)
                  ) ? (
                    <p className="text-orange-600">
                      <span className="font-semibold">Gap Advantage:</span> Appears in {
                        result.visibilityGaps.filter(gap =>
                          gap.competitors.some(c => c.name === comp.name)
                        ).length
                      } queries where {result.company} is absent.
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      <span className="font-semibold">Positioning:</span> No unique category ownership detected. Appears alongside {result.company} in similar queries.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
