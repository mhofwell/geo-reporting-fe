import { useState } from 'react';
import type { GeneratedQuery } from '../api/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface QueryReviewProps {
  company: string;
  industry: string;
  queries: GeneratedQuery[];
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function QueryReview({ company, industry, queries: initialQueries }: QueryReviewProps) {
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
    <div className="space-y-6 max-w-5xl">
      <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-3xl mb-2">Review Queries</CardTitle>
                <CardDescription>
                  {company} • {industry}
                </CardDescription>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline">{queries.length} total</Badge>
                  <Badge variant="secondary">{unbrandedQueries.length} unbranded</Badge>
                  <Badge variant="secondary">{brandedQueries.length} branded</Badge>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Unbranded Queries */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl">Unbranded Queries ({unbrandedQueries.length})</CardTitle>
            <CardDescription>
              These measure organic visibility - {company} is not mentioned in the query
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {unbrandedQueries.map((query, index) => (
              <div key={query.id} className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
                <span className="text-sm font-medium text-muted-foreground mt-1 w-8">
                  {index + 1}.
                </span>
                {editingId === query.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      onClick={handleSaveEdit}
                      variant="secondary"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="flex-1 text-sm">{query.text}</p>
                    <Button
                      onClick={() => handleEdit(query)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(query.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Branded Queries */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl">Branded Queries ({brandedQueries.length})</CardTitle>
            <CardDescription>
              These measure comparative positioning - {company} is mentioned in the query
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {brandedQueries.map((query, index) => (
              <div key={query.id} className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
                <span className="text-sm font-medium text-muted-foreground mt-1 w-8">
                  {index + 1}.
                </span>
                {editingId === query.id ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button
                      onClick={handleSaveEdit}
                      variant="secondary"
                      size="sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="flex-1 text-sm">{query.text}</p>
                    <Button
                      onClick={() => handleEdit(query)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(query.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Info Footer */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Est. time: 2-3 min • ~${(queries.length * 0.05).toFixed(2)} cost • {queries.length} queries
            </p>
          </CardContent>
        </Card>
    </div>
  );
}
