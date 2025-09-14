import React from 'react';
import { Upload } from 'lucide-react';
import ImageDataCard from './ImageDataCard';
import JsonDataCard from './JsonDataCard';
import CsvDataCard from './CsvDataCard';
import DatabaseCard from './DatabaseCard';

interface DataSourcesPanelProps {
  isDarkMode: boolean;
}

export default function DataSourcesPanel({ isDarkMode }: DataSourcesPanelProps) {
  return (
    <div className={`border rounded-xl p-6 shadow-sm transition-colors duration-200 ${
      isDarkMode
        ? 'border-gray-700 bg-gray-800'
        : 'border-gray-200 bg-white'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold transition-colors duration-200 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Data Sources</h3>
        <Upload className={`w-5 h-5 transition-colors duration-200 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-400'
        }`} />
      </div>

      {/* Grid layout for data source cards */}
      <div className="grid grid-cols-1 gap-4">
        <ImageDataCard isDarkMode={isDarkMode} />
        <JsonDataCard isDarkMode={isDarkMode} />
        <CsvDataCard isDarkMode={isDarkMode} />
        <DatabaseCard />
      </div>
    </div>
  );
}