import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from './app-sidebar';
import { AppHeader } from './app-header';

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs: string[];
  onNavigate: (view: 'form' | 'unified-dashboard') => void;
  onViewReport: (analysisId: string) => void;
  onBreadcrumbClick?: (index: number) => void;
  currentView: string;
  headerActions?: ReactNode;
  onNavigateToAccountSettings?: () => void;
  onNavigateToPreferences?: () => void;
  onLogout?: () => void;
}

export function AppLayout({
  children,
  breadcrumbs,
  onNavigate,
  onViewReport,
  onBreadcrumbClick,
  currentView,
  headerActions,
  onNavigateToAccountSettings,
  onNavigateToPreferences,
  onLogout,
}: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar
        onNavigate={onNavigate}
        onViewReport={onViewReport}
        currentView={currentView}
        onNavigateToAccountSettings={onNavigateToAccountSettings}
        onNavigateToPreferences={onNavigateToPreferences}
        onLogout={onLogout}
      />
      <SidebarInset>
        <AppHeader
          breadcrumbs={breadcrumbs}
          onBreadcrumbClick={onBreadcrumbClick}
          actions={headerActions}
        />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
