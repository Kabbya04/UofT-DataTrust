export const API_BASE_URL = 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  NOTEBOOK: {
    START: `${API_BASE_URL}/notebook/start`,
    STOP: `${API_BASE_URL}/notebook/stop`,
    STATUS: `${API_BASE_URL}/notebook/status`,
    CHECK_FILES: `${API_BASE_URL}/notebook/check-files`,
    CLEANUP: `${API_BASE_URL}/notebook/cleanup`,
  },
  DATA: {
    UPLOAD_CSV: `${API_BASE_URL}/data/upload-csv`,
  },
  EDA: {
    EXECUTE: `${API_BASE_URL}/eda-execute/`,
    DOWNLOAD: `${API_BASE_URL}/eda-download/`,
  }
} as const;

export const DEFAULT_NODE_DIMENSIONS = {
  width: 140,
  height: 80,
} as const;

export const NODE_COLORS = {
  IMAGE: '#3B82F6',
  JSON: '#10B981',
  CSV: '#8B5CF6',
  DATABASE: '#F59E0B',
} as const;

export const FILE_EXTENSIONS = {
  WORKFLOW: '.json',
  CSV: '.csv',
} as const;

export const LOCAL_STORAGE_KEYS = {
  LAST_UPLOADED_CSV: 'lastUploadedCSV',
} as const;