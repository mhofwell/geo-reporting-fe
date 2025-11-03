import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Loader2,
  MoreHorizontal,
  Trash2,
  Star,
  StarOff,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileSidebar } from './user-profile-sidebar';
import { getDefaultReports, toggleDefaultReport, type DefaultReportSummary } from '@/api/client';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface AppSidebarProps {
  onNavigate: (view: 'form' | 'unified-dashboard') => void;
  onViewReport: (analysisId: string) => void;
  currentView: string;
  onNavigateToAccountSettings?: () => void;
  onNavigateToPreferences?: () => void;
  onLogout?: () => void;
}

interface RecentAnalysis {
  id: string;
  companyName: string;
  industry: string;
  shareOfVoice?: string;
  completedAt?: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  progress?: number;
  isDefaultGroup?: boolean;
  queryGroupId?: string;
}

const navItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    view: 'unified-dashboard' as const,
  },
  {
    title: 'New Report',
    icon: PlusCircle,
    view: 'form' as const,
  },
];

export function AppSidebar({
  onNavigate,
  onViewReport,
  currentView,
  onNavigateToAccountSettings,
  onNavigateToPreferences,
  onLogout
}: AppSidebarProps) {
  const [recentAnalyses, setRecentAnalyses] = useState<RecentAnalysis[]>([]);
  const [defaultReports, setDefaultReports] = useState<DefaultReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDefaults, setLoadingDefaults] = useState(true);

  useEffect(() => {
    fetchRecentAnalyses();
    fetchDefaultReports();
  }, []);

  // Poll for updates if there are running analyses
  useEffect(() => {
    const hasRunningAnalyses = recentAnalyses.some(
      a => a.status === 'running' || a.status === 'pending'
    );

    if (!hasRunningAnalyses) return;

    const interval = setInterval(fetchRecentAnalyses, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, [recentAnalyses]);

  const fetchRecentAnalyses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/recent-analyses`);
      if (response.ok) {
        const data = await response.json();
        setRecentAnalyses((data.analyses || []).slice(0, 5)); // Limit to 5 most recent
      }
    } catch (error) {
      console.error('Failed to load recent analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultReports = async () => {
    setLoadingDefaults(true);
    try {
      const reports = await getDefaultReports();
      setDefaultReports(reports.slice(0, 5)); // Limit to 5 default reports
    } catch (error) {
      console.error('Failed to load default reports:', error);
    } finally {
      setLoadingDefaults(false);
    }
  };

  const handleDelete = async (analysisId: string, companyName: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analysis/${analysisId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete analysis');
      }

      toast.success(`Deleted ${companyName} analysis`);
      fetchRecentAnalyses(); // Refresh the list
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error('Failed to delete analysis. Please try again.');
    }
  };

  const handleToggleDefault = async (queryGroupId: string, companyName: string, isCurrentlyDefault: boolean) => {
    try {
      await toggleDefaultReport(queryGroupId);
      toast.success(
        isCurrentlyDefault
          ? `Removed ${companyName} from favorites`
          : `Added ${companyName} to favorites`
      );

      // Refresh both lists
      fetchDefaultReports();
      fetchRecentAnalyses();
    } catch (error) {
      console.error('Toggle default failed:', error);
      toast.error('Failed to update favorites. Please try again.');
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LayoutDashboard className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">GEO Reporting</span>
                <span className="truncate text-xs text-muted-foreground">AI Visibility</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.view)}
                    isActive={currentView === item.view}
                    tooltip={item.title}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Favorites */}
        <SidebarGroup>
          <SidebarGroupLabel>Favorites</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loadingDefaults ? (
                <>
                  <SidebarMenuItem>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuItem>
                </>
              ) : defaultReports.length > 0 ? (
                defaultReports.map((report) => (
                  <SidebarMenuItem key={report.queryGroupId}>
                    <SidebarMenuButton
                      onClick={() => onViewReport(report.analysisRunId)}
                      tooltip={report.companyName}
                    >
                      <Star className="size-4 fill-primary text-primary" />
                      <span className="truncate">{report.companyName}</span>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                          <span className="text-xs font-medium text-muted-foreground">
                            {report.overallSOV.toFixed(1)}%
                          </span>
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          onClick={() => onViewReport(report.analysisRunId)}
                          className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleDefault(report.queryGroupId, report.companyName, true)
                          }
                          className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        >
                          <StarOff className="mr-2 h-4 w-4" />
                          Remove from Favorites
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground/50">
                    Star reports to track them!
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent Analyses */}
        <SidebarGroup>
          <SidebarGroupLabel>Recents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {loading ? (
                <>
                  <SidebarMenuItem>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <Skeleton className="h-8 w-full" />
                  </SidebarMenuItem>
                </>
              ) : recentAnalyses.length > 0 ? (
                recentAnalyses.map((analysis) => {
                  const isRunning = analysis.status === 'running' || analysis.status === 'pending';
                  const isCompleted = analysis.status === 'completed';
                  const isDefault = analysis.isDefaultGroup;
                  const hasQueryGroupId = !!analysis.queryGroupId;

                  return (
                    <SidebarMenuItem key={analysis.id}>
                      <SidebarMenuButton
                        onClick={() => isCompleted && onViewReport(analysis.id)}
                        tooltip={analysis.companyName}
                        disabled={isRunning}
                      >
                        <span className="truncate">{analysis.companyName}</span>
                      </SidebarMenuButton>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <SidebarMenuAction showOnHover>
                            {isRunning ? (
                              <Loader2 className="size-4 animate-spin text-primary" />
                            ) : isCompleted && analysis.shareOfVoice ? (
                              <span className="text-xs font-medium text-muted-foreground">
                                {Number(analysis.shareOfVoice).toFixed(1)}%
                              </span>
                            ) : (
                              <MoreHorizontal className="size-4" />
                            )}
                          </SidebarMenuAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start">
                          {!isRunning && (
                            <DropdownMenuItem
                              onClick={() =>
                                hasQueryGroupId && handleToggleDefault(
                                  analysis.queryGroupId!,
                                  analysis.companyName,
                                  !!isDefault
                                )
                              }
                              disabled={!hasQueryGroupId}
                              className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            >
                              {isDefault ? (
                                <>
                                  <StarOff className="mr-2 h-4 w-4" />
                                  Unstar
                                </>
                              ) : (
                                <>
                                  <Star className="mr-2 h-4 w-4" />
                                  Star
                                </>
                              )}
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDelete(analysis.id, analysis.companyName)}
                            className="text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </SidebarMenuItem>
                  );
                })
              ) : (
                <SidebarMenuItem>
                  <div className="px-2 py-1.5 text-xs text-muted-foreground">
                    No recent reports
                  </div>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserProfileSidebar
          onNavigateToAccountSettings={onNavigateToAccountSettings}
          onNavigateToPreferences={onNavigateToPreferences}
          onLogout={onLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
