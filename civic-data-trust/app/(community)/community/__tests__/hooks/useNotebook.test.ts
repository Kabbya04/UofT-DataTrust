import { renderHook, act } from '@testing-library/react';
import { useNotebook } from '../../hooks/useNotebook';
import { mockApiResponses } from '../utils/test-utils';

// Mock the NotebookService
jest.mock('../../services/notebookService', () => ({
  NotebookService: {
    start: jest.fn(),
    stop: jest.fn(),
    checkExistingFiles: jest.fn(),
    cleanupFiles: jest.fn(),
  },
}));

const mockNotebookService = require('../../services/notebookService').NotebookService;

describe('useNotebook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNotebookService.start.mockResolvedValue(mockApiResponses.notebook.start);
    mockNotebookService.checkExistingFiles.mockResolvedValue(mockApiResponses.notebook.checkFiles);
    mockNotebookService.cleanupFiles.mockResolvedValue(mockApiResponses.notebook.cleanup);
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useNotebook());

    expect(result.current.isActive).toBe(false);
    expect(result.current.url).toBe('');
    expect(result.current.loading).toBe(false);
    expect(result.current.showCleanupModal).toBe(false);
  });

  it('starts notebook successfully when no files exist', async () => {
    const { result } = renderHook(() => useNotebook());

    await act(async () => {
      await result.current.toggleNotebook();
    });

    expect(mockNotebookService.checkExistingFiles).toHaveBeenCalled();
    expect(mockNotebookService.start).toHaveBeenCalled();
    expect(result.current.isActive).toBe(true);
    expect(result.current.url).toBe(mockApiResponses.notebook.start.url);
  });

  it('shows cleanup modal when files exist', async () => {
    mockNotebookService.checkExistingFiles.mockResolvedValue({
      has_files: true,
      file_count: 3,
    });

    const { result } = renderHook(() => useNotebook());

    await act(async () => {
      await result.current.toggleNotebook();
    });

    expect(result.current.showCleanupModal).toBe(true);
    expect(mockNotebookService.start).not.toHaveBeenCalled();
  });

  it('handles cleanup and start workflow', async () => {
    const { result } = renderHook(() => useNotebook());

    // Set the cleanup modal to be open
    act(() => {
      result.current.setLoading(false);
    });

    await act(async () => {
      await result.current.handleCleanupAndStart();
    });

    expect(mockNotebookService.cleanupFiles).toHaveBeenCalled();
    expect(mockNotebookService.start).toHaveBeenCalled();
    expect(result.current.showCleanupModal).toBe(false);
    expect(result.current.isActive).toBe(true);
  });

  it('handles keep files and start workflow', async () => {
    const { result } = renderHook(() => useNotebook());

    await act(async () => {
      await result.current.handleKeepFilesAndStart();
    });

    expect(mockNotebookService.cleanupFiles).not.toHaveBeenCalled();
    expect(mockNotebookService.start).toHaveBeenCalled();
    expect(result.current.showCleanupModal).toBe(false);
    expect(result.current.isActive).toBe(true);
  });

  it('handles cancel cleanup', () => {
    const { result } = renderHook(() => useNotebook());

    act(() => {
      result.current.handleCancelCleanup();
    });

    expect(result.current.showCleanupModal).toBe(false);
  });

  it('stops notebook when toggling from active state', async () => {
    const { result } = renderHook(() => useNotebook());

    // First start the notebook
    await act(async () => {
      await result.current.startNotebook();
    });

    expect(result.current.isActive).toBe(true);

    // Now stop it
    await act(async () => {
      await result.current.toggleNotebook();
    });

    expect(mockNotebookService.stop).toHaveBeenCalled();
    expect(result.current.isActive).toBe(false);
    expect(result.current.url).toBe('');
  });

  it('handles API errors gracefully', async () => {
    mockNotebookService.start.mockRejectedValue(new Error('API Error'));

    const { result } = renderHook(() => useNotebook());

    const success = await act(async () => {
      return await result.current.startNotebook();
    });

    expect(success).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.isActive).toBe(false);
  });

  it('handles file check errors by proceeding with startup', async () => {
    mockNotebookService.checkExistingFiles.mockRejectedValue(new Error('File check failed'));

    const { result } = renderHook(() => useNotebook());

    await act(async () => {
      await result.current.toggleNotebook();
    });

    // Should still attempt to start notebook despite file check error
    expect(mockNotebookService.start).toHaveBeenCalled();
  });

  it('manages loading states correctly', async () => {
    const { result } = renderHook(() => useNotebook());

    const startPromise = act(async () => {
      result.current.toggleNotebook();
    });

    // Check loading state is true during operation
    expect(result.current.loading).toBe(true);

    await startPromise;

    // Check loading state is false after completion
    expect(result.current.loading).toBe(false);
  });
});