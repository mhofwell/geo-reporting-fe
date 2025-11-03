# UnifiedReportView Component Hierarchy

```
UnifiedReportView (300 lines)
├── Header Section
│   ├── Company Name + Star (Favorite Toggle)
│   ├── Industry Badge
│   ├── Model Badges (Claude + GPT)
│   ├── Last Run Timestamp
│   └── Action Buttons
│       ├── "View Claude Only" → onNavigateToModel('CLAUDE_SONNET_4')
│       ├── "View GPT Only" → onNavigateToModel('GPT_4')
│       ├── "Download" → handleDownload()
│       └── "New Report" → onNewAnalysis()
│
├── ModelComparisonCard (228 lines) ⭐ PROMINENT FEATURE
│   ├── Overall SOV Metric
│   ├── Animated Side-by-Side Bars
│   │   ├── Claude SOV (Blue)
│   │   └── GPT SOV (Green)
│   ├── Key Metrics Grid
│   │   ├── Model Agreement Score
│   │   ├── Avg Mention Rate
│   │   └── Avg Position
│   └── Divergence Alerts (conditional)
│       ├── SOV Difference Alert
│       ├── Mention Rate Variance
│       └── High Consensus Badge
│
├── Tab Navigation
│   ├── Overview Tab
│   ├── Model Breakdown Tab (NEW)
│   ├── Competition Tab
│   ├── Insights Tab
│   └── Gaps Tab
│
└── Tab Content (conditional render based on activeTab)
    │
    ├── UnifiedOverviewTab (266 lines)
    │   ├── Executive Summary Card
    │   ├── Hero Metrics (3 cards)
    │   │   ├── Overall SOV
    │   │   ├── Model Agreement
    │   │   └── Avg Position
    │   ├── Position Distribution Chart (Recharts)
    │   └── Top Competitors by Model (2 columns)
    │
    ├── ModelBreakdownTab (303 lines) 🆕 UNIQUE TO UNIFIED
    │   ├── Divergence Summary Alert
    │   ├── Split-Screen Comparison
    │   │   ├── Claude Panel (Blue Theme)
    │   │   │   ├── SOV with Trend Indicator
    │   │   │   ├── Mention Rate
    │   │   │   ├── Avg Position
    │   │   │   ├── Top 3 Competitors
    │   │   │   └── Top Attributes
    │   │   └── GPT Panel (Green Theme)
    │   │       ├── SOV with Trend Indicator
    │   │       ├── Mention Rate
    │   │       ├── Avg Position
    │   │       ├── Top 3 Competitors
    │   │       └── Top Attributes
    │   └── Divergence Analysis Card
    │       ├── SOV Variance Alert
    │       ├── Mention Rate Difference
    │       └── Competitor Detection Variance
    │
    ├── UnifiedCompetitionTab (296 lines)
    │   ├── Competitive Landscape Chart (Recharts Horizontal Bar)
    │   ├── Detailed Competitor Table
    │   │   ├── Brand Row (highlighted)
    │   │   └── Competitor Rows
    │   │       ├── Overall SOV
    │   │       ├── Claude SOV
    │   │       ├── GPT SOV
    │   │       ├── Difference
    │   │       └── Status Badge
    │   └── Competitive Gap Analysis
    │       └── Top 3 Competitors (detailed cards)
    │
    ├── UnifiedInsightsTab (284 lines)
    │   ├── Strategic Insights (auto-generated)
    │   │   ├── Performance Insights
    │   │   ├── Cross-Platform Insights
    │   │   ├── Competition Insights
    │   │   └── Positioning Insights
    │   ├── Attribute Analysis by Model
    │   │   ├── Claude Attributes (left)
    │   │   └── GPT Attributes (right)
    │   └── Recommended Action Items
    │       └── High Priority Actions
    │
    └── UnifiedGapsTab (340 lines)
        ├── Gap Summary Alert
        ├── Gap Statistics (3 cards)
        │   ├── Total Gaps
        │   ├── High Priority Count
        │   └── Potential SOV Gain
        ├── Gap Breakdown
        │   ├── High Priority Gaps
        │   │   └── Gap Cards
        │   │       ├── Query Details
        │   │       ├── Affected Models
        │   │       ├── Competitors List
        │   │       ├── Estimated Impact
        │   │       └── Recommendation
        │   └── Medium Priority Gaps
        │       └── Gap Cards (same structure)
        └── Action Plan Card
            ├── Phase 1: Quick Wins
            └── Phase 2: Strategic Expansion
```

## Component Statistics

| Component | Lines of Code | Purpose |
|-----------|--------------|---------|
| **UnifiedReportView** | 300 | Main container with tab navigation |
| **ModelComparisonCard** | 228 | Prominent cross-model metrics card |
| **UnifiedOverviewTab** | 266 | Executive summary with charts |
| **ModelBreakdownTab** | 303 | Split-screen model comparison (NEW) |
| **UnifiedCompetitionTab** | 296 | Cross-model competitive analysis |
| **UnifiedInsightsTab** | 284 | Strategic recommendations |
| **UnifiedGapsTab** | 340 | Visibility opportunity analysis |
| **TOTAL** | **2,017** | Complete unified reporting system |

## Data Flow

```
Parent Component
       ↓
  analysisRunId (prop)
       ↓
UnifiedReportView
       ↓
  getUnifiedReport(analysisRunId) → API Call
       ↓
  UnifiedReport (state)
       ↓
  ┌──────────────────┬──────────────────┬──────────────────┐
  ↓                  ↓                  ↓                  ↓
ModelComparisonCard  Tab Components    Header Actions     Footer
       ↓
  - overallMetrics
  - modelComparison
  - divergence alerts
```

## Key Interactions

1. **Tab Navigation**: User clicks tab → `setActiveTab()` → Conditional render of tab content
2. **Favorite Toggle**: User clicks star → `onToggleFavorite(queryGroupId)` → Parent updates backend
3. **Model Navigation**: User clicks "View Claude/GPT Only" → `onNavigateToModel()` → Parent routes to single-model view
4. **Download Report**: User clicks "Download" → `handleDownload()` → Export report (TODO)
5. **New Analysis**: User clicks "New Report" → `onNewAnalysis()` → Parent routes to form

## Color Theme

| Element | Color | Usage |
|---------|-------|-------|
| Claude Sonnet 4 | Blue (#3b82f6) | All Claude-specific metrics, badges, bars |
| GPT-4 | Green (#10b981) | All GPT-specific metrics, badges, bars |
| High Agreement | Green | Model agreement >80% |
| Moderate Agreement | Yellow | Model agreement 60-80% |
| Low Agreement | Red | Model agreement <60% |
| High Priority | Red | Critical gaps and alerts |
| Medium Priority | Yellow | Secondary recommendations |
| Low Priority | Green | Maintenance items |

## Animation Strategy

All animations use Framer Motion:
- **Cards**: Fade in with upward motion (stagger delay based on index)
- **Progress Bars**: Width animation with easeOut easing
- **Tab Indicator**: Layout animation with spring physics
- **Duration**: 0.3-0.5s for cards, 1s for progress bars
- **Stagger**: 0.1s between sequential elements
