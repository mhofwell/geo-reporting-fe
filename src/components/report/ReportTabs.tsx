import { motion } from 'framer-motion';
import { BarChart3, Target, Lightbulb, AlertTriangle, FileText } from 'lucide-react';
import { useReportViewStore, type ReportTab } from '@/store/reportViewStore';

interface Tab {
  id: ReportTab;
  label: string;
  icon: typeof BarChart3;
  description: string;
}

const tabs: Tab[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: BarChart3,
    description: 'Executive summary and key metrics'
  },
  {
    id: 'competition',
    label: 'Competition',
    icon: Target,
    description: 'Competitive landscape analysis'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Lightbulb,
    description: 'Strategic recommendations'
  },
  {
    id: 'gaps',
    label: 'Gaps',
    icon: AlertTriangle,
    description: 'Visibility opportunities'
  },
  {
    id: 'details',
    label: 'Details',
    icon: FileText,
    description: 'Full analysis data'
  }
];

export function ReportTabs() {
  const { activeTab, setActiveTab } = useReportViewStore();

  return (
    <div className="border-b border-border bg-card/50">
      <div className="flex space-x-1 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-4 py-3 text-sm font-medium transition-colors
                flex items-center gap-2
                ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
              title={tab.description}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
