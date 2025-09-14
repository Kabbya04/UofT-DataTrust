import React from 'react';
import { FileJson } from 'lucide-react';
import { useDataSources } from '../../hooks';

interface JsonDataCardProps {
  isDarkMode: boolean;
}

export default function JsonDataCard({ isDarkMode }: JsonDataCardProps) {
  const dataSources = useDataSources();
  const isSelected = dataSources.selectedDataSources.includes('json');

  return (
    <div
      className={`relative bg-white border-2 rounded-xl p-5 cursor-pointer
              transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 hover:border-green-300 shadow-sm'
      }`}
      onClick={dataSources.handleJsonAdd}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-green-100 rounded-xl">
          <FileJson className="w-6 h-6 text-green-600" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base text-gray-900">JSON Data</div>
          <div className="text-sm text-gray-600 mt-1">Custom JSON input</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">JSON</span>
            <span className="text-xs text-gray-500 font-medium">Variable</span>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
      )}
    </div>
  );
}