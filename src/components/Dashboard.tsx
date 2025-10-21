import { useState, useEffect } from 'react';

interface DashboardProps {
  onNewReport: () => void;
  onViewReport: (analysisId: string) => void;
}

interface Report {
  id: string;
  companyName: string;
  industry: string;
  shareOfVoice: string;
  completedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function Dashboard({ onNewReport, onViewReport }: DashboardProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/recent-analyses`);
      if (response.ok) {
        const data = await response.json();
        setReports(data.analyses || []);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (reportId: string, companyName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/download-report/${reportId}`);

      if (!response.ok) {
        throw new Error('Failed to download report');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aeo-report-${companyName.toLowerCase().replace(/\s+/g, '-')}-${reportId}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const openDeleteModal = (report: Report) => {
    setReportToDelete(report);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setReportToDelete(null);
  };

  const confirmDelete = async () => {
    if (!reportToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/${reportToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      // Refresh the list
      await fetchReports();
      closeDeleteModal();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete report. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              AEO Reports Dashboard
            </h1>
            <p className="text-gray-600">
              View and manage your AI visibility analysis reports
            </p>
          </div>
          <button
            onClick={onNewReport}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + New Report
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && reports.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Reports Yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by creating your first AEO analysis report
            </p>
            <button
              onClick={onNewReport}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Your First Report
            </button>
          </div>
        )}

        {/* Reports List */}
        {!loading && reports.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    {/* Report Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {report.companyName}
                        </h3>
                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                          {Number(report.shareOfVoice).toFixed(1)}% SOV
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Industry:</span>
                          {report.industry}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium">Completed:</span>
                          {formatDate(report.completedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onViewReport(report.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDownload(report.id, report.companyName)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => openDeleteModal(report)}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && reportToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Delete Report?
              </h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete the report for{' '}
                <span className="font-semibold">{reportToDelete.companyName}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
