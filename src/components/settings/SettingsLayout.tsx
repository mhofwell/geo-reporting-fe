import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface SettingsLayoutProps {
  children: React.ReactNode;
  title: string;
  activeTab: 'account' | 'preferences';
  onTabChange: (tab: 'account' | 'preferences') => void;
  onBack: () => void;
}

/**
 * Shared layout wrapper for Settings pages
 * Provides consistent header, breadcrumb navigation, and tab switching
 */
export function SettingsLayout({
  children,
  title,
  activeTab,
  onTabChange,
  onBack,
}: SettingsLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <h1 className="text-2xl font-semibold">{title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 max-w-7xl">
          <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'account' | 'preferences')}>
            <TabsList className="h-12 bg-transparent border-b-0 rounded-none p-0">
              <TabsTrigger
                value="account"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 h-12"
              >
                Account Settings
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 h-12"
              >
                Preferences
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {children}
      </div>
    </div>
  );
}
