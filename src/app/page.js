'use client';

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
