# Reports Dashboard

A simple, clean Next.js dashboard application for viewing and exporting report data.

## ✨ Features

- 📊 **Report Selection**: Choose from 5 different report types
- 🔄 **Data Loading**: Submit-based data fetching with loading states
- ↕️ **Interactive Sorting**: Click column headers to sort data
- 📥 **CSV Export**: Download report data with timestamps
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- ⚡ **Fast & Simple**: Lightweight architecture, no over-engineering

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) to view the dashboard

## 🏗️ Architecture

### Simple & Clean Design
- **Functional Components**: Modern React with hooks
- **Minimal Dependencies**: Only essential packages
- **No Over-Engineering**: Direct fetch calls, inline components where appropriate
- **Component Separation**: Reusable UI components for maintainability

### Project Structure
```
src/
├── app/
│   ├── page.js              # Main dashboard (functional component with hooks)
│   ├── layout.js            # App layout
│   ├── globals.css          # Global styles
│   └── api/
│       └── reports/
│           └── route.js     # Report data API (POST endpoint)
├── components/
│   ├── reports/
│   │   ├── ReportSelector.js    # Simple dropdown component
│   │   ├── DataTable.js         # Sortable data table
│   │   └── ExportButton.js      # CSV export functionality
│   └── ui/
│       ├── Button.js            # Reusable button component
│       └── ErrorMessage.js     # Error display component
└── constants/
    └── index.js             # App constants (reports, messages, etc.)
```

## 🎯 Key Components

### Main Dashboard (`src/app/page.js`)
- **Pattern**: Functional component with React hooks
- **State**: `useState` for selectedReport, reportData, loading, error
- **Features**: Report selection, submit button, data display, error handling

### ReportSelector (`src/components/reports/ReportSelector.js`)
- Simple dropdown component for report selection
- No complex logic, just presentation

### DataTable (`src/components/reports/DataTable.js`)
- Self-contained sortable table
- Manages its own sorting state
- Click column headers to sort

### ExportButton (`src/components/reports/ExportButton.js`)
- CSV export with proper escaping
- Timestamps in filenames
- Uses reusable Button component

## 🔄 Data Flow

1. **User selects report** → Updates state
2. **User clicks "Load Report"** → POST to `/api/reports`
3. **API returns mock data** → Updates reportData state
4. **DataTable displays data** → Self-managed sorting
5. **Export button available** → Downloads CSV

## 🛠️ API

### POST `/api/reports`
**Request Body**: `{ type: "sales" | "inventory" | "customers" | "products" | "orders" }`
**Response**: Array of report data objects

## 📝 Development Notes

- **Modern React**: Uses functional components and hooks throughout
- **No Class Components**: All converted to modern patterns
- **Minimal Abstractions**: Direct fetch calls, no complex API clients
- **Clean Constants**: Only what's actually used
- **Component Reusability**: UI components can be reused across the app

## 🚢 Deployment

Deploy on [Vercel](https://vercel.com) (recommended):

```bash
npm run build
```

Or any other Next.js hosting platform.

## 📖 Documentation

See the `/docs` folder for detailed component documentation and guides.
