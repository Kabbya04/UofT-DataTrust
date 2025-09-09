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
    if (!downloadUrl && !executionId) {
      toast.error('No download URL or execution ID provided');
      return;
    }

    setDownloadStatus({
      status: 'preparing',
      progress: 0,
      message: 'Preparing download...'
    });

    try {
      let finalDownloadUrl = downloadUrl;
      
      // If no direct download URL, try to get it from the execution ID
      if (!finalDownloadUrl && executionId) {
        setDownloadStatus({
          status: 'preparing',
          progress: 25,
          message: 'Generating download package...'
        });

        const packageResponse = await axios.post('http://localhost:8000/api/v1/eda-execute/generate-package', {
          execution_id: executionId,
          node_id: nodeId,
          include_visualizations: true,
          include_processed_data: true,
          include_metadata: true,
          format: 'zip'
        });

        if (packageResponse.data && packageResponse.data.download_url) {
          finalDownloadUrl = packageResponse.data.download_url;
        } else {
          throw new Error('Failed to generate download package');
        }
      }

      if (!finalDownloadUrl) {
        throw new Error('No download URL available');
      }

      setDownloadStatus({
        status: 'downloading',
        progress: 50,
        message: 'Downloading file...'
      });

      // Download the file
      const response = await axios.get(finalDownloadUrl, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setDownloadStatus({
              status: 'downloading',
              progress: 50 + (progress * 0.5), // 50-100%
              message: `Downloading... ${progress}%`
            });
          }
        }
      });

      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/zip' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadStatus({
        status: 'completed',
        progress: 100,
        message: 'Download completed successfully!',
        filePath: fileName
      });

      toast.success('EDA results downloaded successfully!');
      onDownloadComplete?.(true, fileName);

    } catch (error: any) {
      console.error('Download error:', error);
      
      const errorMessage = error.response?.data?.detail || error.message || 'Download failed';
      
      setDownloadStatus({
        status: 'error',
        progress: 0,
        message: 'Download failed',
        error: errorMessage
      });

      toast.error(`Download failed: ${errorMessage}`);
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