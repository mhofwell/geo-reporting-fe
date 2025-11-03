# Unified Report View Components

## Overview

A comprehensive cross-model comparison reporting system for analyzing brand visibility across Claude Sonnet 4 and GPT-4 AI platforms. The UnifiedReportView component provides strategic insights by comparing performance metrics, identifying divergences, and highlighting optimization opportunities.

## Component Architecture

### Main Component

**`UnifiedReportView.tsx`** (`/src/components/UnifiedReportView.tsx`)
- Main container component with tab navigation
- Fetches unified report data via `getUnifiedReport(analysisRunId)` API call
- Manages active tab state and user interactions
- Provides navigation to model-specific views
- Includes loading, error, and empty states

**Props:**
```typescript
interface UnifiedReportViewProps {
  analysisRunId: string;                                    // ID of the analysis run
  onNavigateToModel: (modelName: 'CLAUDE_SONNET_4' | 'GPT_4') => void;  // Navigate to single-model view
  onToggleFavorite?: (queryGroupId: string) => void;        // Toggle favorite status
  onNewAnalysis?: () => void;                                // Create new analysis
}
```

### Sub-Components

All sub-components are located in `/src/components/unified-report/`:

#### 1. **ModelComparisonCard.tsx**
Prominent comparison card showing:
- Overall SOV with side-by-side model bars (animated with Framer Motion)
- Model agreement score with visual indicators
- Average mention rate and position metrics
- Divergence alerts when models disagree significantly
- Color-coded status badges (green for high agreement, yellow for moderate, red for divergence)

**Key Features:**
- Calculates divergence levels: low (<10%), moderate (10-20%), high (>20%)
- Animated progress bars showing Claude (blue) vs GPT (green) SOV
- Real-time consensus indicators
- Alert components for significant differences

#### 2. **UnifiedOverviewTab.tsx**
Executive summary with:
- Company header with model badges
- Hero metrics cards (Overall SOV, Model Agreement, Avg Position)
- Position distribution chart (Recharts grouped bar chart)
- Top competitors comparison by model
- Executive summary paragraph with strategic insights

**Visualizations:**
- Grouped bar chart comparing 1st/2nd/3rd+ positions across models
- Side-by-side competitor leaderboards
- Color-coded metrics cards

#### 3. **ModelBreakdownTab.tsx** (NEW - Unique to Unified View)
Split-screen detailed comparison:
- Side-by-side model performance panels (Claude blue theme, GPT green theme)
- Metrics comparison: SOV, mention rate, average position
- Top 3 competitors per model
- Top attributes per model
- Divergence analysis section with specific alerts
- Visual indicators for significant differences (trending up/down icons)

**Divergence Detection:**
- Highlights panels in yellow when significant differences detected
- Shows delta indicators for SOV differences
- Lists model-specific competitor detections
- Provides platform-specific optimization recommendations

#### 4. **UnifiedCompetitionTab.tsx**
Cross-model competitive analysis:
- Horizontal bar chart comparing competitor SOV across models (Recharts)
- Detailed competitor table with columns: Overall SOV, Claude SOV, GPT SOV, Difference, Status
- Status badges: "Divergent" (appears in only one model), "High Variance" (>10% difference), "Aligned"
- Competitive gap analysis cards
- Platform-specific detection insights

**Features:**
- Merges competitor data from both models
- Calculates average SOV when competitor appears in both
- Highlights rows with model disagreement (yellow background)
- Provides strategic insights for each top competitor

#### 5. **UnifiedInsightsTab.tsx**
Strategic recommendations:
- Auto-generated insights based on unified metrics
- Prioritized action items (high/medium/low priority)
- Attribute analysis by model (side-by-side comparison)
- Recommended action items section
- Color-coded priority badges

**Insight Categories:**
- Performance (overall SOV assessment)
- Cross-Platform (model agreement analysis)
- Competition (competitive positioning)
- Positioning (ranking quality)

#### 6. **UnifiedGapsTab.tsx**
Visibility opportunity analysis:
- Gap statistics cards (total gaps, high priority, potential SOV gain)
- Priority-based gap breakdown (high/medium priority sections)
- Query-level gap details with:
  - Affected models (Claude/GPT badges)
  - Competitors appearing in gap queries
  - Estimated SOV impact
  - Specific recommendations
- Action plan with phased approach

## API Integration

### Data Flow
1. Component receives `analysisRunId` prop
2. Calls `getUnifiedReport(analysisRunId)` from `/src/api/client.ts`
3. API returns `UnifiedReport` type with structure:

```typescript
interface UnifiedReport {
  analysisRunId: string;
  companyName: string;
  industry: string;
  overallMetrics: {
    overallSOV: number;
    claudeSOV: number;
    gptSOV: number;
    modelAgreementScore: number;  // 0-1 scale
  };
  modelComparison: {
    claude: ModelPerformance;
    gpt: ModelPerformance;
  };
  queryGroupId: string;
  lastRunAt: string;
}

interface ModelPerformance {
  sov: number;
  mentionRate: number;
  avgPosition: number;
  topCompetitors: Array<{ name: string; sov: number }>;
  topAttributes: string[];
}
```

## Design System

### Color Coding

**Models:**
- Claude Sonnet 4: Blue (`#3b82f6`, `bg-blue-500`)
- GPT-4: Green (`#10b981`, `bg-green-500`)

**Status Indicators:**
- High Agreement: Green (`bg-green-500/10`, `text-green-700`)
- Moderate Agreement: Yellow (`bg-yellow-500/10`, `text-yellow-700`)
- Significant Divergence: Red (`bg-red-500/10`, `text-red-700`)

**Priorities:**
- High: Red background/border
- Medium: Yellow background/border
- Low: Green background/border

### UI Components Used
- **shadcn/ui**: Card, Badge, Button, Alert, Skeleton
- **Recharts**: BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
- **Lucide Icons**: Star, Download, Plus, ArrowRight, BarChart3, GitCompare, Target, Lightbulb, AlertTriangle, and more
- **Framer Motion**: Animated transitions and layout animations

## Key Features

### 1. Divergence Detection
Automatically identifies and highlights when models show significantly different results:
- SOV differences >15%
- Different top competitors
- Different positioning attributes
- Platform-specific competitor detection

### 2. Model Agreement Scoring
Visual representation of cross-platform consistency:
- 80%+ agreement: High consensus badge (green)
- 60-80% agreement: Moderate alignment badge (yellow)
- <60% agreement: Low consensus badge (red)

### 3. Animated Visualizations
- Progress bars with stagger animations
- Smooth tab transitions with layout animations
- Fade-in animations for cards with sequential delays

### 4. Responsive Design
- Grid layouts that adapt to mobile/tablet/desktop
- Horizontal scrolling for tables on mobile
- Collapsible sections for better mobile UX

### 5. Interactive Elements
- Clickable model badges to navigate to single-model views
- Star icon to toggle favorite status
- Download button for report export
- "New Report" CTA button

## Usage Example

```tsx
import { UnifiedReportView } from '@/components/UnifiedReportView';

function MyDashboard() {
  const analysisRunId = 'aru_123456';

  const handleNavigateToModel = (modelName: 'CLAUDE_SONNET_4' | 'GPT_4') => {
    // Navigate to model-specific report view
    router.push(`/reports/${analysisRunId}/model/${modelName}`);
  };

  const handleToggleFavorite = (queryGroupId: string) => {
    // Toggle favorite in backend
    toggleDefaultReport(queryGroupId);
  };

  const handleNewAnalysis = () => {
    // Navigate to new analysis form
    router.push('/new-analysis');
  };

  return (
    <UnifiedReportView
      analysisRunId={analysisRunId}
      onNavigateToModel={handleNavigateToModel}
      onToggleFavorite={handleToggleFavorite}
      onNewAnalysis={handleNewAnalysis}
    />
  );
}
```

## File Structure

```
src/components/
├── UnifiedReportView.tsx                    # Main container component
└── unified-report/
    ├── index.ts                             # Export barrel file
    ├── ModelComparisonCard.tsx              # Prominent comparison card
    ├── UnifiedOverviewTab.tsx               # Executive summary tab
    ├── ModelBreakdownTab.tsx                # Split-screen model comparison (NEW)
    ├── UnifiedCompetitionTab.tsx            # Cross-model competitive analysis
    ├── UnifiedInsightsTab.tsx               # Strategic recommendations
    └── UnifiedGapsTab.tsx                   # Visibility opportunity analysis
```

## State Management

- Local component state using `useState` for:
  - Active tab selection
  - Favorite status
  - Report data
  - Loading/error states
- No global state management required (self-contained)

## Performance Considerations

- Lazy loading of tab content (only active tab renders content)
- Memoization of chart data calculations
- Animated components use Framer Motion's `layoutId` for optimal performance
- Skeleton loading states for better perceived performance

## Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels for interactive elements
- Keyboard navigation support for tabs
- Color contrast meets WCAG AA standards
- Focus indicators on all interactive elements
- Screen reader friendly descriptions

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6+ support
- Tested on desktop and mobile viewports

## Future Enhancements

1. **Export Functionality**: Implement PDF/CSV download
2. **Historical Comparison**: Show trends over time
3. **Custom Threshold Settings**: Allow users to configure divergence thresholds
4. **Real-time Updates**: WebSocket support for live analysis progress
5. **Shareable Links**: Generate shareable report URLs
6. **Print Styles**: Optimized print CSS for physical reports

## Testing Notes

When testing the UnifiedReportView:
1. Verify API integration with mock data
2. Test divergence detection with various SOV differences
3. Validate responsive behavior on mobile devices
4. Check loading states and error handling
5. Ensure smooth animations on lower-end devices
6. Test keyboard navigation for accessibility

## Maintenance

- Update divergence thresholds in `ModelComparisonCard.tsx` if business requirements change
- Add new insight categories in `UnifiedInsightsTab.tsx` as analysis evolves
- Keep color scheme consistent with design system updates
- Monitor API response times and optimize rendering if needed
