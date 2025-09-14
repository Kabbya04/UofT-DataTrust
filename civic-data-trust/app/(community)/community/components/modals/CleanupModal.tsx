import React from 'react';

interface CleanupModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onCleanup: () => Promise<void> | void;
  onKeep: () => void;
  onCancel: () => void;
  cleanupButtonText?: string;
  keepButtonText?: string;
  cancelButtonText?: string;
}

export default function CleanupModal({
  isOpen,
  title = 'Existing Files Found',
  description = 'There are existing files that may need to be cleaned up. Would you like to remove them?',
  onCleanup,
  onKeep,
  onCancel,
  cleanupButtonText = 'Delete & Continue',
  keepButtonText = 'Keep Files & Continue',
  cancelButtonText = 'Cancel'
}: CleanupModalProps) {
  if (!isOpen) return null;

  const handleCleanup = async () => {
    try {
      await onCleanup();
    } catch (error) {
      alert('Failed to cleanup files. Please try again.');
      console.error('Cleanup error:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          <div className="flex gap-3">
            <button
              onClick={handleCleanup}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              {cleanupButtonText}
            </button>
            <button
              onClick={onKeep}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {keepButtonText}
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              {cancelButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}