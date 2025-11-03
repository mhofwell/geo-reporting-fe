import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Building2, Calendar, Download, Trash2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisCardProps {
  id: string;
  companyName: string;
  industry: string;
  shareOfVoice?: string;
  completedAt?: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  progressMessage?: string;
  onView?: (id: string) => void;
  onDownload?: (id: string, companyName: string) => void;
  onDelete?: (id: string, companyName: string) => void;
}

export function AnalysisCard({
  id,
  companyName,
  industry,
  shareOfVoice,
  completedAt,
  status = 'completed',
  progress = 0,
  progressMessage = 'Starting analysis...',
  onView,
  onDownload,
  onDelete,
}: AnalysisCardProps) {
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

  const isLoading = status === 'running' || status === 'pending';
  const isCompleted = status === 'completed';
  const isFailed = status === 'failed';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={`
          bg-card border-border transition-all
          ${isLoading ? 'border-primary/50 animate-pulse' : 'hover:border-primary/50'}
          ${isFailed ? 'border-destructive/50' : ''}
        `}
      >
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">{companyName}</div>
            {isCompleted && shareOfVoice && (
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {Number(shareOfVoice).toFixed(1)}%
              </Badge>
            )}
            {isLoading && (
              <Badge variant="default" className="text-xs px-2 py-1">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Running
              </Badge>
            )}
            {isFailed && (
              <Badge variant="destructive" className="text-xs px-2 py-1">
                Failed
              </Badge>
            )}
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {industry}
            </div>
            {completedAt && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3" />
                {formatDate(completedAt)}
              </div>
            )}
          </div>

          {/* Loading Progress */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 pt-2 border-t"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{progressMessage}</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="space-y-2">
          {isCompleted && (
            <>
              <Button onClick={() => onView?.(id)} className="w-full">
                View Report
              </Button>
              <div className="flex gap-2">
                <Button
                  onClick={() => onDownload?.(id, companyName)}
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button
                  onClick={() => onDelete?.(id, companyName)}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {isLoading && (
            <Button disabled className="w-full">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analysis in Progress...
            </Button>
          )}

          {isFailed && (
            <div className="flex gap-2">
              <Button
                onClick={() => onDelete?.(id, companyName)}
                variant="destructive"
                size="sm"
                className="flex-1"
              >
                Remove Failed Analysis
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
