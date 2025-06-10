# Quick Reference Guide

## 🚀 Quick Component Lookup

### UI Components

```jsx
// Button
<Button variant="primary|secondary|success|outline" size="sm|md|lg" disabled onClick={handler}>
  Content
</Button>

// ErrorMessage  
<ErrorMessage message="Error text" onClose={handler} />
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

// DataTable (self-managing sorting)
<DataTable 
  data={[{...}, {...}]} 
  columns={['col1', 'col2']} 
/>

// ExportButton
<ExportButton data={array} filename="report_name" />
```

## 🎣 React Hooks Quick Reference

### Main Dashboard State Management
```javascript
// Modern functional component with hooks
export default function ReportDashboard() {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedReport) {
      setError('Please select a report first');
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedReport })
      });
      
      if (!response.ok) throw new Error('Failed to fetch report data');
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
}
```

## 🔧 API Quick Reference

### POST /api/reports
```javascript
// Request
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: 'sales' }) // sales|inventory|customers|products|orders
});

// Response
const data = await response.json(); // Array of report objects
```

## 📋 Common Patterns

### Complete Main Dashboard Example
```jsx
import { useState } from 'react';
import ReportSelector from '../components/reports/ReportSelector';
import DataTable from '../components/reports/DataTable';
import ExportButton from '../components/reports/ExportButton';
import ErrorMessage from '../components/ui/ErrorMessage';
import { REPORTS, UI_MESSAGES } from '../constants';

export default function ReportDashboard() {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleReportChange = (event) => {
    setSelectedReport(event.target.value);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedReport) {
      setError('Please select a report first');
      return;
    }

    setLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedReport })
      });
      
      if (!response.ok) throw new Error(UI_MESSAGES.FETCH_ERROR);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const columns = reportData?.length ? Object.keys(reportData[0]) : [];
  const reportName = REPORTS.find(r => r.id === selectedReport)?.name;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports Dashboard</h1>
        {reportData?.length > 0 && (
          <ExportButton
            data={reportData}
            filename={`${selectedReport}_report`}
          />
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <ReportSelector
              reports={REPORTS}
              selectedReport={selectedReport}
              onReportChange={handleReportChange}
              loading={loading}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!selectedReport || loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load Report'}
          </button>
        </div>
      </div>

      <ErrorMessage 
        message={error}
        onClose={() => setError(null)}
      />

      {reportData?.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">{reportName}</h2>
            <DataTable data={reportData} columns={columns} />
          </div>
        </div>
      )}

      {reportData?.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-8 text-center text-gray-500">
          {UI_MESSAGES.NO_DATA}
        </div>
      )}
    </div>
  );
}
```

## 🏗️ Architecture Notes

### Modern React Patterns Used
- ✅ **Functional Components**: All components use modern function syntax
- ✅ **React Hooks**: `useState` for state management throughout
- ✅ **Direct Fetch**: No over-engineered API clients, just direct fetch calls
- ✅ **Component Separation**: Reusable UI components where it makes sense
- ✅ **Self-Contained Logic**: DataTable manages its own sorting state

### Constants Structure
```javascript
// src/constants/index.js
export const REPORTS = [
  { id: 'sales', name: 'Sales Report' },
  { id: 'inventory', name: 'Inventory Status' },
  { id: 'customers', name: 'Customer Analysis' },
  { id: 'products', name: 'Product Performance' },
  { id: 'orders', name: 'Order Summary' }
];

export const TABLE_CONFIG = {
  SORT_DIRECTIONS: {
    ASC: 'asc',
    DESC: 'desc'
  }
};

export const UI_MESSAGES = {
  LOADING: 'Loading report data...',
  FETCH_ERROR: 'Failed to fetch report data',
  NO_DATA: 'No data available'
};
```

### Simple API Pattern
```javascript
// Clean, direct approach - no abstractions needed for single endpoint
const response = await fetch('/api/reports', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ type: selectedReport })
});

if (!response.ok) throw new Error('Failed to fetch report data');
const data = await response.json();
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save'}
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