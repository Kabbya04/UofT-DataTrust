export interface NotebookStatus {
  status: 'running' | 'stopped' | 'starting' | 'error';
  url?: string;
  message?: string;
}

export interface FileCheckResponse {
  has_files: boolean;
  file_count: number;
}

export interface CleanupResponse {
  status: string;
  files_removed: number;
}

export interface NotebookStartResponse {
  status: 'started' | 'already_running' | 'error';
  url: string;
  message?: string;
}

export interface NotebookState {
  isActive: boolean;
  url: string;
  loading: boolean;
  showCleanupModal: boolean;
}