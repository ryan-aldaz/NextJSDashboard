import { useState, useMemo, useCallback } from 'react';

export const useTableControls = (data) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = useCallback((key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const resetControls = useCallback(() => {
    setSortConfig({ key: null, direction: 'asc' });
  }, []);

  const processedData = useMemo(() => {
    if (!data) return [];

    let sortedData = [...data];

    // Apply sorting only
    if (sortConfig.key) {
      sortedData.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sortedData;
  }, [data, sortConfig]);

  return {
    sortConfig,
    processedData,
    handleSort,
    resetControls,
  };
}; 