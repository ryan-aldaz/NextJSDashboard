import apiClient from '../lib/apiClient';

// Define our report types and their corresponding payloads
export const REPORTS = [
  { id: 'sales', name: 'Sales Report', payload: { type: 'sales', period: 'monthly' } },
  { id: 'inventory', name: 'Inventory Status', payload: { type: 'inventory', status: 'current' } },
  { id: 'customers', name: 'Customer Analysis', payload: { type: 'customers', segment: 'all' } },
  { id: 'products', name: 'Product Performance', payload: { type: 'products', metric: 'revenue' } },
  { id: 'orders', name: 'Order Summary', payload: { type: 'orders', status: 'completed' } },
];

class ReportService {
  // Current implementation using mock API
  async fetchReport(reportId) {
    const report = REPORTS.find(r => r.id === reportId);
    if (!report) {
      throw new Error('Report not found');
    }

    // Using our internal mock API (single endpoint)
    return apiClient.post('/reports', report.payload);
  }

  // Get all available reports
  getAvailableReports() {
    return REPORTS;
  }

  // Get report metadata
  getReportById(reportId) {
    return REPORTS.find(r => r.id === reportId);
  }
}

// Export singleton instance
const reportService = new ReportService();
export default reportService;

/* 
===========================================
REAL API INTEGRATION - SINGLE ENDPOINT
===========================================

// Example 1: Single API endpoint with different payloads
class RealReportService {
  constructor() {
    // Single endpoint for all reports
    this.reportsEndpoint = '/reports/generate';
  }

  async fetchReport(reportId, options = {}) {
    const report = REPORTS.find(r => r.id === reportId);
    if (!report) {
      throw new Error(`Unknown report type: ${reportId}`);
    }

    // Single API call with different payloads based on report type
    const payload = {
      reportType: reportId,
      ...report.payload, // Base payload for this report type
      ...options, // Additional options like date ranges, etc.
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString()
    };

    return apiClient.post(this.reportsEndpoint, payload);
  }

  // For paginated reports (single endpoint)
  async fetchReportWithPagination(reportId, { page = 1, limit = 100, ...options }) {
    const payload = await this.buildPayload(reportId, {
      pagination: { page, limit },
      ...options
    });

    return apiClient.post(this.reportsEndpoint, payload);
  }

  // Helper to build consistent payloads
  async buildPayload(reportId, options = {}) {
    const report = REPORTS.find(r => r.id === reportId);
    if (!report) {
      throw new Error(`Unknown report type: ${reportId}`);
    }

    return {
      reportType: reportId,
      config: {
        ...report.payload,
        format: options.format || 'json',
        includeMetadata: true,
        ...options
      },
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Example 2: GraphQL single endpoint with different queries
class GraphQLReportService {
  async fetchReport(reportId, variables = {}) {
    const report = REPORTS.find(r => r.id === reportId);
    if (!report) {
      throw new Error(`Unknown report type: ${reportId}`);
    }

    // Single GraphQL endpoint with different query based on report type
    const query = this.buildQuery(reportId);
    const payload = {
      query,
      variables: {
        reportType: reportId,
        config: report.payload,
        ...variables
      }
    };

    return apiClient.post('/graphql', payload);
  }

  buildQuery(reportType) {
    // Dynamic query based on report type but same endpoint
    return `
      query GenerateReport($reportType: String!, $config: JSON!, $dateRange: DateRange) {
        generateReport(type: $reportType, config: $config, dateRange: $dateRange) {
          id
          status
          data {
            headers
            rows
            totalCount
          }
          metadata {
            generatedAt
            executionTime
            reportType
          }
          errors {
            code
            message
          }
        }
      }
    `;
  }
}

// Example 3: Enterprise API with single endpoint and different payload structures
class EnterpriseReportService {
  constructor() {
    this.endpoint = '/api/v2/analytics/reports';
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  async fetchReport(reportId, options = {}) {
    const payload = this.buildEnterprisePayload(reportId, options);
    
    return this.retryRequest(() => 
      apiClient.post(this.endpoint, payload, {
        headers: {
          'X-Request-ID': payload.requestId,
          'X-Report-Type': reportId,
          'X-API-Version': '2.0'
        }
      })
    );
  }

  buildEnterprisePayload(reportId, options = {}) {
    const report = REPORTS.find(r => r.id === reportId);
    if (!report) {
      throw new Error(`Unknown report type: ${reportId}`);
    }

    // Different payload structures for different report types
    const payloadStructures = {
      sales: {
        analytics: {
          type: 'sales_performance',
          dimensions: ['date', 'product', 'region'],
          metrics: ['revenue', 'units_sold'],
          ...report.payload
        }
      },
      inventory: {
        analytics: {
          type: 'inventory_snapshot',
          dimensions: ['product', 'location'],
          metrics: ['quantity', 'value'],
          ...report.payload
        }
      },
      customers: {
        analytics: {
          type: 'customer_analysis',
          dimensions: ['segment', 'acquisition_date'],
          metrics: ['ltv', 'churn_risk'],
          ...report.payload
        }
      },
      products: {
        analytics: {
          type: 'product_performance',
          dimensions: ['category', 'brand'],
          metrics: ['revenue', 'margin', 'rating'],
          ...report.payload
        }
      },
      orders: {
        analytics: {
          type: 'order_summary',
          dimensions: ['status', 'payment_method'],
          metrics: ['total_value', 'count'],
          ...report.payload
        }
      }
    };

    return {
      requestId: this.generateRequestId(),
      timestamp: new Date().toISOString(),
      reportDefinition: payloadStructures[reportId] || payloadStructures.sales,
      outputFormat: options.format || 'json',
      async: options.async || false,
      ...options
    };
  }

  async retryRequest(requestFn) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxRetries) break;
        
        if (this.shouldRetry(error)) {
          await this.delay(this.retryDelay * attempt);
          continue;
        }
        
        throw error;
      }
    }
    
    throw lastError;
  }

  shouldRetry(error) {
    return !error.response || 
           (error.response.status >= 500 && error.response.status < 600);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Example 4: Real-world usage patterns with single endpoint
const exampleUsage = {
  // Basic report with single endpoint
  basic: async () => {
    const payload = {
      reportType: 'sales',
      period: 'monthly',
      format: 'json'
    };
    return apiClient.post('/reports/generate', payload);
  },

  // Report with date range (single endpoint)
  withDateRange: async () => {
    const payload = {
      reportType: 'sales',
      period: 'custom',
      dateRange: {
        start: '2024-01-01',
        end: '2024-12-31'
      },
      format: 'json',
      includeBreakdown: true
    };
    return apiClient.post('/reports/generate', payload);
  },

  // Async report generation (single endpoint)
  asyncGeneration: async () => {
    const payload = {
      reportType: 'large-dataset',
      async: true,
      format: 'csv',
      options: {
        includeDetails: true,
        compression: 'gzip'
      }
    };

    // Single endpoint returns job ID
    const job = await apiClient.post('/reports/generate', payload);
    
    // Poll same endpoint with job ID
    let status = await apiClient.get(`/reports/status/${job.jobId}`);
    
    while (status.status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      status = await apiClient.get(`/reports/status/${job.jobId}`);
    }

    if (status.status === 'completed') {
      return apiClient.get(`/reports/download/${job.jobId}`);
    } else {
      throw new Error(`Report generation failed: ${status.error}`);
    }
  }
};

// To use a real API service with single endpoint:
// 1. Replace the mock ReportService with RealReportService
// 2. Update environment variables for the single API endpoint
// 3. Configure authentication tokens  
// 4. All reports use same endpoint with different payloads

export { 
  RealReportService, 
  GraphQLReportService, 
  EnterpriseReportService,
  exampleUsage 
};
*/ 