/**
 * API Client for AEO Analysis Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface AnalysisRequest {
  company: string;
  industry: string;
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
