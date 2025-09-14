import React from 'react';
import { FileText } from 'lucide-react';
import { useDataSources } from '../../hooks';

interface CsvDataCardProps {
  isDarkMode: boolean;
}

export default function CsvDataCard({ isDarkMode }: CsvDataCardProps) {
  const dataSources = useDataSources();
  const isSelected = dataSources.selectedDataSources.includes('csv');

  return (
    <div
      className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer
              transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? 'border-purple-500 bg-purple-50 shadow-md'
          : 'border-gray-200 hover:border-purple-300 shadow-sm'
      }`}
      onClick={dataSources.handleCsvUpload}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-100 rounded-xl">
          <FileText className="w-6 h-6 text-purple-600" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base text-gray-900">CSV Data</div>
          <div className="text-sm text-gray-600 mt-1">Upload CSV file</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">CSV</span>
            <span className="text-xs text-gray-500 font-medium">Click to upload</span>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full"></div>
      )}
    </div>
  );
}