import { useState, useEffect } from 'react';
import { Homepage } from './components/Homepage';
import { Dashboard } from './components/Dashboard';
import { AnalysisForm } from './components/AnalysisForm';
import { QueryReview } from './components/QueryReview';
import { LoadingScreen } from './components/LoadingScreen';
import { ReportView } from './components/ReportView';
import { Pricing } from './components/Pricing';
import { AppLayout } from './components/app-layout';
import { UnifiedReportView } from './components/UnifiedReportView';
import { ModelSpecificReportView } from './components/ModelSpecificReportView';
import { AnalysisProgress } from './components/AnalysisProgress';
import { AccountSettings, Preferences } from './components/settings';
import { generateQueries, toggleDefaultReport, type AnalysisResult, type GenerateQueriesResult } from './api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useBackgroundAnalysis } from './hooks/useBackgroundAnalysis';
// import { clearUserProfile, clearAllData } from './utils/storage'; // Uncomment if needed for logout

type AppState = 'homepage' | 'pricing' | 'unified-dashboard' | 'form' | 'generating' | 'review' | 'loading' | 'report' | 'unified-report' | 'model-report' | 'account-settings' | 'preferences' | 'error';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Breadcrumb mappings for each state
const getBreadcrumbs = (state: AppState, result: AnalysisResult | null, currentModelName?: 'CLAUDE_SONNET_4' | 'GPT_4'): string[] => {
  switch (state) {
    case 'homepage':
      return ['Home'];
    case 'pricing':
      return ['Pricing'];
    case 'unified-dashboard':
      return ['Dashboard'];
    case 'form':
      return ['Dashboard', 'New Report'];
    case 'generating':
      return ['Dashboard', 'New Report', 'Generating'];
    case 'review':
      return ['Dashboard', 'New Report', 'Review Queries'];
    case 'loading':
      return ['Dashboard', 'Analysis Running'];
    case 'report':
      return ['Dashboard', 'Reports', result?.company || 'Report'];
    case 'unified-report':
      return ['Dashboard', 'Reports', 'Unified Analysis'];
    case 'model-report':
      const modelName = currentModelName === 'CLAUDE_SONNET_4' ? 'Claude Analysis' : 'GPT Analysis';
      return ['Dashboard', 'Reports', modelName];
    case 'account-settings':
      return ['Dashboard', 'Account'];
    case 'preferences':
      return ['Dashboard', 'Preferences'];
    case 'error':
      return ['Dashboard', 'Error'];
    default:
      return ['Dashboard'];
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [state, setState] = useState<AppState>('homepage');
  const [currentCompany, setCurrentCompany] = useState('');
  const [queryData, setQueryData] = useState<GenerateQueriesResult | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, _setProgress] = useState(0);
  const [progressMessage, _setProgressMessage] = useState('Starting analysis...');

  // New state for multi-model dashboard routing
  const [currentAnalysisRunId, setCurrentAnalysisRunId] = useState<string | null>(null);
  const [currentModelName, setCurrentModelName] = useState<'CLAUDE_SONNET_4' | 'GPT_4' | null>(null);


  // Background analysis tracking
  const { runningAnalyses, trackAnalysis, stopTracking } = useBackgroundAnalysis();

  // Check URL for analysisId on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const analysisId = urlParams.get('analysisId');

    if (analysisId) {
      setIsAuthenticated(true); // Auto-authenticate if loading existing analysis
      loadExistingAnalysis(analysisId);
    }
  }, []);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated && state === 'homepage') {
      setState('unified-dashboard');
    }
  }, [isAuthenticated, state]);

  const loadExistingAnalysis = async (analysisId: string) => {
    setState('loading');
    _setProgressMessage('Loading analysis...');

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

  const handleLogin = () => {
    // Set authenticated state to show dashboard
    setIsAuthenticated(true);
  };

  const handleSubmit = async (company: string, industry: string, name: string, description: string) => {
    // Auto-authenticate when starting an analysis
    setIsAuthenticated(true);

    setState('generating');
    setCurrentCompany(company);
    setError(null);

    try {
      const queries = await generateQueries({
        company,
        industry,
        name,
        description: description || undefined
      });
      setQueryData(queries);
      setState('review');
      toast.success('Queries generated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Query generation failed');
      setState('error');
    }
  };

  // Wrapper for Homepage with default name/description
  const handleHomepageSubmit = async (company: string, industry: string) => {
    const defaultName = `${company} Brand Analysis`;
    await handleSubmit(company, industry, defaultName, '');
  };

  const handleRunAnalysis = async () => {
    if (!queryData) return;

    try {
      // Start the analysis in the background
      const response = await fetch(`${API_BASE_URL}/run-analysis-async`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ analysisId: queryData.analysisId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start analysis');
      }

      // Track the analysis in the background
      trackAnalysis(
        queryData.analysisId,
        queryData.company,
        queryData.company // Use company name as report name for now
      );

      // Navigate back to dashboard immediately - analysis runs in background
      setState('unified-dashboard');
      setQueryData(null);

      toast.success('Analysis started! You can navigate away while it runs.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start analysis');
      setState('error');
    }
  };

  const handleNewAnalysis = () => {
    setState('form');
    setResult(null);
    setQueryData(null);
    setCurrentCompany('');
    setError(null);
  };

  const handleStartNewReport = () => {
    setState('form');
  };

  // New navigation handlers for multi-model dashboard
  const handleViewUnifiedReport = (analysisRunId: string) => {
    setCurrentAnalysisRunId(analysisRunId);
    setCurrentModelName(null);
    setState('unified-report');
  };

  // This handler can be used for direct navigation to model-specific view
  // Currently unused but kept for future functionality (e.g., deep linking, URL params)
  const handleViewModelReport = (analysisRunId: string, modelName: 'CLAUDE_SONNET_4' | 'GPT_4') => {
    setCurrentAnalysisRunId(analysisRunId);
    setCurrentModelName(modelName);
    setState('model-report');
  };

  // Suppress unused warning - this handler is kept for future URL parameter support
  if (false as boolean) {
    handleViewModelReport('', 'CLAUDE_SONNET_4');
  }

  const handleNavigateToModel = (modelName: 'CLAUDE_SONNET_4' | 'GPT_4') => {
    if (currentAnalysisRunId) {
      setCurrentModelName(modelName);
      setState('model-report');
    }
  };

  const handleNavigateToUnified = () => {
    if (currentAnalysisRunId) {
      setCurrentModelName(null);
      setState('unified-report');
    }
  };

  const handleNavigateToOtherModel = (modelName: 'CLAUDE_SONNET_4' | 'GPT_4') => {
    if (currentAnalysisRunId) {
      setCurrentModelName(modelName);
      setState('model-report');
    }
  };

  const handleToggleFavorite = async (queryGroupId: string) => {
    try {
      await toggleDefaultReport(queryGroupId);
      toast.success('Favorite updated successfully');
      // Optionally refresh sidebar or dashboard data here
    } catch (error) {
      toast.error('Failed to update favorite');
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBackToDashboard = () => {
    setState('unified-dashboard');
  };

  const handleBackToForm = () => {
    setState('form');
    setQueryData(null);
  };

  const handleNavigate = (view: 'form' | 'unified-dashboard') => {
    if (view === 'unified-dashboard') {
      setState('unified-dashboard');
    } else {
      handleStartNewReport();
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const breadcrumbs = getBreadcrumbs(state, result, currentModelName || undefined);
    if (index === 0) {
      handleBackToDashboard();
    } else if (breadcrumbs[index] === 'New Report') {
      handleBackToForm();
    } else if (breadcrumbs[index] === 'Reports' && (state === 'unified-report' || state === 'model-report')) {
      // Navigate back to unified report if we're in model-specific view
      if (state === 'model-report' && currentAnalysisRunId) {
        handleNavigateToUnified();
      } else {
        handleBackToDashboard();
      }
    }
  };

  const handlePricingClick = () => {
    setState('pricing');
  };

  const handleGetStarted = () => {
    setState('homepage');
    // Scroll to form section
    setTimeout(() => {
      const formElement = document.querySelector('form');
      formElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleNavigateToAccountSettings = () => {
    setState('account-settings');
  };

  const handleNavigateToPreferences = () => {
    setState('preferences');
  };

  const handleLogout = () => {
    // Clear authentication state
    setIsAuthenticated(false);
    // Navigate to homepage
    setState('homepage');
    // Clear any current analysis data
    setResult(null);
    setQueryData(null);
    setCurrentAnalysisRunId(null);
    setCurrentModelName(null);
    setCurrentCompany('');
    setError(null);
    // Optionally clear user data from localStorage
    // clearUserProfile(); // Uncomment if you want to clear profile on logout
    // clearAllData(); // Uncomment if you want to clear all data on logout
    toast.success('Logged out successfully');
  };

  // Homepage for unauthenticated users
  if (!isAuthenticated && state === 'homepage') {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--popover))',
              color: 'hsl(var(--popover-foreground))',
              border: '1px solid hsl(var(--border))',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--primary-foreground))',
              },
            },
          }}
        />
        <Homepage onSubmit={handleHomepageSubmit} onLogin={handleLogin} onPricingClick={handlePricingClick} isLoading={false} />
      </>
    );
  }

  // Pricing page
  if (state === 'pricing') {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--popover))',
              color: 'hsl(var(--popover-foreground))',
              border: '1px solid hsl(var(--border))',
            },
            success: {
              iconTheme: {
                primary: 'hsl(var(--primary))',
                secondary: 'hsl(var(--primary-foreground))',
              },
            },
          }}
        />
        <Pricing onGetStarted={handleGetStarted} />
      </>
    );
  }

  // Loading and error states don't use the layout
  if (state === 'generating') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Spinner className="w-16 h-16" />
            </div>
            <div>
              <CardTitle className="text-2xl">Generating Queries</CardTitle>
              <CardDescription>
                Creating analysis queries for {currentCompany}...
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (state === 'loading') {
    return <LoadingScreen company={currentCompany} progress={progress} message={progressMessage} />;
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="text-6xl">⚠️</div>
            <div>
              <CardTitle className="text-2xl">Analysis Failed</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={handleBackToDashboard}
              className="w-full"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All other states use the layout
  const breadcrumbs = getBreadcrumbs(state, result, currentModelName || undefined);

  // Header actions based on current state
  let headerActions = null;
  if (state === 'report' && result) {
    headerActions = (
      <>
        <Button variant="secondary" onClick={async () => {
          const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
          const response = await fetch(`${API_BASE_URL}/download-report/${result.analysisId}`);
          if (response.ok) {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `geo-report-${result.company.toLowerCase().replace(/\s+/g, '-')}-${result.analysisId}.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }
        }}>
          Download Report
        </Button>
        <Button onClick={handleNewAnalysis}>New Report</Button>
      </>
    );
  } else if (state === 'unified-report') {
    // Header actions for unified report view are handled within the component
    headerActions = null;
  } else if (state === 'model-report') {
    // Header actions for model-specific report view are handled within the component
    headerActions = null;
  } else if (state === 'review' && queryData) {
    headerActions = (
      <Button onClick={handleRunAnalysis} size="lg">
        Run Analysis
      </Button>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(var(--popover))',
            color: 'hsl(var(--popover-foreground))',
            border: '1px solid hsl(var(--border))',
          },
          success: {
            iconTheme: {
              primary: 'hsl(var(--primary))',
              secondary: 'hsl(var(--primary-foreground))',
            },
          },
        }}
      />
      <AppLayout
        breadcrumbs={breadcrumbs}
        onNavigate={handleNavigate}
        onViewReport={handleViewUnifiedReport}
        onBreadcrumbClick={handleBreadcrumbClick}
        currentView={state}
        headerActions={headerActions}
        onNavigateToAccountSettings={handleNavigateToAccountSettings}
        onNavigateToPreferences={handleNavigateToPreferences}
        onLogout={handleLogout}
      >
        {state === 'unified-dashboard' && (
          <Dashboard onCreateReport={handleStartNewReport} onViewReport={handleViewUnifiedReport} />
        )}

        {state === 'form' && (
          <AnalysisForm onSubmit={handleSubmit} isLoading={false} onLoadExisting={loadExistingAnalysis} />
        )}

        {state === 'review' && queryData && (
          <QueryReview
            company={queryData.company}
            industry={queryData.industry}
            queries={queryData.queries}
            onConfirm={handleRunAnalysis}
            onBack={handleBackToForm}
            isLoading={false}
          />
        )}

        {state === 'report' && result && (
          <ReportView result={result} onNewAnalysis={handleNewAnalysis} />
        )}

        {state === 'unified-report' && currentAnalysisRunId && (
          <UnifiedReportView
            analysisRunId={currentAnalysisRunId}
            onNavigateToModel={handleNavigateToModel}
            onToggleFavorite={handleToggleFavorite}
            onNewAnalysis={handleNewAnalysis}
          />
        )}

        {state === 'model-report' && currentAnalysisRunId && currentModelName && (
          <ModelSpecificReportView
            analysisRunId={currentAnalysisRunId}
            modelName={currentModelName}
            onNavigateToUnified={handleNavigateToUnified}
            onNavigateToOtherModel={handleNavigateToOtherModel}
            onToggleFavorite={handleToggleFavorite}
            onNewAnalysis={handleNewAnalysis}
          />
        )}

        {state === 'account-settings' && (
          <AccountSettings onBack={handleBackToDashboard} />
        )}

        {state === 'preferences' && (
          <Preferences onBack={handleBackToDashboard} />
        )}
      </AppLayout>

      {/* Background analysis progress indicator */}
      <AnalysisProgress analyses={runningAnalyses} onDismiss={stopTracking} />
    </>
  );
}

export default App;
