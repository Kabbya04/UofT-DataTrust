import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { addNode } from '../../../store/workflowSlice';
import { FileService } from '../services/fileService';
import { NODE_COLORS, DEFAULT_NODE_DIMENSIONS } from '../utils/constants';
import type { DataSourceType } from '../types/dataSources';
import type { WorkflowNode } from '../types/workflow';

export const useDataSources = () => {
  const dispatch = useDispatch();
  const [selectedDataSources, setSelectedDataSources] = useState<DataSourceType[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const addDataSource = useCallback((type: DataSourceType) => {
    if (!selectedDataSources.includes(type)) {
      setSelectedDataSources(prev => [...prev, type]);
    }
  }, [selectedDataSources]);

  const removeDataSource = useCallback((type: DataSourceType) => {
    setSelectedDataSources(prev => prev.filter(source => source !== type));
  }, []);

  const handleImageSelect = useCallback(() => {
    const imagePath = '/images/download.jpg';
    setSelectedImage(imagePath);
    addDataSource('image');

    // Create image input node
    const imageNode: WorkflowNode = {
      id: `image-${Date.now()}`,
      type: 'image_input',
      name: 'Image Input',
      x: 100,
      y: 100,
      width: DEFAULT_NODE_DIMENSIONS.width,
      height: DEFAULT_NODE_DIMENSIONS.height,
      color: NODE_COLORS.IMAGE,
      inputs: [],
      outputs: [{
        id: 'main',
        type: 'main',
        label: 'Image Data',
        connected: false
      }],
      data: { imagePath },
      parameters: {}
    };

    dispatch(addNode(imageNode));
  }, [dispatch, addDataSource]);

  const handleJsonAdd = useCallback(() => {
    addDataSource('json');

    const jsonNode: WorkflowNode = {
      id: `json-${Date.now()}`,
      type: 'text_input',
      name: 'JSON Data',
      x: 100,
      y: 200,
      width: DEFAULT_NODE_DIMENSIONS.width,
      height: DEFAULT_NODE_DIMENSIONS.height,
      color: NODE_COLORS.JSON,
      inputs: [],
      outputs: [{
        id: 'main',
        type: 'main',
        label: 'JSON Output',
        connected: false
      }],
      parameters: {
        jsonData: '{}'
      },
      data: {}
    };

    dispatch(addNode(jsonNode));
  }, [dispatch, addDataSource]);

  const handleCsvUpload = useCallback(async () => {
    try {
      const file = await FileService.openFilePicker('.csv');
      if (!file) return;

      const csvContent = await FileService.readFileAsText(file);
      const csvInfo = await FileService.uploadCsv(csvContent, file.name);

      // Store CSV data for matplotlib functions to access
      FileService.storeCsvData({
        content: csvContent,
        filename: file.name,
        timestamp: new Date().toISOString(),
        columns: csvInfo.columns,
        shape: csvInfo.shape
      });

      // Create CSV data node
      const csvNode: WorkflowNode = {
        id: `csv-${Date.now()}`,
        type: 'csv_input',
        name: `CSV: ${file.name}`,
        x: 100,
        y: 150,
        width: 180,
        height: 100,
        color: NODE_COLORS.CSV,
        inputs: [],
        outputs: [{
          id: 'main',
          type: 'main',
          label: 'CSV Data',
          connected: false
        }],
        parameters: {
          fileName: file.name,
          csvContent: csvContent,
          fileSize: file.size,
          shape: csvInfo.shape,
          columns: csvInfo.columns,
          summary: csvInfo.summary
        },
        data: {
          csvData: csvContent,
          processedInfo: csvInfo
        }
      };

      dispatch(addNode(csvNode));
      addDataSource('csv');

      console.log('CSV data stored for matplotlib access');
      return csvNode;

    } catch (error) {
      console.error('Error processing CSV:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Error processing CSV file: ${errorMessage}`);
      return null;
    }
  }, [dispatch, addDataSource]);

  const clearDataSources = useCallback(() => {
    setSelectedDataSources([]);
    setSelectedImage(null);
    FileService.clearStoredCsvData();
  }, []);

  const getDataSourceStats = useCallback(() => {
    return {
      totalSources: selectedDataSources.length,
      hasImage: selectedDataSources.includes('image'),
      hasJson: selectedDataSources.includes('json'),
      hasCsv: selectedDataSources.includes('csv'),
      hasDatabase: selectedDataSources.includes('database'),
      selectedImage
    };
  }, [selectedDataSources, selectedImage]);

  return {
    // State
    selectedDataSources,
    selectedImage,

    // Actions
    addDataSource,
    removeDataSource,
    handleImageSelect,
    handleJsonAdd,
    handleCsvUpload,
    clearDataSources,
    getDataSourceStats
  };
};