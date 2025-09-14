import { API_ENDPOINTS, LOCAL_STORAGE_KEYS } from '../utils/constants';
import type { CsvUploadResponse, StoredCsvData } from '../types/dataSources';

export class FileService {
  /**
   * Upload and process CSV file content
   */
  static async uploadCsv(csvContent: string, filename: string): Promise<CsvUploadResponse> {
    try {
      const response = await fetch(API_ENDPOINTS.DATA.UPLOAD_CSV, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          csv_content: csvContent,
          filename: filename
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to process CSV: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      throw new Error(error instanceof Error ? error.message : 'Unknown error processing CSV');
    }
  }

  /**
   * Store CSV data in localStorage for access by other components
   */
  static storeCsvData(data: StoredCsvData): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_UPLOADED_CSV, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to store CSV data in localStorage:', error);
    }
  }

  /**
   * Retrieve stored CSV data from localStorage
   */
  static getStoredCsvData(): StoredCsvData | null {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_UPLOADED_CSV);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to retrieve CSV data from localStorage:', error);
      return null;
    }
  }

  /**
   * Clear stored CSV data
   */
  static clearStoredCsvData(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LAST_UPLOADED_CSV);
    } catch (error) {
      console.error('Failed to clear CSV data from localStorage:', error);
    }
  }

  /**
   * Read file as text content
   */
  static readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Create and trigger file download
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'application/json'): void {
    try {
      const dataUri = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', filename);
      linkElement.click();
    } catch (error) {
      console.error('Failed to download file:', error);
      throw new Error('Failed to download file');
    }
  }

  /**
   * Open file picker dialog
   */
  static openFilePicker(accept: string = '*'): Promise<File | null> {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = accept;

      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        resolve(file || null);
      };

      input.click();
    });
  }
}