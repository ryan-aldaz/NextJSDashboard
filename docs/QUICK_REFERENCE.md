# Quick Reference Guide

## 🚀 Quick Component Lookup

### UI Components

```jsx
// Button
<Button variant="primary|secondary|success|outline" size="sm|md|lg" disabled onClick={handler}>
  Content
</Button>

// Input
<Input label="Label" error="Error message" value={value} onChange={handler} />

// LoadingSpinner
<LoadingSpinner size="sm|md|lg" text="Loading message" />

// ErrorMessage  
<ErrorMessage message="Error text" onDismiss={handler} />
```

### Report Components

```jsx
// ReportSelector
<ReportSelector 
  reports={[{id, name}]} 
  selectedReport={id} 
  onReportChange={handler} 
  loading={boolean} 
/>

// DataTable
<DataTable 
  data={[{...}, {...}]} 
  columns={['col1', 'col2']} 
  sortConfig={{key, direction}} 
  onSort={handler} 
/>

// ExportButton
<ExportButton data={array} filename="report_name" disabled={boolean} />
```

### Layout Components

```jsx
// PageLayout
<PageLayout title="Page Title" backHref="/path" backLabel="Back Text">
  {children}
</PageLayout>
```

## 🎣 Hook Quick Reference

### useReportData()
```javascript
const {
  reports,           // Array of available reports
  selectedReport,    // String: current report ID
  setSelectedReport, // Function: (id) => void
  reportData,        // Array: fetched data
  loading,           // Boolean: loading state
  error,             // String: error message
  fetchReport,       // Function: (id) => Promise
  clearError,        // Function: () => void
} = useReportData();
```

### useTableControls(data)
```javascript
const {
  sortConfig,     // Object: {key, direction}
  processedData,  // Array: sorted data
  handleSort,     // Function: (columnKey) => void
  resetControls,  // Function: () => void
} = useTableControls(rawData);
```

## 🔧 Service Quick Reference

### reportService
```javascript
// Fetch report data
const data = await reportService.fetchReport(reportId);

// Get available reports
const reports = reportService.getAvailableReports();

// Get report metadata
const report = reportService.getReportById(reportId);
```

### apiClient
```javascript
// HTTP methods
const data = await apiClient.get('/endpoint');
const result = await apiClient.post('/endpoint', payload);

// Authentication
apiClient.setAuthToken(token);
```

## 📋 Common Patterns

### Basic Report Page
```jsx
function ReportPage() {
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

  const {
    sortConfig,
    processedData,
    handleSort,
    resetControls,
  } = useTableControls(reportData);

  const handleReportChange = async (e) => {
    setSelectedReport(e.target.value);
    resetControls();
    await fetchReport(e.target.value);
  };

  return (
    <PageLayout title="Reports">
      <ReportSelector 
        reports={reports}
        selectedReport={selectedReport}
        onReportChange={handleReportChange}
        loading={loading}
      />
      
      {loading && <LoadingSpinner text="Loading report..." />}
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
      
      {reportData && (
        <div className="bg-white rounded-lg border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2>Report Title</h2>
              <ExportButton data={processedData} filename="report" />
            </div>
          </div>
          
          <DataTable
            data={processedData}
            columns={Object.keys(reportData[0] || {})}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      )}
    </PageLayout>
  );
}
```

### Form with Validation
```jsx
function FormComponent() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/users', { name, email });
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
      
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      
      {errors.general && <ErrorMessage message={errors.general} />}
      
      <Button type="submit" disabled={loading}>
        {loading ? <LoadingSpinner size="sm" text="" /> : 'Submit'}
      </Button>
    </form>
  );
}
```

## 🎨 Styling Guidelines

### Tailwind Classes
```css
/* Common spacing */
p-4, p-6, p-8          /* Padding */
m-4, mb-6, mt-8        /* Margins */
gap-2, gap-4, gap-6    /* Flexbox gaps */

/* Colors */
bg-white, bg-gray-50   /* Backgrounds */
text-gray-900, text-gray-600  /* Text colors */
border-gray-200        /* Borders */

/* Layout */
flex, grid             /* Display */
rounded-lg             /* Border radius */
shadow-sm              /* Shadows */
```

### Component Structure
```jsx
// Consistent component structure
function Component({ prop1, prop2, className = '', ...props }) {
  // State and logic here
  
  return (
    <div className={`base-classes ${className}`} {...props}>
      {/* Content */}
    </div>
  );
}
```

## 🚨 Common Mistakes to Avoid

### ❌ DON'T
```jsx
// Don't make API calls in components
useEffect(() => {
  fetch('/api/data').then(/* ... */);
}, []);

// Don't hardcode styles
<div style={{ backgroundColor: 'blue' }}>

// Don't ignore error states
const { data } = useReportData(); // Missing error handling

// Don't forget loading states
{data && <DataTable data={data} />} // No loading indicator
```

### ✅ DO
```jsx
// Use hooks for data fetching
const { reportData, loading, error } = useReportData();

// Use component system
<Button variant="primary">Click me</Button>

// Handle all states
{loading && <LoadingSpinner />}
{error && <ErrorMessage message={error} />}
{reportData && <DataTable data={reportData} />}
```

## 📱 Responsive Design

### Mobile-First Approach
```jsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Responsive text
<h1 className="text-2xl md:text-3xl lg:text-4xl">

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
```

## 🧪 Testing Examples

### Component Testing
```javascript
import { render, screen } from '@testing-library/react';
import Button from '../Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
});
```

### Hook Testing
```javascript
import { renderHook, act } from '@testing-library/react';
import { useTableControls } from '../useTableControls';

test('sorts data correctly', () => {
  const data = [{ name: 'B' }, { name: 'A' }];
  const { result } = renderHook(() => useTableControls(data));
  
  act(() => {
    result.current.handleSort('name');
  });
  
  expect(result.current.processedData[0].name).toBe('A');
});
```

This quick reference provides immediate access to the most commonly needed information for day-to-day development. 