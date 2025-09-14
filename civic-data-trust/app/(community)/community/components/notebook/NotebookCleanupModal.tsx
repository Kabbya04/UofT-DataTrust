import React from 'react';

interface NotebookCleanupModalProps {
  isOpen: boolean;
  onCleanupAndStart: () => Promise<void>;
  onKeepFilesAndStart: () => void;
  onCancel: () => void;
}

export default function NotebookCleanupModal({
  isOpen,
  onCleanupAndStart,
  onKeepFilesAndStart,
  onCancel
}: NotebookCleanupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Existing Files Found</h3>
        </div>
        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            There are existing data files in the notebook directory from previous EDA sessions.
            Would you like to remove them before opening the notebook to start fresh?
          </p>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  await onCleanupAndStart();
                } catch (error) {
                  alert('Failed to cleanup files. Please try again.');
                  console.error('Cleanup error:', error);
                }
              }}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete & Open Notebook
            </button>
            <button
              onClick={onKeepFilesAndStart}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Keep Files & Continue
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}