import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { AnalysisResult } from '../api/client';

interface ReportViewProps {
  result: AnalysisResult;
  onNewAnalysis: () => void;
  onBackToDashboard?: () => void;
}

export function ReportView({ result, onNewAnalysis, onBackToDashboard }: ReportViewProps) {
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

  const handleDownloadReport = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/download-report/${result.analysisId}`);

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aeo-report-${result.company.toLowerCase().replace(/\s+/g, '-')}-${result.analysisId}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {result.company}
              </h1>
              <p className="text-lg text-gray-600">{result.industry}</p>
            </div>
            <div className="flex gap-3">
              {onBackToDashboard && (
                <button
                  onClick={onBackToDashboard}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </button>
              )}
              <button
                onClick={handleDownloadReport}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Report
              </button>
              <button
                onClick={onNewAnalysis}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                New Analysis
              </button>
            </div>
          </div>

          {/* Big SOV Number */}
          <div className="text-center py-8 border-t border-gray-200">
            <div className="text-7xl font-bold text-blue-600 mb-2">
              {result.shareOfVoice.toFixed(1)}%
            </div>
            <p className="text-xl text-gray-600">Share of Voice</p>
            <p className="text-sm text-gray-500 mt-2">
              Mentioned in {result.brandMentions} of {result.totalQueries} queries
            </p>
          </div>
        </div>

        {/* Position Breakdown */}
        {result.brandMentions > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Position Distribution</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {result.positionBreakdown.first}
                </div>
                <p className="text-sm text-gray-600">1st Position</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((result.positionBreakdown.first / result.brandMentions) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg">
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  {result.positionBreakdown.second}
                </div>
                <p className="text-sm text-gray-600">2nd Position</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((result.positionBreakdown.second / result.brandMentions) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl font-bold text-gray-600 mb-2">
                  {result.positionBreakdown.thirdOrLater}
                </div>
                <p className="text-sm text-gray-600">3rd+ Position</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((result.positionBreakdown.thirdOrLater / result.brandMentions) * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Competitive Landscape */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Competitive Landscape</h2>

          {/* Mention Rate Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Mention Rate (Unbranded Queries)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Brand</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Share of Voice</th>
                    <th className="text-left py-2 px-4 text-sm font-semibold text-gray-700">Mentions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 bg-blue-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{result.company}</td>
                    <td className="py-3 px-4 font-semibold text-blue-600">{result.shareOfVoice.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-gray-700">{result.brandMentions}</td>
                  </tr>
                  {result.topCompetitors.map((comp, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{comp.name}</td>
                      <td className="py-3 px-4 text-gray-700">{comp.shareOfVoice.toFixed(1)}%</td>
                      <td className="py-3 px-4 text-gray-700">{comp.mentionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
              Mention Rate = (Queries where brand appears) / (Total unbranded queries)
            </p>
          </div>

          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Share of Voice (%)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
              <Bar dataKey="sov" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isBrand ? '#2563eb' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Competitive Intelligence */}
        {result.topCompetitors.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Competitive Intelligence</h2>
            <div className="space-y-6">
              {result.topCompetitors.map((comp, idx) => (
                <div key={idx} className="border-l-4 border-gray-400 pl-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {comp.name} - {comp.shareOfVoice.toFixed(1)}% Share of Voice
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      Appears in {comp.shareOfVoice.toFixed(1)}% of unbranded queries with {comp.mentionCount} total mentions.
                    </p>
                    {result.visibilityGaps.some(gap =>
                      gap.competitors.some(c => c.name === comp.name)
                    ) ? (
                      <p className="text-orange-700">
                        <span className="font-semibold">Gap Advantage:</span> Appears in {
                          result.visibilityGaps.filter(gap =>
                            gap.competitors.some(c => c.name === comp.name)
                          ).length
                        } queries where {result.company} is absent.
                      </p>
                    ) : (
                      <p className="text-gray-600">
                        <span className="font-semibold">Positioning:</span> No unique category ownership detected. Appears alongside {result.company} in similar queries.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strategic Insights */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Strategic Insights</h2>
          <div className="space-y-6">
            {result.insights.map((insight, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg">
                <div className="flex items-center mb-2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {insight.category}
                  </span>
                </div>
                <p className="text-gray-900 font-medium mb-2">{insight.insight}</p>
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Recommendation:</span> {insight.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Attribute Analysis */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Attribute Analysis</h2>
          <div className="grid grid-cols-2 gap-8">
            {/* Unbranded */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Unbranded Queries</h3>
              <div className="space-y-4">
                {Object.entries(result.attributes.unbranded).map(([category, values]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(values).map(([key, count]) => (
                        <span
                          key={key}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                        >
                          {key} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Branded */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Branded Queries</h3>
              <div className="space-y-4">
                {Object.entries(result.attributes.branded).map(([category, values]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(values).map(([key, count]) => (
                        <span
                          key={key}
                          className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full"
                        >
                          {key} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Visibility Gaps */}
        {result.visibilityGaps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Visibility Gaps</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Queries where competitors appear but {result.company} does not
            </p>
            <div className="space-y-4 mb-6">
              {result.visibilityGaps.map((gap, index) => (
                <div key={index} className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2">{gap.query}</p>
                  <div className="flex flex-wrap gap-2">
                    {gap.competitors.map((comp, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full"
                      >
                        {comp.name} ({comp.position})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Gap Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Gap Summary</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">{result.company}</span> is absent from{' '}
                  <span className="font-semibold text-red-600">{result.visibilityGaps.length}</span>{' '}
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
          </div>
        )}

        {/* Sample Mentions */}
        {result.sampleMentions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Mentions</h2>
            <p className="text-gray-600 mb-4 text-sm">
              Example responses where {result.company} was mentioned
            </p>
            <div className="space-y-4">
              {result.sampleMentions.map((mention, index) => (
                <div key={index} className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <p className="font-medium text-gray-900 mb-2 text-sm">{mention.query}</p>
                  <p className="text-gray-700 text-sm italic">&ldquo;{mention.excerpt}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Stats */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Analysis completed in {result.executionTime}s</p>
          <p className="mt-1">
            Detected {result.competitorsDetected} competitor mentions across {result.totalQueries} queries
          </p>
        </div>
      </div>
    </div>
  );
}
