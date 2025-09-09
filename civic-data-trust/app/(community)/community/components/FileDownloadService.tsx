import React, { useState } from 'react';
import { Download, FileArchive, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface FileDownloadServiceProps {
  downloadUrl?: string;
  fileName?: string;
  executionId?: string;
  nodeId?: string;
  onDownloadComplete?: (success: boolean, filePath?: string) => void;
}

interface DownloadStatus {
  status: 'idle' | 'preparing' | 'downloading' | 'completed' | 'error';
  progress: number;
  message: string;
  filePath?: string;
  error?: string;
}

const FileDownloadService: React.FC<FileDownloadServiceProps> = ({
  downloadUrl,
  fileName = 'eda_results.zip',
  executionId,
  nodeId,
  onDownloadComplete
}) => {
  const [downloadStatus, setDownloadStatus] = useState<DownloadStatus>({
    status: 'idle',
    progress: 0,
    message: 'Ready to download'
  });

  const handleDownload = async () => {
    if (!executionId && !downloadUrl) {
      toast.error('No execution ID or download URL provided');
      return;
    }

    setDownloadStatus({
      status: 'preparing',
      progress: 25,
      message: 'Preparing download...'
    });

    try {
      // Use backend endpoint to generate and download ZIP file
      const downloadEndpoint = `http://localhost:8000/api/v1/eda-download/${executionId || 'direct'}`;
      
      setDownloadStatus({
        status: 'downloading',
        progress: 50,
        message: 'Requesting download from server...'
      });

      // Create a simple download link that opens in a new tab
      // This is the most reliable method across all browsers
      const link = document.createElement('a');
      link.href = downloadEndpoint;
      link.target = '_blank';
      link.download = fileName;
      
      // Add query parameters for better server handling
      const params = new URLSearchParams();
      if (nodeId) params.append('node_id', nodeId);
      if (executionId) params.append('execution_id', executionId);
      params.append('filename', fileName);
      params.append('format', 'zip');
      
      link.href = `${downloadEndpoint}?${params.toString()}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadStatus({
        status: 'completed',
        progress: 100,
        message: 'Download link opened! Check your browser downloads.',
        filePath: fileName
      });

      toast.success('Download started! Check your downloads folder or browser downloads.');
      onDownloadComplete?.(true, fileName);

    } catch (error: any) {
      console.error('Download error:', error);
      
      setDownloadStatus({
        status: 'error',
        progress: 0,
        message: 'Download failed',
        error: error.message || 'Unknown error'
      });

      toast.error(`Download failed: ${error.message || 'Unknown error'}`);
      onDownloadComplete?.(false);
    }
  };

  const resetDownload = () => {
    setDownloadStatus({
      status: 'idle',
      progress: 0,
      message: 'Ready to download'
    });
  };

  const getStatusIcon = () => {
    switch (downloadStatus.status) {
      case 'idle':
        return <Download className="w-5 h-5" />;
      case 'preparing':
      case 'downloading':
        return <Loader className="w-5 h-5 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Download className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    switch (downloadStatus.status) {
      case 'idle':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'preparing':
      case 'downloading':
        return 'bg-yellow-600';
      case 'completed':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const isDisabled = downloadStatus.status === 'preparing' || downloadStatus.status === 'downloading';

  return (
    <div className="space-y-4">
      {/* Download Button */}
      <button
        onClick={downloadStatus.status === 'error' ? resetDownload : handleDownload}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-white rounded-lg transition-colors ${
          getStatusColor()
        } ${isDisabled ? 'cursor-not-allowed opacity-75' : ''}`}
      >
        {getStatusIcon()}
        <span>
          {downloadStatus.status === 'idle' && 'Download EDA Results'}
          {downloadStatus.status === 'preparing' && 'Preparing Download...'}
          {downloadStatus.status === 'downloading' && 'Downloading...'}
          {downloadStatus.status === 'completed' && 'Download Complete'}
          {downloadStatus.status === 'error' && 'Retry Download'}
        </span>
      </button>

      {/* Progress Bar */}
      {(downloadStatus.status === 'preparing' || downloadStatus.status === 'downloading') && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadStatus.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">{downloadStatus.message}</p>
        </div>
      )}

      {/* Status Messages */}
      {downloadStatus.status === 'completed' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-800">{downloadStatus.message}</span>
          </div>
          {downloadStatus.filePath && (
            <p className="text-xs text-green-600 mt-1">File: {downloadStatus.filePath}</p>
          )}
        </div>
      )}

      {downloadStatus.status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-800">{downloadStatus.message}</span>
          </div>
          {downloadStatus.error && (
            <p className="text-xs text-red-600">{downloadStatus.error}</p>
          )}
        </div>
      )}

      {/* File Info */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <FileArchive className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Package Contents</span>
        </div>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Processed data files (CSV, JSON)</li>
          <li>• Generated visualizations (PNG, SVG)</li>
          <li>• Execution metadata and logs</li>
          <li>• Google Colab notebook (if enabled)</li>
          <li>• README with instructions</li>
        </ul>
      </div>
    </div>
  );
};

export default FileDownloadService;