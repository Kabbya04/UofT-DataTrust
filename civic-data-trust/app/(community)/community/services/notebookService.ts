import { API_ENDPOINTS } from '../utils/constants';
import type {
  NotebookStartResponse,
  NotebookStatus,
  FileCheckResponse,
  CleanupResponse
} from '../types/notebook';

export class NotebookService {
  /**
   * Start the Jupyter notebook server
   */
  static async start(): Promise<NotebookStartResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.NOTEBOOK.START, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to start notebook:', error);
      throw new Error('Failed to start notebook server');
    }
  }

  /**
   * Stop the Jupyter notebook server
   */
  static async stop(): Promise<{ status: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.NOTEBOOK.STOP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to stop notebook:', error);
      throw new Error('Failed to stop notebook server');
    }
  }

  /**
   * Get the current status of the notebook server
   */
  static async getStatus(): Promise<NotebookStatus> {
    try {
      const response = await fetch(API_ENDPOINTS.NOTEBOOK.STATUS);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get notebook status:', error);
      throw new Error('Failed to get notebook status');
    }
  }

  /**
   * Check for existing files in the notebook directory
   */
  static async checkExistingFiles(): Promise<FileCheckResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.NOTEBOOK.CHECK_FILES);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to check existing files:', error);
      // Return safe default instead of throwing
      return { has_files: false, file_count: 0 };
    }
  }

  /**
   * Cleanup existing files in the notebook directory
   */
  static async cleanupFiles(): Promise<CleanupResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.NOTEBOOK.CLEANUP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to cleanup files:', error);
      throw new Error('Failed to cleanup notebook files');
    }
  }
}