import { useState, useEffect } from 'react';

interface AnalysisFormProps {
  onSubmit: (company: string, industry: string) => void;
  isLoading: boolean;
  onLoadExisting?: (analysisId: string) => void;
  onBackToDashboard?: () => void;
}

interface PastAnalysis {
  id: string;
  companyName: string;
  industry: string;
  shareOfVoice: string;
  completedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function AnalysisForm({ onSubmit, isLoading, onLoadExisting, onBackToDashboard }: AnalysisFormProps) {
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [pastAnalyses, setPastAnalyses] = useState<PastAnalysis[]>([]);
  const [loadingPast, setLoadingPast] = useState(false);

  useEffect(() => {
    fetchPastAnalyses();
  }, []);

  const fetchPastAnalyses = async () => {
    setLoadingPast(true);
    try {
      const response = await fetch(`${API_BASE_URL}/recent-analyses`);
      if (response.ok) {
        const data = await response.json();
        setPastAnalyses(data.analyses || []);
      }
    } catch (error) {
      console.error('Failed to load past analyses:', error);
    } finally {
      setLoadingPast(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim() && industry.trim()) {
      onSubmit(company.trim(), industry.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="mb-4 text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm"
          >
            ← Back to Dashboard
          </button>
        )}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AEO Analysis
          </h1>
          <p className="text-gray-600">
            Analyze your brand's AI visibility in 3 minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g., Nike"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
              Industry
            </label>
            <input
              id="industry"
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., Athletic Apparel"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !company.trim() || !industry.trim()}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Brand'}
          </button>
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Est. 2-3 minutes • ~30 AI queries
        </p>

        {/* Past Analyses Dropdown */}
        {pastAnalyses.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              View Past Reports
            </h3>
            {loadingPast ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : (
              <select
                onChange={(e) => {
                  if (e.target.value && onLoadExisting) {
                    onLoadExisting(e.target.value);
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                defaultValue=""
              >
                <option value="" disabled>Select a past analysis...</option>
                {pastAnalyses.map((analysis) => (
                  <option key={analysis.id} value={analysis.id}>
                    {analysis.companyName} ({analysis.industry}) - {Number(analysis.shareOfVoice).toFixed(1)}% SOV
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
