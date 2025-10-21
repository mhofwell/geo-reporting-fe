import { useState } from 'react';
import type { GeneratedQuery } from '../api/client';

interface QueryReviewProps {
  company: string;
  industry: string;
  queries: GeneratedQuery[];
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function QueryReview({ company, industry, queries: initialQueries, onConfirm, onBack, isLoading }: QueryReviewProps) {
  const [queries, setQueries] = useState(initialQueries);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  const handleDelete = (id: string) => {
    setQueries(queries.filter(q => q.id !== id));
  };

  const handleEdit = (query: GeneratedQuery) => {
    setEditingId(query.id);
    setEditText(query.text);
  };

  const handleSaveEdit = () => {
    if (editingId) {
      setQueries(queries.map(q =>
        q.id === editingId ? { ...q, text: editText } : q
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const unbrandedQueries = queries.filter(q => q.category === 'UNBRANDED');
  const brandedQueries = queries.filter(q => q.category === 'BRANDED');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Review Queries
            </h1>
            <p className="text-gray-600">
              {company} • {industry}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {queries.length} total queries ({unbrandedQueries.length} unbranded, {brandedQueries.length} branded)
            </p>
          </div>

          {/* Unbranded Queries */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Unbranded Queries ({unbrandedQueries.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These measure organic visibility - {company} is not mentioned in the query
            </p>
            <div className="space-y-2">
              {unbrandedQueries.map((query, index) => (
                <div key={query.id} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <span className="text-sm font-medium text-gray-500 mt-1 w-8">
                    {index + 1}.
                  </span>
                  {editingId === query.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="flex-1 text-gray-900">{query.text}</p>
                      <button
                        onClick={() => handleEdit(query)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(query.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Branded Queries */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Branded Queries ({brandedQueries.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              These measure comparative positioning - {company} is mentioned in the query
            </p>
            <div className="space-y-2">
              {brandedQueries.map((query, index) => (
                <div key={query.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <span className="text-sm font-medium text-gray-500 mt-1 w-8">
                    {index + 1}.
                  </span>
                  {editingId === query.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <p className="flex-1 text-gray-900">{query.text}</p>
                      <button
                        onClick={() => handleEdit(query)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(query.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={onBack}
              disabled={isLoading}
              className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <div className="flex gap-4">
              <p className="text-sm text-gray-600 self-center">
                Est. time: 2-3 min • ~${(queries.length * 0.05).toFixed(2)} cost
              </p>
              <button
                onClick={onConfirm}
                disabled={isLoading || queries.length === 0}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {isLoading ? 'Starting...' : 'Run Analysis'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
