import React from 'react';
import { Image } from 'lucide-react';
import { useDataSources } from '../../hooks';

interface ImageDataCardProps {
  isDarkMode: boolean;
}

export default function ImageDataCard({ isDarkMode }: ImageDataCardProps) {
  const dataSources = useDataSources();
  const isSelected = dataSources.selectedDataSources.includes('image');

  return (
    <div
      className={`relative border-2 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-md'
          : (isDarkMode
              ? 'bg-gray-700 border-gray-600 hover:border-blue-400 shadow-sm'
              : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm')
      }`}
      onClick={dataSources.handleImageSelect}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-xl">
          <Image className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className={`font-semibold text-base transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Image Data</div>
          <div className={`text-sm mt-1 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>download.jpg</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">JPG</span>
            <span className="text-xs text-gray-500 font-medium">1.2 MB</span>
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full"></div>
      )}
    </div>
  );
}