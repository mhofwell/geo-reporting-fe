# Frontend Documentation

Technical documentation for the GEO Reporting frontend application (geo-reporting-fe).

## Overview

The frontend is a React 19 + TypeScript application that provides:
- Analysis workflow (generate queries → approve → execute → view results)
- Unified cross-model comparison reports
- Model-specific detailed reports
- User preferences and settings
- Real-time progress tracking

## Documentation in This Directory

### Component Architecture

#### **unified-report-system.md**
Comprehensive guide to the unified report view system for cross-model comparison.

**Contents:**
- Component architecture and hierarchy
- API integration patterns
- Data flow and state management
- Design system (colors, animations, accessibility)
- Tab components and their responsibilities
- Usage examples and integration guide

**When to reference:** Working on multi-model reports, understanding cross-model comparison UI, implementing new comparison features.

---

#### **component-hierarchy.md**
Visual breakdown of the UnifiedReportView component tree.

**Contents:**
- Complete component hierarchy diagram
- Component sizes and line counts
- Data flow between components
- Color theming strategy (blue for Claude, green for GPT)
- Animation patterns

**When to reference:** Understanding component relationships, planning refactors, estimating component complexity.

---

#### **preferences-system.md**
Complete implementation guide for user preferences and settings.

**Contents:**
- Preferences data structure and TypeScript types
- localStorage integration and utilities
- Settings UI components (forms, switches, radio groups)
- Default values and validation
- Usage examples and integration patterns

**When to reference:** Working on user settings, adding new preference options, understanding data persistence, implementing theme switching.

---

## Component Organization

### Main Views
- `App.tsx` - Main application with routing
- `Dashboard.tsx` - Recent analyses overview
- `AnalysisForm.tsx` - Query generation form
- `QueryReview.tsx` - Query approval interface
- `AnalysisProgress.tsx` - Real-time progress tracking

### Report Views
- `UnifiedReportView.tsx` - Cross-model comparison (see unified-report-system.md)
- `ModelSpecificReportView.tsx` - Single-model detailed view
- `ReportView.tsx` - Legacy single-analysis view

### Shared Components
- `components/report/` - Shared report tab components
- `components/unified-report/` - Unified report-specific components
- `components/settings/` - User settings and preferences
- `components/ui/` - shadcn/ui components (buttons, cards, etc.)

---

## State Management

### App-Level State
Managed in `App.tsx` using React hooks:
- Current view/route
- Active analysis ID
- Loading/error states
- Breadcrumb navigation

### Zustand Store
`src/store/reportViewStore.ts` - Shared active tab state:
- Persists tab selection across report views
- Synchronized across UnifiedReportView and ModelSpecificReportView

### Local State
Most components use `useState` for:
- Form inputs
- Modal dialogs
- Loading indicators
- Component-specific UI state

---

## Design System

### Colors

**Model Theming:**
- **Claude Sonnet 4:** Blue (`#3b82f6`, `bg-blue-500`)
- **GPT-4:** Green (`#10b981`, `bg-green-500`)

**UI Colors:**
- **Primary Action:** Blue (`bg-blue-600`)
- **Success:** Green
- **Warning:** Yellow
- **Error:** Red

### UI Components

All components use **shadcn/ui** for consistency:
- Buttons, Cards, Badges, Alerts
- Dialogs, Dropdowns, Tooltips
- Forms (Input, Select, Switch, Radio)
- Data visualization (Recharts)

### Responsive Design
- Mobile-first approach with Tailwind breakpoints
- Horizontal scrolling for tables on mobile
- Collapsible sections for complex views
- Touch-friendly interactive elements

---

## API Integration

### Backend API Client
`src/api/client.ts` - All backend communication

**Key Functions:**
- `generateQueries()` - Generate queries from company/industry
- `runAnalysisAsync()` - Start background analysis
- `getAnalysisStatus()` - Poll analysis progress
- `getUnifiedReport()` - Fetch cross-model report
- `getModelReport()` - Fetch single-model report
- `getRecentAnalyses()` - List recent analyses

### API Endpoints
See backend documentation: `../geo-reporting/docs/api-endpoints.md`

---

## Related Documentation

### Project Documentation
- **Project overview:** `../CLAUDE.md`
- **Project status:** `../.adb/PROJECT_STATUS.md`
- **Product requirements:** `../.adb/product-requirements.md`
- **Design requirements:** `../.adb/design-requirements.md`

### Backend Documentation
- **Backend docs:** `../geo-reporting/docs/`
- **API reference:** `../geo-reporting/docs/api-endpoints.md`

### Root Documentation
- **System architecture:** `../docs/` (cross-cutting concerns)

### Component-Specific Docs
Many components have README files co-located with source:
- `src/components/ModelSpecificReportView.README.md`
- `src/components/ModelSpecificReportView.ARCHITECTURE.md`

---

## Quick Reference

### Running the Frontend

```bash
cd geo-reporting-fe
npm install      # Install dependencies
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Environment Variables

```env
VITE_API_URL=http://localhost:3001
```

### Tech Stack
- React 19 with TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui (components)
- Recharts (data visualization)
- Framer Motion (animations)
- Zustand (state management)

---

## Development Guidelines

1. **Use shadcn/ui components** - Don't create custom UI primitives
2. **Type everything** - Strict TypeScript with proper type definitions
3. **Co-locate docs** - Add README files for complex components
4. **Follow naming conventions:**
   - Components: PascalCase (e.g., `AnalysisForm.tsx`)
   - Utilities: camelCase (e.g., `storage.ts`)
   - Types: PascalCase interfaces (e.g., `UserPreferences`)
5. **Error handling** - Use try-catch for all API calls, show user-friendly errors
6. **Loading states** - Use Skeleton components during data fetching

---

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast meeting WCAG AA standards
- Focus indicators on all interactive elements
- Screen reader friendly announcements

---

## Contributing

When adding frontend documentation:

1. **New components** → Add README files in component directories
2. **System-level features** → Document in this directory
3. **API changes** → Update backend docs and api/client.ts
4. **Design patterns** → Document in relevant guides
5. **Keep docs current** - Update when making architectural changes
