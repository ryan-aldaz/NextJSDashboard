/**
 * Application-wide constants
 */

// Available reports
export const REPORTS = [
  { id: 'sales', name: 'Sales Report' },
  { id: 'inventory', name: 'Inventory Status' },
  { id: 'customers', name: 'Customer Analysis' },
  { id: 'products', name: 'Product Performance' },
  { id: 'orders', name: 'Order Summary' }
];

// Table configuration
export const TABLE_CONFIG = {
  SORT_DIRECTIONS: {
    ASC: 'asc',
    DESC: 'desc'
  }
};

// UI Messages
export const UI_MESSAGES = {
  LOADING: 'Loading report data...',
  FETCH_ERROR: 'Failed to fetch report data',
  NO_DATA: 'No data available'
}; 