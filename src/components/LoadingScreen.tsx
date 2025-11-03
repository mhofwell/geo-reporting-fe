import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';

interface LoadingScreenProps {
  company: string;
  progress?: number;
  message?: string;
}

export function LoadingScreen({ company, progress = 0, message = 'Starting analysis...' }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Spinner className="w-16 h-16" />
          </div>
          <div>
            <CardTitle className="text-3xl mb-2">Analyzing {company}</CardTitle>
            <CardDescription>This may take 2-3 minutes</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Progress value={progress} className="h-3" />
            <p className="text-center text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-primary">{message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
