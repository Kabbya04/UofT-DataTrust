import { useState, useCallback } from 'react';
import { NotebookService } from '../services/notebookService';
import type { NotebookState } from '../types/notebook';

export const useNotebook = () => {
  const [state, setState] = useState<NotebookState>({
    isActive: false,
    url: '',
    loading: false,
    showCleanupModal: false
  });

  const checkExistingFiles = useCallback(async () => {
    return await NotebookService.checkExistingFiles();
  }, []);

  const cleanupFiles = useCallback(async () => {
    try {
      return await NotebookService.cleanupFiles();
    } catch (error) {
      console.error('Failed to cleanup notebook files:', error);
      throw error;
    }
  }, []);

  const startNotebook = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const response = await NotebookService.start();

      if (response.status === 'started' || response.status === 'already_running') {
        setState(prev => ({
          ...prev,
          isActive: true,
          url: response.url,
          loading: false
        }));
        return true;
      } else {
        setState(prev => ({ ...prev, loading: false }));
        return false;
      }
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      console.error('Failed to start notebook:', error);
      return false;
    }
  }, []);

  const stopNotebook = useCallback(async () => {
    try {
      await NotebookService.stop();
      setState(prev => ({
        ...prev,
        isActive: false,
        url: '',
        loading: false
      }));
      return true;
    } catch (error) {
      console.error('Failed to stop notebook:', error);
      return false;
    }
  }, []);

  const toggleNotebook = useCallback(async () => {
    if (!state.isActive) {
      // Check for existing files before starting
      setState(prev => ({ ...prev, loading: true }));

      try {
        const fileCheck = await checkExistingFiles();
        setState(prev => ({ ...prev, loading: false }));

        if (fileCheck.has_files) {
          // Show cleanup modal
          setState(prev => ({ ...prev, showCleanupModal: true }));
        } else {
          // No existing files, start notebook directly
          await startNotebook();
        }
      } catch (error) {
        setState(prev => ({ ...prev, loading: false }));
        console.error('Error checking files:', error);
        // If file check fails, still try to start notebook
        await startNotebook();
      }
    } else {
      // Stop notebook
      await stopNotebook();
    }
  }, [state.isActive, checkExistingFiles, startNotebook, stopNotebook]);

  const handleCleanupAndStart = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, showCleanupModal: false }));
      await cleanupFiles();
      await startNotebook();
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  }, [cleanupFiles, startNotebook]);

  const handleKeepFilesAndStart = useCallback(async () => {
    setState(prev => ({ ...prev, showCleanupModal: false }));
    await startNotebook();
  }, [startNotebook]);

  const handleCancelCleanup = useCallback(() => {
    setState(prev => ({ ...prev, showCleanupModal: false }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  return {
    // State
    ...state,

    // Actions
    toggleNotebook,
    startNotebook,
    stopNotebook,
    checkExistingFiles,
    cleanupFiles,
    handleCleanupAndStart,
    handleKeepFilesAndStart,
    handleCancelCleanup,
    setLoading
  };
};