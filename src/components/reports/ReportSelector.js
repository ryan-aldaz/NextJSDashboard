const ReportSelector = ({ 
  reports = [], 
  selectedReport, 
  onReportChange, 
  loading = false,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <label 
        htmlFor="report-select" 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Select Report
      </label>
      <select
        id="report-select"
        value={selectedReport}
        onChange={onReportChange}
        disabled={loading}
        className="w-full max-w-md p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Choose a report...</option>
        {reports.map((report) => (
          <option key={report.id} value={report.id}>
            {report.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReportSelector; 