import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface RunningAnalysis {
  analysisId: string;
  companyName: string;
  reportName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
  startedAt: number; // timestamp
}

interface AnalysisStatusResponse {
  status: 'pending' | 'query_generation' | 'query_approval' | 'executing' | 'analyzing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  result?: unknown;
}

export function useBackgroundAnalysis() {
  const [runningAnalyses, setRunningAnalyses] = useState<RunningAnalysis[]>([]);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  // Poll for analysis status updates
  useEffect(() => {
    if (runningAnalyses.length === 0) {
      if (pollingInterval) {
        window.clearInterval(pollingInterval);
        setPollingInterval(null);
      }
      return;
    }

    // Start polling if not already polling
    if (!pollingInterval) {
      const interval = window.setInterval(() => {
        checkAnalysisStatuses();
      }, 2000); // Poll every 2 seconds
      setPollingInterval(interval);
    }

    return () => {
      if (pollingInterval) {
        window.clearInterval(pollingInterval);
      }
    };
  }, [runningAnalyses.length, pollingInterval]);

  // Check status of all running analyses
  const checkAnalysisStatuses = useCallback(async () => {
    const updatedAnalyses = await Promise.all(
      runningAnalyses.map(async (analysis) => {
        if (analysis.status === 'completed' || analysis.status === 'failed') {
          return analysis; // Don't poll completed/failed analyses
        }

        try {
          const response = await fetch(`${API_BASE_URL}/analysis-status/${analysis.analysisId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch status');
          }

          const data: AnalysisStatusResponse = await response.json();

          // Map backend status to our simplified status
          let status: RunningAnalysis['status'] = 'running';
          if (data.status === 'completed') {
            status = 'completed';
            // Show success toast
            toast.success(
              `Analysis "${analysis.reportName}" completed!`,
              {
                duration: 5000,
                id: `completed-${analysis.analysisId}`, // Prevent duplicates
              }
            );
          } else if (data.status === 'failed') {
            status = 'failed';
            // Show error toast
            toast.error(
              `Analysis "${analysis.reportName}" failed`,
              {
                duration: 5000,
                id: `failed-${analysis.analysisId}`,
              }
            );
          } else if (data.status === 'pending' || data.status === 'query_generation' || data.status === 'query_approval') {
            status = 'pending';
          }

          return {
            ...analysis,
            status,
            progress: data.progress ?? analysis.progress,
            message: data.message ?? analysis.message,
          };
        } catch (error) {
          console.error(`Failed to check status for analysis ${analysis.analysisId}:`, error);
          return analysis;
        }
      })
    );

    setRunningAnalyses(updatedAnalyses);

    // Clean up completed/failed analyses after 30 seconds
    setTimeout(() => {
      setRunningAnalyses((prev) =>
        prev.filter((a) => a.status !== 'completed' && a.status !== 'failed')
      );
    }, 30000);
  }, [runningAnalyses]);

  // Add a new analysis to track
  const trackAnalysis = useCallback(
    (analysisId: string, companyName: string, reportName: string) => {
      const newAnalysis: RunningAnalysis = {
        analysisId,
        companyName,
        reportName,
        status: 'running',
        progress: 0,
        message: 'Starting analysis...',
        startedAt: Date.now(),
      };

      setRunningAnalyses((prev) => {
        // Prevent duplicates
        if (prev.some((a) => a.analysisId === analysisId)) {
          return prev;
        }
        return [...prev, newAnalysis];
      });

      toast.success(`Analysis "${reportName}" started in background`, {
        duration: 3000,
      });
    },
    []
  );

  // Stop tracking an analysis
  const stopTracking = useCallback((analysisId: string) => {
    setRunningAnalyses((prev) => prev.filter((a) => a.analysisId !== analysisId));
  }, []);

  return {
    runningAnalyses,
    trackAnalysis,
    stopTracking,
    hasRunningAnalyses: runningAnalyses.length > 0,
  };
}
