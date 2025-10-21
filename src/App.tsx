import { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AnalysisForm } from './components/AnalysisForm';
import { QueryReview } from './components/QueryReview';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportView } from './components/ReportView';
import { generateQueries, runAnalysisWithProgress, type AnalysisResult, type GenerateQueriesResult } from './api/client';

type AppState = 'dashboard' | 'form' | 'generating' | 'review' | 'loading' | 'report' | 'error';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [state, setState] = useState<AppState>('dashboard');
  const [currentCompany, setCurrentCompany] = useState('');
  const [currentIndustry, setCurrentIndustry] = useState('');
  const [queryData, setQueryData] = useState<GenerateQueriesResult | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('Starting analysis...');

  // Check URL for analysisId on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const analysisId = urlParams.get('analysisId');

    if (analysisId) {
      loadExistingAnalysis(analysisId);
    }
  }, []);

  const loadExistingAnalysis = async (analysisId: string) => {
    setState('loading');
    setProgressMessage('Loading analysis...');

    try {
      const response = await fetch(`${API_BASE_URL}/analysis-status/${analysisId}`);

      if (!response.ok) {
        throw new Error('Analysis not found');
      }

      const data = await response.json();

      if (data.status === 'completed' && data.result) {
        setResult(data.result);
        setState('report');
      } else {
        throw new Error('Analysis not completed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
      setState('error');
    }
  };

  const handleSubmit = async (company: string, industry: string) => {
    setState('generating');
    setCurrentCompany(company);
    setCurrentIndustry(industry);
    setError(null);

    try {
      const queries = await generateQueries({ company, industry });
      setQueryData(queries);
      setState('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query generation failed');
      setState('error');
    }
  };

  const handleRunAnalysis = async () => {
    if (!queryData) return;

    setState('loading');
    setProgress(0);
    setProgressMessage('Starting analysis...');

    try {
      const analysisResult = await runAnalysisWithProgress(
        queryData.analysisId,
        (newProgress, message) => {
          setProgress(newProgress);
          setProgressMessage(message);
        }
      );
      setResult(analysisResult);
      setState('report');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setState('error');
    }
  };

  const handleNewAnalysis = () => {
    setState('form');
    setResult(null);
    setQueryData(null);
    setCurrentCompany('');
    setCurrentIndustry('');
    setError(null);
  };

  const handleStartNewReport = () => {
    setState('form');
    setResult(null);
    setQueryData(null);
    setCurrentCompany('');
    setCurrentIndustry('');
    setError(null);
  };

  const handleViewReport = async (analysisId: string) => {
    await loadExistingAnalysis(analysisId);
  };

  const handleBackToDashboard = () => {
    setState('dashboard');
  };

  const handleBackToForm = () => {
    setState('form');
    setQueryData(null);
  };

  if (state === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 max-w-md w-full text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Generating Queries
          </h2>
          <p className="text-gray-600">
            Creating analysis queries for {currentCompany}...
          </p>
        </div>
      </div>
    );
  }

  if (state === 'review' && queryData) {
    return (
      <QueryReview
        company={queryData.company}
        industry={queryData.industry}
        queries={queryData.queries}
        onConfirm={handleRunAnalysis}
        onBack={handleBackToForm}
        isLoading={state === 'loading'}
      />
    );
  }

  if (state === 'loading') {
    return <LoadingScreen company={currentCompany} progress={progress} message={progressMessage} />;
  }

  if (state === 'report' && result) {
    return <ReportView result={result} onNewAnalysis={handleNewAnalysis} onBackToDashboard={handleBackToDashboard} />;
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBackToDashboard}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (state === 'dashboard') {
    return <Dashboard onNewReport={handleStartNewReport} onViewReport={handleViewReport} />;
  }

  return <AnalysisForm onSubmit={handleSubmit} isLoading={state === 'generating'} onLoadExisting={loadExistingAnalysis} onBackToDashboard={handleBackToDashboard} />;
}

export default App;
