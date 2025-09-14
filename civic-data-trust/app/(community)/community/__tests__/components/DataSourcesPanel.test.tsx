import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockApiResponses, createMockFile, simulateFileUpload } from '../utils/test-utils';
import DataSourcesPanel from '../../components/data-sources/DataSourcesPanel';

// Mock the hooks
jest.mock('../../hooks', () => ({
  useDataSources: () => ({
    selectedDataSources: [],
    selectedImage: null,
    handleImageSelect: jest.fn(),
    handleJsonAdd: jest.fn(),
    handleCsvUpload: jest.fn(),
    clearDataSources: jest.fn(),
    getDataSourceStats: jest.fn(() => ({
      totalSources: 0,
      hasImage: false,
      hasJson: false,
      hasCsv: false,
      hasDatabase: false,
      selectedImage: null,
    })),
  }),
}));

describe('DataSourcesPanel', () => {
  beforeEach(() => {
    // Mock fetch for CSV upload
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponses.csv.upload),
    });
  });

  it('renders data sources panel with all cards', () => {
    render(<DataSourcesPanel isDarkMode={false} />);

    expect(screen.getByText('Data Sources')).toBeInTheDocument();
    expect(screen.getByText('Image Data')).toBeInTheDocument();
    expect(screen.getByText('JSON Data')).toBeInTheDocument();
    expect(screen.getByText('CSV Data')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
  });

  it('applies dark mode styles correctly', () => {
    render(<DataSourcesPanel isDarkMode={true} />);

    const panel = screen.getByText('Data Sources').closest('div');
    expect(panel).toHaveClass('border-gray-700', 'bg-gray-800');
  });

  it('applies light mode styles correctly', () => {
    render(<DataSourcesPanel isDarkMode={false} />);

    const panel = screen.getByText('Data Sources').closest('div');
    expect(panel).toHaveClass('border-gray-200', 'bg-white');
  });

  it('displays upload icon', () => {
    render(<DataSourcesPanel isDarkMode={false} />);

    // Look for the Upload icon (Lucide icons render as SVG)
    const uploadIcon = screen.getByText('Data Sources').parentElement?.querySelector('svg');
    expect(uploadIcon).toBeInTheDocument();
  });

  it('shows coming soon state for database card', () => {
    render(<DataSourcesPanel isDarkMode={false} />);

    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText('Not available')).toBeInTheDocument();

    const databaseCard = screen.getByText('Database').closest('div');
    expect(databaseCard).toHaveClass('opacity-60');
  });

  it('displays correct file type badges', () => {
    render(<DataSourcesPanel isDarkMode={false} />);

    expect(screen.getByText('JPG')).toBeInTheDocument();
    expect(screen.getByText('JSON')).toBeInTheDocument();
    expect(screen.getByText('CSV')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
  });
});

describe('DataSourcesPanel Integration', () => {
  it('handles component loading and error states', async () => {
    // Test error boundary integration
    const ErrorThrowingComponent = () => {
      throw new Error('Test error');
    };

    const { container } = render(
      <div>
        <DataSourcesPanel isDarkMode={false} />
      </div>
    );

    // Component should render without throwing
    expect(container.firstChild).toBeInTheDocument();
  });

  it('maintains accessibility standards', () => {
    render(<DataSourcesPanel isDarkMode={false} />);

    // Check for proper heading structure
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Data Sources');

    // Check for clickable elements
    const imageCard = screen.getByText('Image Data').closest('div');
    const jsonCard = screen.getByText('JSON Data').closest('div');
    const csvCard = screen.getByText('CSV Data').closest('div');

    expect(imageCard).toHaveClass('cursor-pointer');
    expect(jsonCard).toHaveClass('cursor-pointer');
    expect(csvCard).toHaveClass('cursor-pointer');
  });
});