import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface AnalysisFormProps {
    onSubmit: (company: string, industry: string, name: string, description: string) => void;
    isLoading: boolean;
    onLoadExisting?: (analysisId: string) => void;
}

interface PastAnalysis {
    id: string;
    companyName: string;
    industry: string;
    shareOfVoice: string;
    completedAt: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function AnalysisForm({
    onSubmit,
    isLoading,
    onLoadExisting,
}: AnalysisFormProps) {
    const [company, setCompany] = useState('');
    const [industry, setIndustry] = useState('');
    const [reportName, setReportName] = useState('');
    const [description, setDescription] = useState('');
    const [pastAnalyses, setPastAnalyses] = useState<PastAnalysis[]>([]);
    const [loadingPast, setLoadingPast] = useState(false);

    useEffect(() => {
        fetchPastAnalyses();
    }, []);

    const fetchPastAnalyses = async () => {
        setLoadingPast(true);
        try {
            const response = await fetch(`${API_BASE_URL}/recent-analyses`);
            if (response.ok) {
                const data = await response.json();
                setPastAnalyses(data.analyses || []);
            }
        } catch (error) {
            console.error('Failed to load past analyses:', error);
        } finally {
            setLoadingPast(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (company.trim() && industry.trim() && reportName.trim()) {
            onSubmit(
                company.trim(),
                industry.trim(),
                reportName.trim(),
                description.trim()
            );
        }
    };

    return (
        <div className="flex items-center justify-center py-8">
            <Card className="w-full max-w-md bg-card border-border">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl text-center">
                        New Analysis
                    </CardTitle>
                    <CardDescription className="text-center">
                        Analyze your brand's AI visibility in 3 minutesß
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Required Fields Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="company"
                                    className="text-base font-medium"
                                >
                                    Company Name
                                </Label>
                                <Input
                                    id="company"
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    placeholder="e.g., Nike"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="industry"
                                    className="text-base font-medium"
                                >
                                    Industry
                                </Label>
                                <Input
                                    id="industry"
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    placeholder="e.g., Athletic Apparel"
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="reportName"
                                    className="text-base font-medium"
                                >
                                    Report Name
                                </Label>
                                <Input
                                    id="reportName"
                                    type="text"
                                    value={reportName}
                                    onChange={(e) => setReportName(e.target.value)}
                                    placeholder="e.g., Nike - Q4 Campaign or Air Max Pro 3 - Durability"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        {/* Optional Fields Section */}
                        <div className="pt-2 border-t space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-base font-medium"
                            >
                                Analysis Focus <span className="text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what you want to analyze. Examples:&#10;• Product: &quot;Focus on Air Max Pro 3 durability and longevity&quot;&#10;• Topic: &quot;Research Nike as an employer - work culture and benefits&quot;&#10;• Problem: &quot;Analyze Nike's solutions for marathon runner knee pain&quot;"
                                disabled={isLoading}
                                rows={4}
                                className="resize-none"
                            />
                            <p className="text-xs text-muted-foreground">
                                Provide specific focus areas to generate more targeted queries. Leave blank for general brand analysis.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={
                                isLoading || !company.trim() || !industry.trim() || !reportName.trim()
                            }
                            className="w-full"
                            size="lg"
                        >
                            {isLoading ? 'Analyzing...' : 'Analyze Brand'}
                        </Button>
                    </form>

                    <p className="text-sm text-muted-foreground text-center">
                        Est. 2-3 minutes • ~30 AI queries
                    </p>

                    {/* Past Analyses Dropdown */}
                    {pastAnalyses.length > 0 && (
                        <div className="pt-4 border-t space-y-3">
                            <h3 className="text-sm font-semibold">
                                View Past Reports
                            </h3>
                            {loadingPast ? (
                                <p className="text-sm text-muted-foreground">
                                    Loading...
                                </p>
                            ) : (
                                <Select
                                    onValueChange={(value) => {
                                        if (value && onLoadExisting) {
                                            onLoadExisting(value);
                                        }
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a past analysis..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {pastAnalyses.map((analysis) => (
                                            <SelectItem
                                                key={analysis.id}
                                                value={analysis.id}
                                            >
                                                {analysis.companyName} (
                                                {analysis.industry}) -{' '}
                                                {Number(
                                                    analysis.shareOfVoice
                                                ).toFixed(1)}
                                                % SOV
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
