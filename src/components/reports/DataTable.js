import { Component } from 'react';
import { TABLE_CONFIG } from '../../constants';

class DataTable extends Component {
  state = {
    sortKey: null,
    sortDirection: TABLE_CONFIG.SORT_DIRECTIONS.ASC
  };

  handleSort = (columnKey) => {
    this.setState(prevState => {
      const newDirection = 
        prevState.sortKey === columnKey && prevState.sortDirection === TABLE_CONFIG.SORT_DIRECTIONS.ASC
          ? TABLE_CONFIG.SORT_DIRECTIONS.DESC 
          : TABLE_CONFIG.SORT_DIRECTIONS.ASC;

      return {
        sortKey: columnKey,
        sortDirection: newDirection
      };
    });
  };

  getSortedData = () => {
    const { data } = this.props;
    const { sortKey, sortDirection } = this.state;
    
    if (!data || !sortKey) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal < bVal) return sortDirection === TABLE_CONFIG.SORT_DIRECTIONS.ASC ? -1 : 1;
      if (aVal > bVal) return sortDirection === TABLE_CONFIG.SORT_DIRECTIONS.ASC ? 1 : -1;
      return 0;
    });
  };

  getSortIcon = (columnKey) => {
    const { sortKey, sortDirection } = this.state;
    if (sortKey !== columnKey) return null;

    return (
      <span className="text-blue-600 ml-1">
        {sortDirection === TABLE_CONFIG.SORT_DIRECTIONS.ASC ? '↑' : '↓'}
      </span>
    );
  };

  render() {
    const { data = [], columns = [], className = '' } = this.props;
    const sortedData = this.getSortedData();

    if (data.length === 0 || columns.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No data available
        </div>
      );
    }

    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column}
                  onClick={() => this.handleSort(column)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider transition-colors cursor-pointer hover:bg-gray-100`}
                >
                  <div className="flex items-center">
                    {column}
                    {this.getSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td 
                    key={`${rowIndex}-${column}`} 
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {row[column]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DataTable; 