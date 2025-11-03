/**
 * API Client for GEO Analysis Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AnalysisRequest {
  company: string;
  industry: string;
  name: string;
  description?: string;
}

export interface AnalysisResult {
  analysisId: string;
  company: string;
  industry: string;
  shareOfVoice: number;
  totalQueries: number;
  brandMentions: number;
  competitorsDetected: number;
  topCompetitors: Array<{
    name: string;
    shareOfVoice: number;
    mentionCount: number;
  }>;
  positionBreakdown: {
    first: number;
    second: number;
    thirdOrLater: number;
  };
  insights: Array<{
    category: string;
    insight: string;
    recommendation: string;
  }>;
  attributes: {
    unbranded: {
      pricing: Record<string, number>;
      skillLevel: Record<string, number>;
      features: Record<string, number>;
      limitations: Record<string, number>;
      sentiment: Record<string, number>;
    };
    branded: {
      pricing: Record<string, number>;
      skillLevel: Record<string, number>;
      features: Record<string, number>;
      limitations: Record<string, number>;
      sentiment: Record<string, number>;
    };
  };
  visibilityGaps: Array<{
    query: string;
    competitors: Array<{
      name: string;
      position: string;
    }>;
  }>;
  sampleMentions: Array<{
    query: string;
    excerpt: string;
  }>;
  reportPath: string;
  executionTime: number;
}

export interface GeneratedQuery {
  id: string;
  text: string;
  type: string;
  category: 'BRANDED' | 'UNBRANDED';
}

export interface GenerateQueriesResult {
  analysisId: string;
  company: string;
  industry: string;
  queries: GeneratedQuery[];
}

export async function generateQueries(request: AnalysisRequest): Promise<GenerateQueriesResult> {
  const response = await fetch(`${API_BASE_URL}/generate-queries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Query generation failed');
  }

  return response.json();
}

export async function runAnalysis(analysisId: string): Promise<AnalysisResult> {
  const response = await fetch(`${API_BASE_URL}/run-analysis`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ analysisId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Analysis failed');
  }

  return response.json();
}

export interface ProgressEvent {
  type: 'progress' | 'complete' | 'error';
  step?: string;
  progress?: number;
  message?: string;
  result?: AnalysisResult;
  error?: string;
}

export async function runAnalysisWithProgress(
  analysisId: string,
  onProgress: (progress: number, message: string) => void
): Promise<AnalysisResult> {
  // Start the analysis (fire-and-forget)
  const startResponse = await fetch(`${API_BASE_URL}/run-analysis-async`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ analysisId }),
  });

  if (!startResponse.ok) {
    const error = await startResponse.json();
    throw new Error(error.message || 'Failed to start analysis');
  }

  // Poll for status updates
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Poll every 1 second

    const statusResponse = await fetch(`${API_BASE_URL}/analysis-status/${analysisId}`);

    if (!statusResponse.ok) {
      const error = await statusResponse.json();
      throw new Error(error.message || 'Failed to check status');
    }

    const statusData = await statusResponse.json();

    // Update progress
    if (statusData.progress !== undefined && statusData.message) {
      onProgress(statusData.progress, statusData.message);
    }

    // Check if completed
    if (statusData.status === 'completed' && statusData.result) {
      return statusData.result;
    }

    // Check if failed
    if (statusData.status === 'failed') {
      throw new Error(statusData.message || 'Analysis failed');
    }
  }
}

export async function healthCheck(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
}

export async function deleteAnalysis(analysisId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete analysis');
  }
}

// Unified Dashboard API Types
export interface QueryGroup {
  id: string;
  name: string;
  companyName: string;
  industry: string;
  isDefaultGroup: boolean;
  createdAt: string;
}

export interface AnalysisRunResult {
  id: string;
  status: string;
  queryGroup: {
    id: string;
    name: string;
    companyName: string;
    industry: string;
  };
  metrics: {
    overallSOV: number;
    overallMentionRate: number;
    claudeSOV: number | null;
    gptSOV: number | null;
    topCompetitors: Array<{
      name: string;
      avgSOV: number;
      claudeSOV?: number;
      gptSOV?: number;
      mentions: number;
    }>;
    attributeBreakdown: {
      [key: string]: {
        overall: number;
        claude?: number;
        gpt?: number;
        mentions: number;
      };
    };
    gaps: {
      missingQueries: number;
      topGaps: string[];
      competitorOnlyMentions: { [key: string]: number };
    };
  };
  executionTimeMs: number;
  completedAt: string;
}

// Unified Dashboard API Functions

/**
 * Get all query groups, optionally filtered by default status.
 * @param isDefaultOnly - If true, only return query groups marked as default
 */
export async function getQueryGroups(isDefaultOnly?: boolean): Promise<QueryGroup[]> {
  try {
    const url = new URL(`${API_BASE_URL}/query-groups`);
    if (isDefaultOnly !== undefined) {
      url.searchParams.append('defaultOnly', isDefaultOnly.toString());
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch query groups' }));
      throw new Error(error.message || 'Failed to fetch query groups');
    }

    const data = await response.json();
    return data.queryGroups;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching query groups');
  }
}

export async function getLatestAnalysisRun(queryGroupId: string): Promise<AnalysisRunResult | null> {
  const response = await fetch(`${API_BASE_URL}/query-groups/${queryGroupId}/latest-run`);
  if (!response.ok) {
    // 404 means no analysis run exists yet - this is normal, not an error
    if (response.status === 404) {
      return null;
    }
    throw new Error('Failed to fetch latest analysis run');
  }
  return response.json();
}

export async function getAnalysisRun(analysisRunId: string): Promise<AnalysisRunResult> {
  const response = await fetch(`${API_BASE_URL}/analysis-run/${analysisRunId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch analysis run');
  }
  return response.json();
}

// Multi-Model Dashboard API Types
export interface DefaultReportSummary {
  queryGroupId: string;
  companyName: string;
  industry: string;
  overallSOV: number;
  claudeSOV: number;
  gptSOV: number;
  modelAgreementScore: number; // 0-1 scale
  topCompetitor: {
    name: string;
    sov: number;
  } | null;
  lastRunAt: string; // ISO date
  analysisRunId: string;
}

export interface ModelSpecificReport extends Omit<AnalysisRunResult, 'id'> {
  model: 'CLAUDE_SONNET_4' | 'GPT_4' | 'GPT_4_TURBO';
  analysisRunId: string;
}

export interface ModelPerformance {
  sov: number;
  mentionRate: number;
  avgPosition: number;
  topCompetitors: Array<{ name: string; sov: number }>;
  topAttributes: string[];
}

export interface UnifiedReport {
  analysisRunId: string;
  companyName: string;
  industry: string;
  overallMetrics: {
    overallSOV: number;
    claudeSOV: number;
    gptSOV: number;
    modelAgreementScore: number;
  };
  modelComparison: {
    claude: ModelPerformance;
    gpt: ModelPerformance;
  };
  queryGroupId: string;
  lastRunAt: string;
}

// Multi-Model Dashboard API Functions

/**
 * Toggle the default status of a query group report.
 * Only one report can be marked as default at a time.
 */
export async function toggleDefaultReport(queryGroupId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/query-groups/${queryGroupId}/toggle-default`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to toggle default report' }));
      throw new Error(error.message || 'Failed to toggle default report');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while toggling default report');
  }
}

/**
 * Get all query groups that are marked as default for the dashboard.
 * Returns summary data suitable for dashboard display.
 */
export async function getDefaultReports(): Promise<DefaultReportSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/default-reports`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch default reports' }));
      throw new Error(error.message || 'Failed to fetch default reports');
    }

    const data = await response.json();
    return data.reports || [];
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching default reports');
  }
}

/**
 * Get a model-specific report filtered to show data for only one model.
 * @param analysisRunId - The ID of the analysis run
 * @param modelName - The specific model to filter by ('CLAUDE_SONNET_4' | 'GPT_4')
 */
export async function getModelReport(
  analysisRunId: string,
  modelName: 'CLAUDE_SONNET_4' | 'GPT_4'
): Promise<ModelSpecificReport> {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis-run/${analysisRunId}/model/${modelName}`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch model-specific report' }));
      throw new Error(error.message || 'Failed to fetch model-specific report');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching model-specific report');
  }
}

/**
 * Get a unified cross-model report that compares performance across all models.
 * Includes model agreement scores and comparative metrics.
 */
export async function getUnifiedReport(analysisRunId: string): Promise<UnifiedReport> {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis-run/${analysisRunId}/unified`);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch unified report' }));
      throw new Error(error.message || 'Failed to fetch unified report');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred while fetching unified report');
  }
}

