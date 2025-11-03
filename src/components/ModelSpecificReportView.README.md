# ModelSpecificReportView Component

A comprehensive React component for displaying AI model-specific analysis reports with rich visualizations, metrics, and navigation.

## Overview

`ModelSpecificReportView` displays analysis results filtered to a single AI model (Claude Sonnet 4 or GPT-4). It provides model-specific theming, performance metrics, and easy navigation between unified reports and different model views.

## Features

- **Model-Specific Theming**: Blue theme for Claude, green theme for GPT-4
- **Comprehensive Metrics**: SOV, mention rate, competitor analysis, visibility gaps
- **Tab-Based Navigation**: Reuses existing report tabs (Overview, Competition, Insights, Gaps, Details)
- **Quick Actions**: Navigate to unified report, switch models, download, start new analysis
- **Favorite Functionality**: Star/unstar reports for quick access
- **Loading & Error States**: Skeleton loaders and error handling
- **Responsive Design**: Works seamlessly on all screen sizes

## Installation

```tsx
import { ModelSpecificReportView } from '@/components/ModelSpecificReportView';
```

## Props

```typescript
interface ModelSpecificReportViewProps {
  // Required
  analysisRunId: string;                              // Analysis run identifier
  modelName: 'CLAUDE_SONNET_4' | 'GPT_4';            // Which model to display
  onNavigateToUnified: () => void;                    // Navigate to unified cross-model report
  onNavigateToOtherModel: (modelName) => void;        // Switch to other model's view

  // Optional
  onToggleFavorite?: (queryGroupId: string) => void;  // Toggle favorite status
  onNewAnalysis?: () => void;                         // Start new analysis
  isFavorite?: boolean;                               // Is this report favorited?
}
```

## Basic Usage

```tsx
import { ModelSpecificReportView } from '@/components/ModelSpecificReportView';

function MyReportPage() {
  return (
    <ModelSpecificReportView
      analysisRunId="clxyz123456"
      modelName="CLAUDE_SONNET_4"
      onNavigateToUnified={() => navigate('/unified-report')}
      onNavigateToOtherModel={(model) => navigate(`/model/${model}`)}
      onNewAnalysis={() => navigate('/new-analysis')}
    />
  );
}
```

## Usage with React Router

```tsx
import { useParams, useNavigate } from 'react-router-dom';
import { ModelSpecificReportView } from '@/components/ModelSpecificReportView';

function ModelReportRoute() {
  const { analysisRunId, modelName } = useParams();
  const navigate = useNavigate();

  return (
    <ModelSpecificReportView
      analysisRunId={analysisRunId}
      modelName={modelName as 'CLAUDE_SONNET_4' | 'GPT_4'}
      onNavigateToUnified={() => navigate(`/reports/${analysisRunId}/unified`)}
      onNavigateToOtherModel={(model) => navigate(`/reports/${analysisRunId}/model/${model}`)}
      onNewAnalysis={() => navigate('/new-analysis')}
    />
  );
}
```

## With Favorite Functionality

```tsx
function ReportWithFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleToggleFavorite = (queryGroupId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(queryGroupId)) {
        next.delete(queryGroupId);
      } else {
        next.add(queryGroupId);
      }
      return next;
    });
  };

  return (
    <ModelSpecificReportView
      analysisRunId="clxyz123456"
      modelName="CLAUDE_SONNET_4"
      onNavigateToUnified={() => console.log('Navigate')}
      onNavigateToOtherModel={(model) => console.log('Switch to', model)}
      onToggleFavorite={handleToggleFavorite}
      isFavorite={favorites.has('query-group-id')}
    />
  );
}
```

## Component Structure

### Header Section
- Company name and industry
- Prominent model badge (Claude/GPT-4)
- Star icon for favorites
- Action buttons (Unified Report, View Other Model, Download, New Report)
- Model-specific alert banner
- Key metrics cards (SOV, Mention Rate, Top Competitor, Visibility Gaps)

### Report Tabs
Reuses existing tab components:
1. **Overview** - Executive summary, SOV, position distribution
2. **Competition** - Competitor rankings and analysis
3. **Insights** - Strategic insights and recommendations
4. **Gaps** - Visibility gaps and opportunities
5. **Details** - Query-level details and raw data

### Footer Section
- Model branding
- Execution time and stats
- Comparison CTA to unified/other model

## Model Theming

### Claude Sonnet 4
- Primary Color: Blue (#3b82f6)
- Badge: `bg-blue-500 text-white`
- Accent: Blue accents throughout

### GPT-4
- Primary Color: Green (#10b981)
- Badge: `bg-green-500 text-white`
- Accent: Green accents throughout

## API Integration

The component fetches data using:

```typescript
getModelReport(analysisRunId, modelName): Promise<ModelSpecificReport>
```

Returns:
```typescript
interface ModelSpecificReport {
  model: 'CLAUDE_SONNET_4' | 'GPT_4' | 'GPT_4_TURBO';
  analysisRunId: string;
  queryGroup: {
    id: string;
    name: string;
    companyName: string;
    industry: string;
  };
  metrics: {
    overallSOV: number;
    overallMentionRate: number;
    topCompetitors: Array<{
      name: string;
      avgSOV: number;
      mentions: number;
    }>;
    gaps: {
      missingQueries: number;
      topGaps: string[];
      competitorOnlyMentions: { [key: string]: number };
    };
  };
  executionTimeMs: number;
}
```

## State Management

The component uses:
- **Local state** for data fetching (loading, error, report data)
- **Zustand store** (`useReportViewStore`) for active tab management
- **Props** for navigation and favorite handling (delegated to parent)

## Loading States

Shows skeleton loaders while fetching:
- Header skeleton
- Content skeleton
- Maintains layout structure during load

## Error Handling

Displays error alert with:
- Error message
- Back to Unified Report button
- New Analysis button (if provided)

## Accessibility

- Semantic HTML structure
- Keyboard navigation support
- ARIA labels on interactive elements
- Sufficient color contrast (WCAG AA)
- Screen reader friendly

## Performance Optimizations

- Lazy loading of report data
- Reuses existing tab components (no duplication)
- Efficient re-renders (only when props change)
- Proper React keys for lists

## Extending the Component

### Add New Model Support

To add support for a new model (e.g., GPT-4 Turbo):

1. Update `modelConfig` object:
```tsx
const modelConfig = {
  // ... existing models
  GPT_4_TURBO: {
    displayName: 'GPT-4 Turbo',
    shortName: 'GPT-4 Turbo',
    color: 'purple',
    bgClass: 'bg-purple-500/10',
    borderClass: 'border-purple-500/20',
    textClass: 'text-purple-600',
    badgeClass: 'bg-purple-500 text-white',
    accentClass: 'bg-purple-500',
    otherModel: 'CLAUDE_SONNET_4' as const,
    otherModelName: 'Claude',
  },
};
```

2. Update type definitions:
```tsx
interface ModelSpecificReportViewProps {
  modelName: 'CLAUDE_SONNET_4' | 'GPT_4' | 'GPT_4_TURBO';
  // ...
}
```

### Customize Metrics

The key metrics cards can be customized by modifying the grid section:

```tsx
<div className="grid grid-cols-4 gap-4 mt-6">
  {/* Add/remove/modify metric cards here */}
</div>
```

## Troubleshooting

### Data Not Loading
- Verify `analysisRunId` is correct
- Check backend API is running (`http://localhost:3001`)
- Ensure `getModelReport` API endpoint is implemented

### Tabs Not Switching
- Verify `useReportViewStore` is properly initialized
- Check for console errors
- Ensure `ReportTabs` component is imported correctly

### Styling Issues
- Ensure Tailwind CSS is configured
- Check shadcn/ui components are installed
- Verify `cn` utility function is available

## Dependencies

- React 19+
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (for animations)
- Lucide React (for icons)
- Zustand (for state management)

## Related Components

- `ReportView` - Original unified report view
- `ReportTabs` - Tab navigation component
- `OverviewTab`, `CompetitionTab`, `InsightsTab`, `GapsTab`, `DetailsTab` - Tab content components

## Future Enhancements

- [ ] Download functionality (PDF/CSV export)
- [ ] Print-friendly view
- [ ] Email report sharing
- [ ] Comparison mode (side-by-side models)
- [ ] Historical trend analysis
- [ ] Custom metric configuration
- [ ] Report annotations and notes

## License

Part of the GEO (Generative Engine Optimization) reporting tool.
