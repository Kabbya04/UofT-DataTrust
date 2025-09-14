import React from 'react';

interface NotebookViewProps {
  loading: boolean;
  url: string;
}

export default function NotebookView({ loading, url }: NotebookViewProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Starting Jupyter Notebook...</p>
        </div>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Failed to load notebook</p>
      </div>
    );
  }

  return (
    <iframe
      src={url}
      className="w-full h-full border-0"
      title="Jupyter Notebook"
      sandbox="allow-same-origin allow-scripts allow-forms allow-downloads"
    />
  );
}