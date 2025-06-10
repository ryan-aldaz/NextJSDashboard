# Reports System Design & Architecture

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Diagram](#architecture-diagram)
- [Data Flow](#data-flow)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [User Journey](#user-journey)
- [API Integration](#api-integration)
- [Error Handling Strategy](#error-handling-strategy)
- [Performance Considerations](#performance-considerations)
- [Extension Points](#extension-points)

---

## System Overview

The Reports System is a focused single-page dashboard that allows users to:
1. **Select** from predefined report types
2. **Fetch** report data from APIs
3. **Display** data in a sortable table
4. **Export** data to CSV format
5. **Handle** loading and error states gracefully

### Key Design Principles
- **Simplicity**: Single-page focused design with no routing complexity
- **Single Responsibility**: Each component has one clear purpose
- **Reusability**: Components are modular and self-contained
- **Testability**: Clear interfaces make testing straightforward
- **Accessibility**: All components follow WCAG guidelines

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Main Page                                 │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                ReportSelector                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                LoadingSpinner                               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                ErrorMessage                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Report Data Container                          │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │               ExportButton                              │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────────┐ │ │
│  │  │                DataTable                                │ │ │
│  │  └─────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       Hooks Layer                               │
│  ┌───────────────────────┐    ┌───────────────────────────────┐  │
│  │    useReportData      │    │     useTableControls          │  │
│  │  - Data fetching      │    │  - Sorting logic              │  │
│  │  - Loading states     │    │  - Data processing            │  │
│  │  - Error handling     │    │  - UI state                   │  │
│  └───────────────────────┘    └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      Service Layer                              │
│  ┌───────────────────────┐    ┌───────────────────────────────┐  │
│  │    reportService      │    │       apiClient               │  │
│  │  - Business logic     │    │  - HTTP communication        │  │
│  │  - Data validation    │    │  - Authentication             │  │
│  │  - Report metadata    │    │  - Error handling             │  │
│  └───────────────────────┘    └───────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         API Layer                               │
│                    /api/reports (Mock)                          │
│                Real API: /reports/generate                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Initial Page Load
```
User navigates to root URL (/)
    ↓
Main page renders with initial layout
    ↓
useReportData hook initializes
    ↓
ReportSelector displays with empty selection
    ↓
No data displayed (waiting for user selection)
```

### 2. Report Selection Flow
```
User selects report from dropdown
    ↓
handleReportChange() triggered
    ↓
setSelectedReport(reportId) - immediate UI update
    ↓
resetControls() - clear any previous sorting
    ↓
fetchReport(reportId) - async API call starts
    ↓
loading state set to true
    ↓
LoadingSpinner shown, old data hidden
    ↓
reportService.fetchReport() called
    ↓
apiClient.post('/reports', payload) executed
    ↓
API response received
    ↓
Data processed and stored in reportData state
    ↓
loading state set to false
    ↓
DataTable renders with new data
    ↓
ExportButton becomes available
```

### 3. Sorting Flow
```
User clicks table column header
    ↓
handleSort(columnKey) triggered
    ↓
sortConfig updated with new key/direction
    ↓
useTableControls processes data
    ↓
processedData recalculated with new sort
    ↓
DataTable re-renders with sorted data
    ↓
Sort indicator (↑/↓) updated in header
```

### 4. Export Flow
```
User clicks Export CSV button
    ↓
handleExport() triggered
    ↓
processedData (current sorted data) used
    ↓
convertToCSV() transforms data
    ↓
downloadCSV() creates blob and download
    ↓
Browser initiates file download
```

### 5. Error Flow
```
API call fails
    ↓
Error caught in fetchReport()
    ↓
error state updated with message
    ↓
loading state set to false
    ↓
ErrorMessage component displays
    ↓
reportData remains null (no table shown)
    ↓
User can dismiss error or try another report
```

---

## Component Hierarchy

### File Structure
```
src/app/page.js                     # Main page component
├── ReportSelector                   # Report selection dropdown
├── LoadingSpinner                   # Loading indicator
├── ErrorMessage                     # Error display
└── Report Data Container
    ├── ExportButton                 # CSV export functionality
    └── DataTable                    # Data visualization
```

### Component Relationships

```javascript
// Parent-Child Relationships
ReportsPage
├── useReportData()                  // Data management hook
├── useTableControls()               // Table functionality hook
├── PageLayout
│   ├── ReportSelector
│   ├── LoadingSpinner (conditional)
│   ├── ErrorMessage (conditional)
│   └── Report Container (conditional)
│       ├── ExportButton
│       └── DataTable

// Data Flow Between Components
useReportData
    ↓ (reports, selectedReport, reportData, loading, error)
ReportSelector & Conditional Renders
    ↓ (reportData)
useTableControls
    ↓ (processedData, sortConfig)
DataTable & ExportButton
```

### Props Flow
```javascript
// From hooks to components
const {
  reports,           // → ReportSelector
  selectedReport,    // → ReportSelector  
  reportData,        // → useTableControls
  loading,          // → LoadingSpinner conditional
  error,            // → ErrorMessage conditional
  fetchReport,      // → handleReportChange
  clearError,       // → ErrorMessage onDismiss
} = useReportData();

const {
  processedData,    // → DataTable & ExportButton
  sortConfig,       // → DataTable
  handleSort,       // → DataTable
} = useTableControls(reportData);
```

---

## State Management

### Hook State Architecture

#### useReportData State
```javascript
const [selectedReport, setSelectedReport] = useState('');
const [reportData, setReportData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

**State Transitions:**
- `selectedReport`: `'' → 'sales' → 'inventory'` (user selection)
- `reportData`: `null → Array → null → Array` (API responses)
- `loading`: `false → true → false` (API call lifecycle)
- `error`: `null → 'Error message' → null` (error handling)

#### useTableControls State
```javascript
const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
```

**State Transitions:**
- `sortConfig`: `{key: null} → {key: 'date', direction: 'asc'} → {key: 'date', direction: 'desc'}`

### State Synchronization
```javascript
// When report changes, table controls reset
const handleReportChange = useCallback(async (e) => {
  const reportId = e.target.value;
  
  // 1. Immediate UI updates (synchronous)
  setSelectedReport(reportId);
  resetControls(); // Clears sortConfig
  
  // 2. Async data fetching
  await fetchReport(reportId);
}, [fetchReport, resetControls, setSelectedReport]);
```

### Derived State
```javascript
// Computed values that depend on state
const columns = reportData && reportData.length > 0 
  ? Object.keys(reportData[0]) 
  : [];

const selectedReportName = reports.find(r => r.id === selectedReport)?.name || 'report';

// In useTableControls
const processedData = useMemo(() => {
  // Sorting logic applied to reportData
}, [data, sortConfig]);
```

---

## User Journey

### Happy Path: Successful Report Generation
```
1. 🏠 User navigates to root URL (/)
   ├── Page loads with empty state
   ├── Report selector shows "Choose a report..."
   └── No table or export button visible

2. 📊 User selects "Sales Report"
   ├── Dropdown value updates immediately
   ├── Loading spinner appears
   ├── Old data (if any) hidden immediately
   └── API request initiated in background

3. ⏳ Loading State (1-2 seconds)
   ├── Spinner with "Loading report data..." text
   ├── Report selector disabled
   └── Previous data completely hidden

4. ✅ Data Loaded Successfully
   ├── Loading spinner disappears
   ├── Table appears with sales data
   ├── Export CSV button becomes available
   ├── Table headers are clickable for sorting
   └── Report title shows "Sales Report"

5. 🔄 User sorts by "Revenue" column
   ├── Column header clicked
   ├── Data re-renders sorted descending
   ├── Arrow indicator (↓) appears
   └── Export button still shows sorted data

6. 📥 User exports to CSV
   ├── Export button clicked
   ├── CSV file downloads immediately
   ├── Filename: "sales_report_2024-01-15.csv"
   └── Contains currently sorted data

7. 🔄 User switches to "Inventory Status"
   ├── New report selected
   ├── Previous data hidden immediately
   ├── Sort state reset to default
   ├── Loading → New data appears
   └── Process repeats
```

### Error Path: API Failure
```
1. 🏠 User navigates to root URL (/)

2. 📊 User selects "Sales Report" (same as happy path)

3. ⏳ Loading State (same as happy path)

4. ❌ API Call Fails
   ├── Loading spinner disappears
   ├── Red error message appears
   ├── "Error: Failed to fetch report data"
   ├── No table displayed
   ├── No export button available
   └── Dismiss (X) button on error message

5. 🔄 User dismisses error
   ├── Error message disappears
   ├── Back to empty state
   └── Can try selecting report again

6. 🔄 User tries different report
   ├── May succeed with different report
   └── Or show different error message
```

### Edge Cases Handled
- **Network timeout**: Shows timeout error message
- **Invalid data format**: Graceful error handling
- **Empty dataset**: Shows "No data available" message
- **Large datasets**: All data shown (no pagination)
- **Rapid report switching**: Previous requests cancelled
- **Browser refresh**: Returns to empty state (no persistence)

---

## API Integration

### Current Implementation (Mock API)
```javascript
// Single endpoint for all report types
POST /api/reports
Content-Type: application/json

// Request body varies by report type
{
  "type": "sales",
  "period": "monthly"
}

// Response format (consistent across all reports)
[
  {
    "date": "2024-01-01",
    "product": "Widget A", 
    "revenue": 1000,
    "units": 50,
    "region": "North"
  },
  // ... more rows
]
```

### Real API Integration Pattern
```javascript
// Single endpoint with enhanced payloads
POST /reports/generate
Content-Type: application/json
Authorization: Bearer {token}

// Enhanced request structure
{
  "reportType": "sales",
  "config": {
    "type": "sales",
    "period": "monthly"
  },
  "requestId": "req_1234567890_abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0"
}

// Enhanced response structure
{
  "data": [
    { /* same as mock */ }
  ],
  "metadata": {
    "totalRows": 150,
    "generatedAt": "2024-01-15T10:30:05Z",
    "reportType": "sales",
    "executionTimeMs": 1250
  },
  "requestId": "req_1234567890_abc123"
}
```

### Service Layer Implementation
```javascript
// reportService.js abstracts API details
class ReportService {
  async fetchReport(reportId) {
    // 1. Find report configuration
    const report = REPORTS.find(r => r.id === reportId);
    
    // 2. Build API payload
    const payload = this.buildPayload(reportId, report);
    
    // 3. Make API call via apiClient
    return apiClient.post('/reports', payload);
  }
  
  buildPayload(reportId, report) {
    // Different payload structures per report type
    // But same API endpoint
  }
}
```

### Error Handling Strategy
```javascript
// Three levels of error handling

// 1. Network/HTTP errors (apiClient)
try {
  const response = await fetch(url, config);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
} catch (error) {
  // Network errors, timeouts, etc.
}

// 2. Business logic errors (reportService)
if (!report) {
  throw new Error('Report not found');
}

// 3. UI error display (useReportData hook)
try {
  const data = await reportService.fetchReport(reportId);
  setReportData(data);
} catch (err) {
  setError(err.message); // Displayed to user
  setReportData(null);   // Clear previous data
}
```

---

## Error Handling Strategy

### Error Categories & Responses

#### 1. Network Errors
```javascript
// Timeout, connection issues, DNS failures
Error: "Network request failed"
User sees: "Unable to connect. Please check your internet connection."
Recovery: Retry same request
```

#### 2. HTTP Errors  
```javascript
// 4xx, 5xx status codes
Error: "HTTP error! status: 500"
User sees: "Server error. Please try again later."
Recovery: Retry or try different report
```

#### 3. Data Validation Errors
```javascript
// Invalid report ID, malformed response
Error: "Report not found"
User sees: "Selected report is not available."
Recovery: Choose different report
```

#### 4. Business Logic Errors
```javascript
// Report generation failed, insufficient permissions
Error: "Insufficient permissions for this report"
User sees: "You don't have access to this report."
Recovery: Contact administrator
```

### Error UI States
```javascript
// Error message component
{error && (
  <ErrorMessage 
    message={error} 
    onDismiss={clearError}
  />
)}

// Graceful degradation
{reportData && !loading && !error && (
  <DataTable data={processedData} />
)}
```

### Error Recovery Patterns
```javascript
const handleReportChange = async (e) => {
  try {
    clearError(); // Clear previous errors
    await fetchReport(reportId);
  } catch (err) {
    // Error state set automatically by hook
    // User can try again or select different report
  }
};
```

---

## Performance Considerations

### Current Implementation

#### Data Processing
```javascript
// O(n log n) sorting complexity
const processedData = useMemo(() => {
  if (!data) return [];
  
  let sortedData = [...data]; // O(n) copy
  
  if (sortConfig.key) {
    sortedData.sort((a, b) => { // O(n log n) sort
      // Comparison logic
    });
  }
  
  return sortedData;
}, [data, sortConfig]); // Only recomputes when data or sort changes
```

#### Memory Usage
- **Small datasets (< 1000 rows)**: No optimization needed
- **Medium datasets (1000-10000 rows)**: Current implementation sufficient
- **Large datasets (> 10000 rows)**: May need virtual scrolling

#### Re-render Optimization
```javascript
// useCallback prevents unnecessary re-renders
const handleSort = useCallback((key) => {
  setSortConfig(prev => ({
    key,
    direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
  }));
}, []); // No dependencies = stable reference

// useMemo prevents expensive recalculations
const columns = useMemo(() => {
  return reportData && reportData.length > 0 
    ? Object.keys(reportData[0]) 
    : [];
}, [reportData]); // Only recalculate when data changes
```

### Performance Metrics
- **Initial page load**: < 500ms
- **Report selection**: 1-3 seconds (API dependent)
- **Sorting**: < 100ms for datasets up to 5000 rows
- **CSV export**: < 2 seconds for datasets up to 10000 rows

### Potential Optimizations

#### For Large Datasets
```javascript
// Virtual scrolling for 10k+ rows
import { FixedSizeList as List } from 'react-window';

// Server-side sorting for huge datasets
const fetchReport = async (reportId, sortConfig) => {
  const payload = {
    reportType: reportId,
    sort: sortConfig // Let server handle sorting
  };
  return apiClient.post('/reports', payload);
};

// Pagination for memory management
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 100;
```

#### Caching Strategy
```javascript
// Cache report data to avoid re-fetching
const reportCache = new Map();

const fetchReport = async (reportId) => {
  const cacheKey = `${reportId}_${Date.now() - (Date.now() % 300000)}`; // 5min cache
  
  if (reportCache.has(cacheKey)) {
    return reportCache.get(cacheKey);
  }
  
  const data = await reportService.fetchReport(reportId);
  reportCache.set(cacheKey, data);
  return data;
};
```

---

## Extension Points

### Adding New Report Types
```javascript
// 1. Add to REPORTS configuration
const REPORTS = [
  // existing reports...
  { 
    id: 'user-activity', 
    name: 'User Activity Report', 
    payload: { type: 'user-activity', period: 'daily' } 
  }
];

// 2. Update API to handle new payload
// 3. No component changes needed - they're data-driven
```

### Adding New Table Features

#### Search/Filter Functionality
```javascript
// Extend useTableControls hook
export const useTableControls = (data) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const processedData = useMemo(() => {
    let filtered = data;
    
    // Add search filtering
    if (searchTerm) {
      filtered = data.filter(row => 
        Object.values(row).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    // Existing sorting logic...
  }, [data, searchTerm, sortConfig]);
  
  return {
    // existing returns...
    searchTerm,
    setSearchTerm,
  };
};
```

#### Column Customization
```javascript
// Allow users to show/hide columns
const [visibleColumns, setVisibleColumns] = useState(new Set());

// Column configuration UI
<ColumnSelector 
  availableColumns={allColumns}
  visibleColumns={visibleColumns}
  onToggle={setVisibleColumns}
/>

// Updated DataTable
<DataTable
  data={processedData}
  columns={allColumns.filter(col => visibleColumns.has(col))}
  sortConfig={sortConfig}
  onSort={handleSort}
/>
```

### Real-time Data Updates
```javascript
// WebSocket integration
const useRealtimeReportData = (reportId) => {
  const [reportData, setReportData] = useState(null);
  
  useEffect(() => {
    if (!reportId) return;
    
    const ws = new WebSocket(`/ws/reports/${reportId}`);
    
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setReportData(newData);
    };
    
    return () => ws.close();
  }, [reportId]);
  
  return { reportData };
};
```

### Advanced Export Options
```javascript
// Multiple export formats
const ExportDropdown = ({ data, filename }) => {
  const exportFormats = [
    { id: 'csv', name: 'CSV', handler: exportToCSV },
    { id: 'excel', name: 'Excel', handler: exportToExcel },
    { id: 'pdf', name: 'PDF', handler: exportToPDF },
  ];
  
  return (
    <Dropdown>
      {exportFormats.map(format => (
        <DropdownItem 
          key={format.id}
          onClick={() => format.handler(data, filename)}
        >
          Export as {format.name}
        </DropdownItem>
      ))}
    </Dropdown>
  );
};
```

### Dashboard Integration
```javascript
// Embed reports in other pages
const DashboardWidget = ({ reportId, maxRows = 5 }) => {
  const { reportData, loading, error } = useReportData();
  
  useEffect(() => {
    fetchReport(reportId);
  }, [reportId]);
  
  return (
    <div className="dashboard-widget">
      <h3>Latest {getReportName(reportId)}</h3>
      {reportData && (
        <DataTable 
          data={reportData.slice(0, maxRows)} 
          compact 
        />
      )}
      <Link href={`/reports?selected=${reportId}`}>
        View Full Report →
      </Link>
    </div>
  );
};
```

---

## Testing Strategy

### Component Testing
```javascript
// Test complete user flow
test('report selection and display flow', async () => {
  render(<ReportsPage />);
  
  // 1. Initial state
  expect(screen.getByText('Choose a report...')).toBeInTheDocument();
  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  
  // 2. Select report
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sales' } });
  
  // 3. Loading state
  expect(screen.getByText('Loading report data...')).toBeInTheDocument();
  
  // 4. Data loaded
  await waitFor(() => {
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });
  
  // 5. Sorting
  fireEvent.click(screen.getByText('Revenue'));
  expect(screen.getByText('↑')).toBeInTheDocument();
});
```

### Integration Testing
```javascript
// Test API integration with mock service
test('handles API errors gracefully', async () => {
  // Mock API failure
  jest.spyOn(reportService, 'fetchReport').mockRejectedValue(
    new Error('Network error')
  );
  
  render(<ReportsPage />);
  
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'sales' } });
  
  await waitFor(() => {
    expect(screen.getByText(/Network error/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
```

This comprehensive design document provides junior engineers with a complete understanding of how the reports system works, from high-level architecture down to implementation details and future extension possibilities. 