# ModelSpecificReportView Architecture

## Visual Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────┐
│                    ModelSpecificReportView                          │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Header Section (with model-specific background)              │ │
│  │                                                               │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ Title Row                                             │   │ │
│  │  │  • Company Name (h1)                                  │   │ │
│  │  │  • Model Badge (Claude/GPT-4) [Blue/Green]           │   │ │
│  │  │  • Star Icon (favorite toggle)                       │   │ │
│  │  │  • Action Buttons (Unified | Other Model | Download) │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ Model-Specific Alert                                 │   │ │
│  │  │  "Showing results from [Model] only"                 │   │ │
│  │  │  [Compare with Other Model →]                        │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  │                                                               │ │
│  │  ┌──────────────────────────────────────────────────────┐   │ │
│  │  │ Key Metrics Grid (4 columns)                         │   │ │
│  │  │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                │   │ │
│  │  │  │ SOV  │ │ Rate │ │ Top  │ │ Gaps │                │   │ │
│  │  │  │ 42%  │ │ 68%  │ │Comp. │ │  12  │                │   │ │
│  │  │  └──────┘ └──────┘ └──────┘ └──────┘                │   │ │
│  │  └──────────────────────────────────────────────────────┘   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Model Indicator Bar (animated, model-specific color)         │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ ReportTabs Component                                          │ │
│  │  [Overview] [Competition] [Insights] [Gaps] [Details]        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Tab Content (conditionally rendered)                          │ │
│  │                                                               │ │
│  │  • OverviewTab      → Executive summary, SOV, position       │ │
│  │  • CompetitionTab   → Competitor rankings                    │ │
│  │  • InsightsTab      → Strategic insights                     │ │
│  │  • GapsTab          → Visibility gaps                        │ │
│  │  • DetailsTab       → Query-level details                    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Footer Stats                                                  │ │
│  │  • Model branding (Powered by [Model])                       │ │
│  │  • Execution time                                            │ │
│  │  • Competitor/query counts                                   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Comparison CTA Card                                           │ │
│  │  • "Compare Model Performance"                               │ │
│  │  • [View Unified Report] [View Other Model]                  │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     Parent Component                        │
│                        (App.tsx)                            │
│                                                             │
│  State:                                                     │
│  • currentAnalysisRunId: string                            │
│  • currentModelName: 'CLAUDE_SONNET_4' | 'GPT_4'          │
│  • favoriteQueryGroups: Set<string>                        │
│                                                             │
│  Handlers:                                                  │
│  • handleNavigateToUnified()                               │
│  • handleNavigateToOtherModel(modelName)                   │
│  • handleToggleFavorite(queryGroupId)                      │
│  • handleNewAnalysis()                                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Props
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              ModelSpecificReportView                        │
│                                                             │
│  Local State:                                               │
│  • report: ModelSpecificReport | null                      │
│  • isLoading: boolean                                       │
│  • error: string | null                                     │
│                                                             │
│  Effects:                                                   │
│  • useEffect(() => fetchReport(), [analysisRunId, model])  │
│                                                             │
│  Renders:                                                   │
│  • Loading skeleton (if isLoading)                         │
│  • Error alert (if error)                                  │
│  • Report view (if report)                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Uses
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               useReportViewStore (Zustand)                  │
│                                                             │
│  Global State:                                              │
│  • activeTab: 'overview' | 'competition' | ...             │
│  • filters: { category?, competitor?, sentiment? }          │
│  • expandedSections: string[]                              │
│                                                             │
│  Actions:                                                   │
│  • setActiveTab(tab)                                       │
│  • setFilters(filters)                                     │
│  • toggleSection(sectionId)                                │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
1. Component Mount
   │
   ▼
2. Fetch Report
   │
   ├─→ API: GET /analysis-run/:id/model/:modelName
   │         │
   │         ▼
   │   ModelSpecificReport {
   │     model: 'CLAUDE_SONNET_4' | 'GPT_4'
   │     analysisRunId: string
   │     queryGroup: { id, name, company, industry }
   │     metrics: { SOV, mentionRate, competitors, gaps }
   │     executionTimeMs: number
   │   }
   │
   ▼
3. Transform Data
   │
   ├─→ Convert ModelSpecificReport → AnalysisResult
   │   (for compatibility with existing tab components)
   │
   ▼
4. Render Component
   │
   ├─→ Header (with model-specific styling)
   ├─→ Metrics Cards
   ├─→ ReportTabs
   ├─→ Active Tab Content
   ├─→ Footer
   └─→ Comparison CTA
```

## Navigation Flow

```
┌──────────────────┐
│    Dashboard     │
│                  │
│  • Query Group   │
│    Cards         │
└────────┬─────────┘
         │
         ├─ Click "View Claude"
         │  └─→ ModelSpecificReportView (model: CLAUDE_SONNET_4)
         │
         └─ Click "View GPT-4"
            └─→ ModelSpecificReportView (model: GPT_4)


┌────────────────────────────┐
│  ModelSpecificReportView   │
│  (Claude)                  │
│                            │
│  Actions:                  │
│  • [View Unified] ──────┐  │
│  • [View GPT-4] ────────┼─→│
│  • [New Report] ────────┼──│
│  • [Download] ──────────┘  │
└────────────────────────────┘
         │                 │
         │                 │
         ▼                 ▼
┌──────────────┐   ┌──────────────────┐
│ UnifiedView  │   │ ModelSpecific    │
│              │   │ (GPT-4)          │
│ Comparison   │   │                  │
│ Claude vs    │   │ Green theme      │
│ GPT-4        │   │ GPT-specific     │
└──────────────┘   └──────────────────┘
```

## Model Theming System

```typescript
const modelConfig = {
  CLAUDE_SONNET_4: {
    displayName: 'Claude Sonnet 4',
    shortName: 'Claude',
    color: 'blue',
    classes: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-600',
      badge: 'bg-blue-500 text-white',
      accent: 'bg-blue-500'
    },
    navigation: {
      otherModel: 'GPT_4',
      otherModelName: 'GPT-4'
    }
  },
  GPT_4: {
    displayName: 'GPT-4',
    shortName: 'GPT-4',
    color: 'green',
    classes: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-600',
      badge: 'bg-green-500 text-white',
      accent: 'bg-green-500'
    },
    navigation: {
      otherModel: 'CLAUDE_SONNET_4',
      otherModelName: 'Claude'
    }
  }
}

// Applied dynamically throughout component:
<div className={cn(config.bgClass, config.borderClass)}>
  <Badge className={config.badgeClass}>
    {config.displayName}
  </Badge>
</div>
```

## Component Reuse Pattern

```
ModelSpecificReportView
    │
    ├─ Fetches: ModelSpecificReport (model-specific data)
    │
    ├─ Transforms: ModelSpecificReport → AnalysisResult
    │
    └─ Renders Tab Components:
        │
        ├─ ReportTabs (shared)
        │   └─ useReportViewStore (shared state)
        │
        └─ Tab Content Components (all shared):
            ├─ OverviewTab
            ├─ CompetitionTab
            ├─ InsightsTab
            ├─ GapsTab
            └─ DetailsTab

Benefits:
  • DRY: No duplicated tab components
  • Consistency: Same tab experience across views
  • Maintainability: Update tabs once, affects all views
  • Performance: Tab components already optimized
```

## Error Handling Strategy

```
Component Mount
    │
    ▼
Set isLoading = true
    │
    ▼
Fetch Report
    │
    ├─ Success
    │  │
    │  ├─ Set report data
    │  ├─ Set isLoading = false
    │  └─ Render report
    │
    └─ Error
       │
       ├─ Set error message
       ├─ Set isLoading = false
       └─ Render error state:
          │
          ├─ Alert with error message
          ├─ "Back to Unified" button
          └─ "New Analysis" button (optional)
```

## Responsive Design Breakpoints

```
Mobile (< 640px)
  • Stack metric cards vertically (grid-cols-1)
  • Hide some header actions in dropdown
  • Simplified tab labels

Tablet (640px - 1024px)
  • 2-column metric grid (grid-cols-2)
  • Show all header actions
  • Full tab labels

Desktop (> 1024px)
  • 4-column metric grid (grid-cols-4)
  • Full header with all actions
  • Maximum width: 1152px (max-w-6xl)
```

## Accessibility Tree

```
ModelSpecificReportView
└── <div role="main">
    ├── Header <header>
    │   ├── <h1>Company Name</h1>
    │   ├── <div role="status" aria-live="polite">Model Badge</div>
    │   ├── <button aria-label="Toggle favorite">Star Icon</button>
    │   └── Action Buttons <nav>
    │       ├── <button>View Unified Report</button>
    │       ├── <button>View [Other Model]</button>
    │       ├── <button>Download</button>
    │       └── <button>New Report</button>
    │
    ├── Alert <div role="alert">
    │   └── Model-specific notice
    │
    ├── Metrics Grid <section aria-label="Key Metrics">
    │   ├── SOV Card <article>
    │   ├── Mention Rate Card <article>
    │   ├── Top Competitor Card <article>
    │   └── Gaps Card <article>
    │
    ├── Tabs <nav role="tablist" aria-label="Report Sections">
    │   ├── <button role="tab" aria-selected="true">Overview</button>
    │   ├── <button role="tab" aria-selected="false">Competition</button>
    │   └── ... (more tabs)
    │
    ├── Tab Panel <div role="tabpanel">
    │   └── Active tab content
    │
    ├── Footer <footer>
    │   └── Stats and metadata
    │
    └── CTA Section <aside>
        └── Comparison call-to-action
```

## Performance Optimization Points

```
1. Initial Load
   ├─ Lazy load component if needed
   │  └─ const ModelReportView = lazy(() => import('./ModelSpecificReportView'))
   │
   └─ Show skeleton during fetch
      └─ Prevents layout shift

2. Data Fetching
   ├─ Single API call on mount
   ├─ No re-fetch on tab changes
   └─ Could add SWR/React Query for caching

3. Re-renders
   ├─ Tab components use React.memo
   ├─ Event handlers use useCallback in parent
   └─ Props are primitive or memoized

4. Bundle Size
   ├─ Reuses existing components (no duplication)
   ├─ Shared tab components across views
   └─ Tree-shakable imports from lucide-react

5. Runtime Performance
   ├─ No inline object/array creation in render
   ├─ Conditional rendering instead of hiding
   └─ Framer Motion optimized for 60fps animations
```

## Testing Strategy

```
Unit Tests
├─ Component renders with valid props
├─ Loading state shows skeleton
├─ Error state shows error message
├─ Model config selects correct theme
├─ Favorite toggle calls handler
└─ Navigation buttons call correct handlers

Integration Tests
├─ API fetch on mount
├─ Data transformation works correctly
├─ Tab switching updates content
├─ Navigation flow between views
└─ Favorite state persistence

E2E Tests
├─ Full user journey from dashboard
├─ Model switching preserves analysis
├─ Browser back/forward buttons work
└─ Responsive design on different devices

Accessibility Tests
├─ Keyboard navigation works
├─ Screen reader announces content
├─ Color contrast meets WCAG AA
└─ Focus management is correct
```

This architecture provides a solid, scalable foundation for model-specific reporting with excellent UX, performance, and maintainability.
