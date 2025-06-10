# Component Documentation

## Table of Contents
- [UI Components](#ui-components)
- [Report Components](#report-components) 
- [Main Dashboard](#main-dashboard)
- [Best Practices](#best-practices)

---

## UI Components

### Button (`src/components/ui/Button.js`)

**Purpose**: Reusable button component with consistent styling and variants.

**Props**:
- `variant` (string): Button style variant
  - `'primary'` - Blue background (default)
  - `'secondary'` - Gray background
  - `'success'` - Green background
  - `'outline'` - Bordered button
- `size` (string): Button size
  - `'sm'` - Small button
  - `'md'` - Medium button (default)
  - `'lg'` - Large button
- `disabled` (boolean): Disables the button
- `className` (string): Additional CSS classes
- `children` (ReactNode): Button content
- `...props`: All other button props (onClick, type, etc.)

**Usage Examples**:
```jsx
// Basic usage
<Button onClick={handleClick}>
  Click me
</Button>

// With variant and size
<Button variant="success" size="lg" onClick={handleSave}>
  Save Report
</Button>

// With icon
<Button variant="outline" disabled={loading}>
  <Icon name="download" />
  Export CSV
</Button>
```

**When to use**: 
- ✅ All interactive buttons in the application
- ✅ When you need consistent styling
- ✅ When you need different button variants

**When NOT to use**:
- ❌ For navigation links (use Next.js Link instead)
- ❌ For simple inline buttons (use HTML button element)

---

### ErrorMessage (`src/components/ui/ErrorMessage.js`)

**Purpose**: Consistent error display with accessibility and dismiss functionality.

**Props**:
- `message` (string): Error message to display
- `onClose` (function): Dismiss handler function
- `className` (string): Additional CSS classes

**Usage Examples**:
```jsx
// Basic error message with close handler
<ErrorMessage 
  message={error} 
  onClose={() => setError(null)}
/>

// Conditional rendering
{error && (
  <ErrorMessage 
    message={error} 
    onClose={() => setError(null)}
  />
)}
```

**Accessibility Features**:
- `role="alert"` for screen readers
- Proper focus management
- Clear dismiss button with aria-label

**When to use**:
- ✅ API errors
- ✅ Form validation errors
- ✅ User action feedback

---

## Report Components

### ReportSelector (`src/components/reports/ReportSelector.js`)

**Purpose**: Simple dropdown selector for choosing report types.

**Props**:
- `reports` (array): Array of report objects with `id` and `name`
- `selectedReport` (string): Currently selected report ID
- `onReportChange` (function): Change handler function
- `loading` (boolean): Disable dropdown when loading

**Usage Example**:
```jsx
<ReportSelector
  reports={REPORTS}
  selectedReport={selectedReport}
  onReportChange={handleReportChange}
  loading={loading}
/>
```

**When to use**:
- ✅ Report selection in dashboards
- ✅ When you need a labeled dropdown
- ✅ Consistent styling across the app

---

### DataTable (`src/components/reports/DataTable.js`)

**Purpose**: Self-contained sortable data table with internal state management.

**Props**:
- `data` (array): Array of data objects to display
- `columns` (array): Array of column keys to show

**Key Features**:
- **Self-Managing Sorting**: Handles sort state internally
- **Click to Sort**: Click column headers to sort
- **Sort Indicators**: Shows ↑/↓ arrows for current sort
- **No External State**: Manages sorting completely internally

**Usage Example**:
```jsx
const columns = reportData?.length ? Object.keys(reportData[0]) : [];

<DataTable 
  data={reportData} 
  columns={columns} 
/>
```

**Internal Behavior**:
- Maintains `sortKey` and `sortDirection` in component state
- Handles sort direction toggling
- Displays sorted data automatically

**When to use**:
- ✅ Displaying tabular report data
- ✅ When you want sorting without external state management
- ✅ Clean, minimal table display

---

### ExportButton (`src/components/reports/ExportButton.js`)

**Purpose**: CSV export functionality with proper data escaping and timestamps.

**Props**:
- `data` (array): Data to export
- `filename` (string): Base filename (timestamp added automatically)
- `variant` (string): Button variant (optional)

**Features**:
- **Automatic CSV Escaping**: Handles commas, quotes, newlines
- **Timestamp Filenames**: Adds date to filename automatically
- **Uses Button Component**: Consistent styling
- **Download Icon**: Visual export indicator

**Usage Example**:
```jsx
<ExportButton
  data={reportData}
  filename={`${selectedReport}_report`}
/>
```

**Generated Filename**: `sales_report_2024-01-15.csv`

**When to use**:
- ✅ Exporting report data
- ✅ When you need CSV download functionality
- ✅ Consistent export experience

---

## Main Dashboard

### Main Page (`src/app/page.js`)

**Architecture**: Functional component with React hooks

**State Management**:
```javascript
const [selectedReport, setSelectedReport] = useState('');
const [reportData, setReportData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

**Key Features**:
- **Submit-Based Loading**: User clicks "Load Report" button
- **Loading States**: Button shows loading text
- **Error Handling**: Displays errors with dismiss functionality
- **Export Integration**: Shows export button when data available

**Data Flow**:
1. User selects report from dropdown
2. User clicks "Load Report" button
3. POST request to `/api/reports` with report type
4. Data displayed in sortable table
5. Export button becomes available

---

## Best Practices

### Component Architecture

**✅ DO:**
- Use functional components with hooks
- Keep components focused on single responsibility
- Use `useState` for component-specific state
- Use props for component communication
- Keep styling consistent with Tailwind classes

**❌ DON'T:**
- Use class components (outdated pattern)
- Over-engineer with unnecessary abstractions
- Create complex prop drilling chains
- Mix business logic with presentation

### State Management

**✅ DO:**
```javascript
// Clean, modern hook usage
const [selectedReport, setSelectedReport] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

**❌ DON'T:**
```javascript
// Avoid class component patterns
this.setState({ selectedReport: value });
```

### API Calls

**✅ DO:**
```javascript
// Direct, clean fetch calls
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: selectedReport })
});
```

**❌ DON'T:**
- Over-engineer with complex API client abstractions for simple use cases
- Create unnecessary service layers for single endpoints

### Component Design

**✅ DO:**
- Keep components reusable but not over-abstracted
- Use semantic HTML elements
- Include proper accessibility attributes
- Handle loading and error states

**❌ DON'T:**
- Create components for every small piece of UI
- Ignore accessibility requirements
- Skip error handling

### File Organization

**✅ Current Structure:**
```
src/
├── app/page.js              # Main dashboard
├── components/
│   ├── reports/             # Report-specific components
│   └── ui/                  # Reusable UI components
├── constants/               # App constants
└── api/reports/            # API endpoints
```

**Why this works:**
- Clear separation of concerns
- Easy to find components
- Scalable structure
- Follows Next.js conventions
- `reports` (array): Array of report objects `[{id, name}, ...]`
- `selectedReport` (string): Currently selected report ID
- `onReportChange` (function): Handler for report selection change
- `loading` (boolean): Disables selector during loading
- `className` (string): Additional CSS classes

**Usage Examples**:
```jsx
<ReportSelector
  reports={availableReports}
  selectedReport={currentReport}
  onReportChange={handleReportChange}
  loading={isLoading}
/>

// With custom styling
<ReportSelector
  reports={reports}
  selectedReport={selectedReport}
  onReportChange={handleChange}
  className="mb-6"
/>
```

**Report Object Structure**:
```javascript
{
  id: 'sales',           // Unique identifier
  name: 'Sales Report'   // Display name
}
```

**When to use**:
- ✅ When user needs to select from multiple report types
- ✅ When reports have different data structures

---

### DataTable (`src/components/reports/DataTable.js`)

**Purpose**: Sortable table component that dynamically renders data.

**Props**:
- `data` (array): Array of objects to display
- `columns` (array): Array of column names
- `sortConfig` (object): Current sort configuration `{key, direction}`
- `onSort` (function): Handler for column sorting
- `className` (string): Additional CSS classes

**Usage Examples**:
```jsx
<DataTable
  data={reportData}
  columns={['date', 'product', 'revenue']}
  sortConfig={sortConfig}
  onSort={handleSort}
/>

// With processed data
<DataTable
  data={processedData}
  columns={Object.keys(reportData[0] || {})}
  sortConfig={sortConfig}
  onSort={handleSort}
/>
```

**Data Structure Requirements**:
```javascript
// Data should be array of objects
[
  { date: '2024-01-01', product: 'Widget A', revenue: 1000 },
  { date: '2024-01-02', product: 'Widget B', revenue: 1500 }
]

// Columns should match object keys
['date', 'product', 'revenue']
```

**Features**:
- Automatic column header generation
- Click-to-sort functionality
- Visual sort indicators (↑/↓)
- Responsive design with horizontal scroll
- Hover effects

**When to use**:
- ✅ Displaying tabular data
- ✅ When users need to sort data
- ✅ For reports and data analysis

---

### ExportButton (`src/components/reports/ExportButton.js`)

**Purpose**: Button component that exports data to CSV format.

**Props**:
- `data` (array): Data to export
- `filename` (string): Base filename (without extension)
- `disabled` (boolean): Disables export button
- `variant` (string): Button variant (default: 'success')
- `className` (string): Additional CSS classes

**Usage Examples**:
```jsx
<ExportButton
  data={reportData}
  filename="sales_report"
/>

// With custom variant
<ExportButton
  data={processedData}
  filename={`${reportName}_export`}
  variant="outline"
  disabled={!reportData.length}
/>
```

**Features**:
- Automatic CSV formatting
- Proper escaping of special characters
- Timestamp appending to filename
- Browser-compatible download
- Disabled state when no data

**CSV Features**:
- Headers from object keys
- Proper comma/quote escaping
- UTF-8 encoding
- RFC 4180 compliant

---

## Custom Hooks

### useReportData (`src/hooks/useReportData.js`)

**Purpose**: Manages report data fetching, loading states, and error handling.

**Returns**:
```javascript
{
  reports,          // Available reports array
  selectedReport,   // Currently selected report ID
  setSelectedReport,// Function to set selected report
  reportData,       // Fetched report data
  loading,          // Loading state boolean
  error,            // Error message string
  fetchReport,      // Function to fetch report by ID
  clearError,       // Function to clear error state
}
```

**Usage Examples**:
```jsx
function ReportsPage() {
  const {
    reports,
    selectedReport,
    setSelectedReport,
    reportData,
    loading,
    error,
    fetchReport,
    clearError,
  } = useReportData();

  const handleReportChange = async (e) => {
    const reportId = e.target.value;
    setSelectedReport(reportId);
    await fetchReport(reportId);
  };

  return (
    <div>
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
      {reportData && <DataTable data={reportData} />}
    </div>
  );
}
```

**Features**:
- Automatic error handling
- Loading state management
- Report metadata access
- Service layer integration

**When to use**:
- ✅ Any component that needs report data
- ✅ When you need loading/error states
- ✅ For consistent data fetching patterns

---

### useTableControls (`src/hooks/useTableControls.js`)

**Purpose**: Manages table sorting functionality.

**Parameters**:
- `data` (array): Raw data array to process

**Returns**:
```javascript
{
  sortConfig,     // Current sort config {key, direction}
  processedData,  // Sorted data array
  handleSort,     // Function to sort by column key
  resetControls,  // Function to reset sorting
}
```

**Usage Examples**:
```jsx
function DataDisplay({ rawData }) {
  const {
    sortConfig,
    processedData,
    handleSort,
    resetControls,
  } = useTableControls(rawData);

  return (
    <div>
      <button onClick={resetControls}>Reset Sort</button>
      <DataTable
        data={processedData}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </div>
  );
}
```

**Features**:
- Automatic sorting logic
- Toggle between ascending/descending
- Type-aware sorting (strings, numbers, dates)
- Memory efficient processing

**When to use**:
- ✅ With DataTable component
- ✅ When users need to sort data
- ✅ For any sortable list/table

---

## Services

### reportService (`src/services/reportService.js`)

**Purpose**: Service layer for all report-related API calls.

**Methods**:
```javascript
// Fetch report data by ID
await reportService.fetchReport(reportId)

// Get available reports
reportService.getAvailableReports()

// Get report metadata
reportService.getReportById(reportId)
```

**Usage Examples**:
```javascript
// In a hook or component
try {
  const data = await reportService.fetchReport('sales');
  setReportData(data);
} catch (error) {
  setError(error.message);
}

// Get report list
const availableReports = reportService.getAvailableReports();

// Get specific report info
const reportInfo = reportService.getReportById('sales');
```

**Features**:
- Centralized API logic
- Error handling
- Type validation
- Easy mocking for tests

---

### apiClient (`src/lib/apiClient.js`)

**Purpose**: Base HTTP client for all API communications.

**Methods**:
```javascript
// HTTP methods
await apiClient.get(endpoint, options)
await apiClient.post(endpoint, data, options)
await apiClient.put(endpoint, data, options)
await apiClient.delete(endpoint, options)

// Authentication
apiClient.setAuthToken(token)
```

**Usage Examples**:
```javascript
// GET request
const users = await apiClient.get('/users');

// POST request
const newUser = await apiClient.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// With authentication
apiClient.setAuthToken('your-jwt-token');
const protectedData = await apiClient.get('/protected');
```

**Features**:
- Automatic error handling
- Authentication management
- Request/response interceptors
- Environment configuration

---

## Best Practices

### Component Usage

**✅ DO**:
- Use TypeScript for better developer experience
- Keep components small and focused
- Use semantic HTML elements
- Handle loading and error states
- Follow accessibility guidelines

**❌ DON'T**:
- Mix business logic with UI logic
- Create overly complex components
- Ignore error handling
- Skip prop validation
- Hardcode styles

### Hook Usage

**✅ DO**:
- Use hooks for state management and side effects
- Keep hooks focused on single responsibility
- Use useCallback and useMemo for performance
- Handle cleanup in useEffect

**❌ DON'T**:
- Create hooks that do too many things
- Forget dependency arrays
- Ignore hook rules
- Mix different concerns in one hook

### Service Layer

**✅ DO**:
- Keep all API logic in services
- Use consistent error handling
- Return predictable data structures
- Handle different environments

**❌ DON'T**:
- Make API calls directly from components
- Ignore error cases
- Hardcode URLs or tokens
- Mix service logic with UI logic

### Code Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── reports/         # Feature-specific components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── services/            # API service layer
├── lib/                 # Utilities and configurations
└── app/                 # Next.js pages
```

### Testing Guidelines

**Component Testing**:
- Test user interactions
- Test different props combinations
- Test error states
- Test accessibility

**Hook Testing**:
- Test state changes
- Test side effects
- Test error handling
- Use React Testing Library

**Service Testing**:
- Mock API responses
- Test error scenarios
- Test different data formats
- Test authentication

---

## Migration Examples

### From Direct API Calls
```javascript
// ❌ Before (in component)
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

// ✅ After (using hooks and services)
const { reportData, loading, error } = useReportData();
```

### From Inline Styles to Components
```javascript
// ❌ Before
<button 
  style={{
    backgroundColor: 'blue',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px'
  }}
  onClick={handleClick}
>
  Click me
</button>

// ✅ After
<Button variant="primary" onClick={handleClick}>
  Click me
</Button>
```

This documentation provides a comprehensive guide for junior engineers to understand and use our component library effectively. 