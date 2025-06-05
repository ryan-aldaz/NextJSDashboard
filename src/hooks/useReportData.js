import { useState, useCallback } from 'react';
import reportService from '../services/reportService';

// Define our report types and their corresponding payloads
const REPORTS = [
  { id: 'sales', name: 'Sales Report', payload: { type: 'sales', period: 'monthly' } },
  { id: 'inventory', name: 'Inventory Status', payload: { type: 'inventory', status: 'current' } },
  { id: 'customers', name: 'Customer Analysis', payload: { type: 'customers', segment: 'all' } },
  { id: 'products', name: 'Product Performance', payload: { type: 'products', metric: 'revenue' } },
  { id: 'orders', name: 'Order Summary', payload: { type: 'orders', status: 'completed' } },
];

// API Reference Code (commented out)
/*
// Example of how to call a real API
const fetchReportData = async (payload) => {
  try {
    const response = await fetch('https://api.example.com/reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY', // If needed
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching report:', error);
    throw error;
  }
};
*/

export const useReportData = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async (reportId) => {
    if (!reportId) {
      setReportData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Using the service layer instead of direct API calls
      const data = await reportService.fetchReport(reportId);
      setReportData(data);
    } catch (err) {
      setError(err.message);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    reports: reportService.getAvailableReports(),
    selectedReport,
    setSelectedReport,
    reportData,
    loading,
    error,
    fetchReport,
    clearError,
  };
};

/* 
===========================================
REAL API INTEGRATION IN HOOKS
===========================================

// Example hook for real API with additional features
export const useAdvancedReportData = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0); // For async report generation
  const [metadata, setMetadata] = useState(null);

  const fetchReport = useCallback(async (reportId, options = {}) => {
    if (!reportId) {
      setReportData(null);
      setError(null);
      setProgress(0);
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    
    try {
      // For real API with filters and options
      const data = await reportService.fetchReport(reportId, {
        filters: options.filters,
        dateRange: options.dateRange,
        format: options.format || 'json'
      });
      
      setReportData(data.rows || data);
      setMetadata(data.metadata);
      setProgress(100);
    } catch (err) {
      setError(err.message);
      setReportData(null);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // For async report generation
  const generateAsyncReport = useCallback(async (reportId, config) => {
    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Start report generation
      const job = await reportService.generateReport(reportId, config);
      
      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const status = await reportService.getReportStatus(job.jobId);
          
          setProgress(status.progress || 0);
          
          if (status.status === 'completed') {
            clearInterval(pollInterval);
            const reportData = await reportService.downloadReport(job.jobId);
            setReportData(reportData);
            setLoading(false);
            setProgress(100);
          } else if (status.status === 'failed') {
            clearInterval(pollInterval);
            throw new Error(status.error || 'Report generation failed');
          }
        } catch (error) {
          clearInterval(pollInterval);
          throw error;
        }
      }, 2000);

      // Cleanup on unmount
      return () => clearInterval(pollInterval);
    } catch (err) {
      setError(err.message);
      setReportData(null);
      setProgress(0);
      setLoading(false);
    }
  }, []);

  return {
    reports: reportService.getAvailableReports(),
    selectedReport,
    setSelectedReport,
    reportData,
    metadata,
    loading,
    error,
    progress,
    fetchReport,
    generateAsyncReport,
    clearError: () => setError(null),
  };
};

// Hook with caching for better performance
export const useCachedReportData = () => {
  const [cache, setCache] = useState(new Map());
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCacheKey = (reportId, options = {}) => {
    return `${reportId}_${JSON.stringify(options)}`;
  };

  const fetchReport = useCallback(async (reportId, options = {}) => {
    if (!reportId) {
      setReportData(null);
      setError(null);
      return;
    }

    const cacheKey = getCacheKey(reportId, options);
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      
      // Check if cache is still valid (e.g., less than 5 minutes old)
      if (Date.now() - cachedData.timestamp < 5 * 60 * 1000) {
        setReportData(cachedData.data);
        return;
      }
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await reportService.fetchReport(reportId, options);
      
      // Cache the result
      setCache(prev => new Map(prev).set(cacheKey, {
        data,
        timestamp: Date.now()
      }));
      
      setReportData(data);
    } catch (err) {
      setError(err.message);
      setReportData(null);
    } finally {
      setLoading(false);
    }
  }, [cache]);

  const clearCache = useCallback(() => {
    setCache(new Map());
  }, []);

  return {
    reports: reportService.getAvailableReports(),
    selectedReport,
    setSelectedReport,
    reportData,
    loading,
    error,
    fetchReport,
    clearCache,
    clearError: () => setError(null),
  };
};

// Hook with real-time updates (WebSocket)
export const useRealtimeReportData = () => {
  const [selectedReport, setSelectedReport] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const connectWebSocket = useCallback((reportId) => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/reports/${reportId}`);
    
    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setReportData(data);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };
    
    ws.onclose = () => {
      setIsConnected(false);
    };
    
    ws.onerror = (error) => {
      setError('WebSocket connection failed');
      setIsConnected(false);
    };
    
    return ws;
  }, []);

  return {
    reports: reportService.getAvailableReports(),
    selectedReport,
    setSelectedReport,
    reportData,
    loading,
    error,
    isConnected,
    connectWebSocket,
    clearError: () => setError(null),
  };
};
*/ 