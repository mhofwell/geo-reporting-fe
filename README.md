# GEO Reporting Frontend

Web-based UI for the **GEO (Generative Engine Optimization) reporting tool** - a system that analyzes brand visibility in AI/LLM responses across Claude Sonnet 4 and GPT-4.

## Overview

This React application provides a comprehensive dashboard for:
- Generating diverse search queries about brands and industries
- Reviewing and approving queries before execution
- Tracking real-time analysis progress across multiple AI models
- Viewing unified cross-model comparison reports
- Exploring model-specific performance metrics
- Managing user preferences and settings

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

**Prerequisites:**
- Node.js 18+ or Bun
- Backend API running on http://localhost:3001 (see `geo-reporting/`)

## Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Charts:** Recharts
- **Routing:** React Router DOM
- **State Management:** Zustand (for report tabs), local state
- **Animations:** Framer Motion
- **Icons:** Lucide React

## Project Structure

```
src/
├── App.tsx                      # Main app with state management and routing
├── main.tsx                     # React entry point
├── components/
│   ├── AnalysisForm.tsx         # Query generation form
│   ├── Dashboard.tsx            # Recent analyses overview
│   ├── QueryReview.tsx          # Query approval interface
│   ├── AnalysisProgress.tsx     # Real-time progress tracking
│   ├── ReportView.tsx           # Legacy single-analysis reports
│   ├── UnifiedReportView.tsx    # Cross-model comparison view
│   ├── ModelSpecificReportView.tsx  # Single-model detailed view
│   ├── report/                  # Shared report tab components
│   │   ├── ReportTabs.tsx
│   │   ├── OverviewTab.tsx
│   │   ├── CompetitionTab.tsx
│   │   ├── InsightsTab.tsx
│   │   ├── GapsTab.tsx
│   │   └── DetailsTab.tsx
│   ├── unified-report/          # Unified report components
│   │   ├── ModelComparisonCard.tsx
│   │   ├── UnifiedOverviewTab.tsx
│   │   ├── ModelBreakdownTab.tsx
│   │   ├── UnifiedCompetitionTab.tsx
│   │   ├── UnifiedInsightsTab.tsx
│   │   └── UnifiedGapsTab.tsx
│   ├── settings/                # User settings
│   │   ├── AccountSettings.tsx
│   │   ├── Preferences.tsx
│   │   └── forms/
│   ├── ui/                      # shadcn/ui components
│   └── [other components]
├── api/
│   └── client.ts                # Backend API client
├── store/
│   └── reportViewStore.ts       # Zustand store for tab state
├── types/
│   ├── preferences.ts           # User preferences types
│   └── user.ts                  # User profile types
└── utils/
    ├── storage.ts               # localStorage utilities
    └── password.ts              # Password validation

```

## Key Features

### 1. Multi-Step Analysis Workflow
- **Generate Queries:** Input company and industry to generate 30+ diverse queries
- **Review & Approve:** Edit, add, or remove queries before execution
- **Real-time Progress:** Watch analysis progress across both AI models
- **View Results:** Explore comprehensive reports with insights and recommendations

### 2. Unified Report View
Cross-model comparison showing:
- Overall SOV (Share of Voice) across Claude and GPT-4
- Model agreement scoring (consensus vs divergence)
- Side-by-side performance metrics
- Competitive landscape comparison
- Platform-specific optimization opportunities

See [docs/unified-report-system.md](docs/unified-report-system.md) for details.

### 3. Model-Specific Reports
Detailed single-model analysis with:
- Model-specific theming (blue for Claude, green for GPT)
- Key metrics dashboard (SOV, mention rate, top competitor, visibility gaps)
- Full report tabs (Overview, Competition, Insights, Gaps, Details)
- Navigation between unified and model-specific views

See component documentation: `src/components/ModelSpecificReportView.README.md`

### 4. User Preferences
Customizable settings including:
- Theme selection (light/dark/system)
- Font size and compact mode
- Dashboard defaults (reports per page, auto-refresh)
- Notification preferences
- Data retention and privacy controls

See [docs/preferences-system.md](docs/preferences-system.md) for implementation details.

## Available Scripts

```bash
npm run dev        # Start development server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3001
```

## API Integration

The frontend communicates with the backend API (`geo-reporting/server.ts`) via:

**Key Endpoints:**
- `POST /generate-queries` - Generate queries from company/industry
- `POST /run-analysis-async` - Start background analysis
- `GET /analysis-status/:id` - Poll analysis progress
- `GET /analysis-run/:runId/unified` - Get unified cross-model report
- `GET /analysis-run/:runId/model/:modelName` - Get model-specific report
- `GET /recent-analyses` - List recent analysis runs

See `src/api/client.ts` for full API client implementation.

## State Management

- **App-level state:** Managed in `App.tsx` using React hooks
  - Current view/route
  - Active analysis ID
  - Loading/error states
  - Breadcrumb navigation

- **Report tab state:** Zustand store (`src/store/reportViewStore.ts`)
  - Shared active tab across all report views
  - Persists tab selection when switching between reports

- **Component-local state:** Most components use local `useState` hooks
  - Form inputs
  - Modal dialogs
  - Loading indicators

## Design System

### Colors
- **Claude Sonnet 4:** Blue (`#3b82f6`, `bg-blue-500`)
- **GPT-4:** Green (`#10b981`, `bg-green-500`)
- **Primary Action:** Blue (`bg-blue-600`)
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red

### Components
All UI components use shadcn/ui for consistency:
- Buttons, Cards, Badges, Alerts
- Dialogs, Dropdowns, Tooltips
- Forms (Input, Select, Switch, Radio)
- Data visualization (via Recharts)

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Horizontal scrolling for tables on mobile
- Collapsible sections for complex views
- Touch-friendly interactive elements

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meeting WCAG AA standards
- Focus indicators on all interactive elements
- Screen reader friendly announcements

## Documentation

- **Project overview:** See root `../CLAUDE.md`
- **Frontend docs:** See `docs/` for technical guides
- **Component-specific docs:** Co-located README files in `src/components/`
- **Backend docs:** See `../geo-reporting/docs/`
- **System docs:** See `../docs/` for cross-cutting architecture

## Development Guidelines

1. **Use shadcn/ui components** - Don't create custom UI primitives
2. **Type everything** - Strict TypeScript with proper type definitions
3. **Co-locate documentation** - Add README files for complex components
4. **Follow naming conventions:**
   - Components: PascalCase (e.g., `AnalysisForm.tsx`)
   - Utilities: camelCase (e.g., `storage.ts`)
   - Types: PascalCase interfaces (e.g., `UserPreferences`)
5. **Error handling** - Use try-catch for all API calls, show user-friendly errors
6. **Loading states** - Use Skeleton components during data fetching

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

When adding new features:
1. Check `.adb/PROJECT_STATUS.md` for current priorities
2. Review `.adb/product-requirements.md` for feature specs
3. Follow existing patterns in similar components
4. Add TypeScript types for all new data structures
5. Update documentation if adding complex features
6. Test across different screen sizes

## Related Projects

- **Backend:** `../geo-reporting/` - TypeScript + Bun API server
- **Project Docs:** `../.adb/` - Requirements and status tracking
- **System Docs:** `../docs/` - Cross-cutting architecture
- **Frontend Docs:** `docs/` - Frontend technical guides

## License

Private project - All rights reserved
