import { useState, useCallback } from 'react';
import { NotebookService } from '../services/notebookService';

export const useFileManagement = () => {
  const [showCleanupModal, setShowCleanupModal] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ has_files: boolean; file_count: number }>({ has_files: false, file_count: 0 });

  const checkFiles = useCallback(async () => {
    try {
      const result = await NotebookService.checkExistingFiles();
      setFileInfo(result);
      return result;
    } catch (error) {
      console.error('Failed to check files:', error);
      return { has_files: false, file_count: 0 };
    }
  }, []);

  const cleanupFiles = useCallback(async () => {
    try {
      const result = await NotebookService.cleanupFiles();
      // Refresh file info after cleanup
      await checkFiles();
      return result;
    } catch (error) {
      console.error('Failed to cleanup files:', error);
      throw error;
    }
  }, [checkFiles]);

  const showCleanupDialog = useCallback(async () => {
    const info = await checkFiles();
    if (info.has_files) {
      setShowCleanupModal(true);
      return true; // Files found, modal shown
    }
    return false; // No files, no modal needed
  }, [checkFiles]);

  const hideCleanupDialog = useCallback(() => {
    setShowCleanupModal(false);
  }, []);

  const handleCleanupAndProceed = useCallback(async (onSuccess?: () => void | Promise<void>) => {
    try {
      await cleanupFiles();
      setShowCleanupModal(false);
      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
      throw new Error('Failed to cleanup files. Please try again.');
    }
  }, [cleanupFiles]);

  const handleKeepFilesAndProceed = useCallback(async (onSuccess?: () => void | Promise<void>) => {
    setShowCleanupModal(false);
    if (onSuccess) {
      await onSuccess();
    }
  }, []);

  return {
    // State
    showCleanupModal,
    fileInfo,

    // Actions
    checkFiles,
    cleanupFiles,
    showCleanupDialog,
    hideCleanupDialog,
    handleCleanupAndProceed,
    handleKeepFilesAndProceed,
    setShowCleanupModal
  };
};