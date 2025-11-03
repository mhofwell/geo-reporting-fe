import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, AlertTriangle, Sparkles } from 'lucide-react';
import { DefaultReportCard } from './dashboard/DefaultReportCard';
import {
    getDefaultReports,
    toggleDefaultReport,
    type DefaultReportSummary,
} from '@/api/client';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardProps {
    onCreateReport?: () => void;
    onViewReport?: (analysisRunId: string) => void;
}

export function Dashboard({ onCreateReport, onViewReport }: DashboardProps) {
    const [defaultReports, setDefaultReports] = useState<
        DefaultReportSummary[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch default reports on mount
    useEffect(() => {
        async function fetchDefaultReports() {
            setLoading(true);
            setError(null);
            try {
                const reports = await getDefaultReports();
                setDefaultReports(reports);
            } catch (err) {
                console.error('Failed to fetch default reports:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to load reports'
                );
            } finally {
                setLoading(false);
            }
        }
        fetchDefaultReports();
    }, []);

    // Handle viewing a report - use callback prop if provided
    const handleViewReport = (analysisRunId: string) => {
        if (onViewReport) {
            onViewReport(analysisRunId);
        }
    };

    // Handle toggling favorite status
    const handleToggleFavorite = async (queryGroupId: string) => {
        try {
            await toggleDefaultReport(queryGroupId);
            // Refresh the list after toggling
            const reports = await getDefaultReports();
            setDefaultReports(reports);
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
            // Show error to user - could add toast notification here
        }
    };

    // Loading state with skeletons
    if (loading) {
        return (
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-24 mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-16 w-full" />
                                <Skeleton className="h-8 w-full" />
                                <Skeleton className="h-8 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] p-6">
                <Card className="max-w-2xl w-full">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-destructive/10 p-6">
                                <AlertTriangle className="h-16 w-16 text-destructive" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-2xl">
                                Failed to Load Reports
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                {error}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Empty state: No favorite reports
    if (defaultReports.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] p-6">
                <Card className="max-w-2xl w-full">
                    <CardHeader className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-primary/10 p-6">
                                <Sparkles className="h-16 w-16 text-primary" />
                            </div>
                        </div>
                        <div>
                            <CardTitle className="text-2xl">
                                You haven't run any reports yet
                            </CardTitle>
                            <CardDescription className="text-base mt-2">
                                Run reports and favorite them to see them here
                                for quick access
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                What you'll see here
                            </h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <div>
                                        <strong className="font-medium">
                                            Overall Share of Voice:
                                        </strong>{' '}
                                        Compare your brand's visibility across
                                        Claude and GPT
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <div>
                                        <strong className="font-medium">
                                            Model Comparison:
                                        </strong>{' '}
                                        See how different AI models perceive
                                        your brand
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <div>
                                        <strong className="font-medium">
                                            Agreement Scores:
                                        </strong>{' '}
                                        Identify consistency across AI platforms
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                    </div>
                                    <div>
                                        <strong className="font-medium">
                                            Top Competitors:
                                        </strong>{' '}
                                        Track your competitive landscape
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-center pt-2">
                            <Button size="lg" onClick={onCreateReport}>
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Your First Report
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Main dashboard with grid of favorite reports
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Your Favorite Reports
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Quick comparison of your starred reports across AI
                        models
                    </p>
                </div>
                <Button onClick={onCreateReport}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Report
                </Button>
            </div>

            {/* Grid of favorite reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {defaultReports.map((report) => (
                    <DefaultReportCard
                        key={report.queryGroupId}
                        report={report}
                        onViewReport={handleViewReport}
                        onToggleFavorite={handleToggleFavorite}
                    />
                ))}
            </div>
        </div>
    );
}
