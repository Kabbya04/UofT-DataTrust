import React from 'react';
import { Database } from 'lucide-react';

export default function DatabaseCard() {
  return (
    <div
      className="relative bg-white border-2 rounded-xl p-5 cursor-pointer
            transition-all duration-200 hover:shadow-lg border-gray-200
            hover:border-orange-300 opacity-60 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-orange-100 rounded-xl">
          <Database className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-base text-gray-900">Database</div>
          <div className="text-sm text-gray-600 mt-1">Coming soon</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-gray-100 px-3 py-1 rounded-full font-medium">SQL</span>
            <span className="text-xs text-gray-500 font-medium">Not available</span>
          </div>
        </div>
      </div>
    </div>
  );
}