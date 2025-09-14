export interface CsvInfo {
  shape: [number, number];
  columns: string[];
  summary: Record<string, any>;
}

export interface CsvUploadResponse {
  success: boolean;
  shape: [number, number];
  columns: string[];
  summary: Record<string, any>;
  message?: string;
}

export interface StoredCsvData {
  content: string;
  filename: string;
  timestamp: string;
  columns: string[];
  shape: [number, number];
}

export interface DataSourceCard {
  type: 'image' | 'json' | 'csv' | 'database';
  title: string;
  description: string;
  icon: string;
  color: string;
  isSelected: boolean;
  isAvailable: boolean;
}

export type DataSourceType = 'image' | 'json' | 'csv' | 'database';