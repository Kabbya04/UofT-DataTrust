import { NotebookService } from '../../services/notebookService';
import { mockApiResponses } from '../utils/test-utils';

describe('NotebookService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('start', () => {
    it('starts notebook successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.notebook.start),
      });

      const result = await NotebookService.start();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/notebook/start',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      expect(result).toEqual(mockApiResponses.notebook.start);
    });

    it('throws error on failed API call', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(NotebookService.start()).rejects.toThrow('Failed to start notebook server');
    });

    it('handles network errors', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(NotebookService.start()).rejects.toThrow('Failed to start notebook server');
    });
  });

  describe('stop', () => {
    it('stops notebook successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ status: 'stopped' }),
      });

      const result = await NotebookService.stop();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/notebook/stop',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      expect(result).toEqual({ status: 'stopped' });
    });
  });

  describe('getStatus', () => {
    it('gets notebook status successfully', async () => {
      const statusResponse = { status: 'running', url: 'http://localhost:8888' };
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(statusResponse),
      });

      const result = await NotebookService.getStatus();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/v1/notebook/status');
      expect(result).toEqual(statusResponse);
    });
  });

  describe('checkExistingFiles', () => {
    it('checks files successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.notebook.checkFiles),
      });

      const result = await NotebookService.checkExistingFiles();

      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/v1/notebook/check-files');
      expect(result).toEqual(mockApiResponses.notebook.checkFiles);
    });

    it('returns safe default on error instead of throwing', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await NotebookService.checkExistingFiles();

      expect(result).toEqual({ has_files: false, file_count: 0 });
    });
  });

  describe('cleanupFiles', () => {
    it('cleans up files successfully', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.notebook.cleanup),
      });

      const result = await NotebookService.cleanupFiles();

      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/notebook/cleanup',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      expect(result).toEqual(mockApiResponses.notebook.cleanup);
    });

    it('throws error on failed cleanup', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(NotebookService.cleanupFiles()).rejects.toThrow('Failed to cleanup notebook files');
    });
  });

  describe('API endpoint constants', () => {
    it('uses correct API endpoints', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      await NotebookService.start();
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/notebook/start'),
        expect.any(Object)
      );

      await NotebookService.getStatus();
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/notebook/status')
      );

      await NotebookService.checkExistingFiles();
      expect(fetch).toHaveBeenLastCalledWith(
        expect.stringContaining('/notebook/check-files')
      );
    });
  });
});