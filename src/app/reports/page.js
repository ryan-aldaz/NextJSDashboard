'use client';

import { useCallback } from 'react';

// Components
import PageLayout from '../../components/layout/PageLayout';
import ReportSelector from '../../components/reports/ReportSelector';
import DataTable from '../../components/reports/DataTable';
import ExportButton from '../../components/reports/ExportButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

// Hooks
import { useReportData } from '../../hooks/useReportData';
import { useTableControls } from '../../hooks/useTableControls';

export default function ReportsPage() {
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

  const handleReportChange = useCallback(async (e) => {
    const reportId = e.target.value;
    
    // Immediately hide old report and reset controls
    setSelectedReport(reportId);
    resetControls();
    
    // Fetch new report data
    await fetchReport(reportId);
  }, [fetchReport, resetControls, setSelectedReport]);

  const columns = reportData && reportData.length > 0 ? Object.keys(reportData[0]) : [];
  const selectedReportName = reports.find(r => r.id === selectedReport)?.name || 'report';

  return (
    <PageLayout title="Reports Dashboard">
      {/* Report Selection */}
      <ReportSelector
        reports={reports}
        selectedReport={selectedReport}
        onReportChange={handleReportChange}
        loading={loading}
      />

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <LoadingSpinner text="Loading report data..." />
        </div>
      )}

      {/* Error State */}
      <ErrorMessage 
        message={error} 
        onDismiss={clearError}
        className="mb-6"
      />

      {/* Report Data */}
      {reportData && !loading && (
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Table Controls Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedReportName}
              </h2>
              <ExportButton
                data={processedData}
                filename={selectedReportName.toLowerCase().replace(/\s+/g, '_')}
              />
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            data={processedData}
            columns={columns}
            sortConfig={sortConfig}
            onSort={handleSort}
          />
        </div>
      )}
    </PageLayout>
  );
} 