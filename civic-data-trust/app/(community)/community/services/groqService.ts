import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export interface GroqAnalysisRequest {
  data: Record<string, any>;
  analysis_type?: 'eda' | 'processing' | 'explanation';
  query?: string;
  model?: string;
}

export interface GroqAnalysisResponse {
  analysis: string;
  model_used: string;
  status: string;
  execution_time_ms?: number;
}

export interface GroqWorkflowNodeRequest {
  node_type: string;
  input_data: Record<string, any>;
  node_config: Record<string, any>;
}

export interface GroqWorkflowNodeResponse {
  result?: any;
  analysis?: string;
  error?: string;
  status: string;
  node_type?: string;
}

export class GroqService {
  /**
   * Check if Groq service is healthy
   */
  static async checkHealth(): Promise<{ status: string; api_key_configured: boolean; default_model: string }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/llm/health`);
      return response.data;
    } catch (error) {
      console.error('Failed to check Groq service health:', error);
      throw new Error('Groq service is not available');
    }
  }

  /**
   * Analyze data using Groq LLM
   */
  static async analyzeData(request: GroqAnalysisRequest): Promise<GroqAnalysisResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/llm/analyze`, request);
      return response.data;
    } catch (error) {
      console.error('Failed to analyze data with Groq:', error);
      throw new Error('Failed to analyze data with Groq LLM');
    }
  }

  /**
   * Stream LLM analysis (for real-time results)
   */
  static async streamAnalysis(
    request: GroqAnalysisRequest,
    onChunk: (chunk: string) => void,
    onComplete: () => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/llm/analyze/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Failed to get response stream reader');
      }

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              if (data.content) {
                onChunk(data.content);
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', parseError);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      console.error('Failed to stream analysis:', error);
      onError(error instanceof Error ? error : new Error('Unknown streaming error'));
    }
  }

  /**
   * Process workflow node using Groq LLM
   */
  static async processWorkflowNode(request: GroqWorkflowNodeRequest): Promise<GroqWorkflowNodeResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/llm/workflow/node`, request);
      return response.data;
    } catch (error) {
      console.error('Failed to process workflow node:', error);
      throw new Error('Failed to process workflow node with Groq LLM');
    }
  }

  /**
   * Helper function to format CSV data for LLM analysis
   */
  static formatCSVDataForAnalysis(csvData: any[], columns: string[]): Record<string, any[]> {
    const formattedData: Record<string, any[]> = {};

    columns.forEach(column => {
      formattedData[column] = csvData.map(row => row[column]);
    });

    return formattedData;
  }

  /**
   * Helper function to extract CSV data from node input
   */
  static extractCSVDataFromNode(node: any): { data: Record<string, any[]>, columns: string[] } {
    // Check if node has CSV data
    if (node.data?.csv_data) {
      const csvData = node.data.csv_data;
      const columns = Object.keys(csvData);
      return { data: csvData, columns };
    }

    // Check connected input nodes for CSV data
    // This would need to be implemented based on your workflow state structure
    return { data: {}, columns: [] };
  }

  /**
   * Process Llama node with CSV input
   */
  static async processLlamaNode(
    nodeId: string,
    nodeConfig: any,
    inputData: Record<string, any>,
    analysisType: string = 'eda',
    customQuery?: string
  ): Promise<{
    analysis: string;
    status: 'success' | 'error';
    error?: string;
  }> {
    try {
      // Format the request for the workflow node processor
      const request: GroqWorkflowNodeRequest = {
        node_type: 'llama',
        input_data: inputData,
        node_config: {
          analysis_type: analysisType,
          query: customQuery || nodeConfig.query || 'Please analyze this dataset and provide insights.',
          ...nodeConfig
        }
      };

      const response = await this.processWorkflowNode(request);

      if (response.status === 'completed' && response.analysis) {
        return {
          analysis: response.analysis,
          status: 'success'
        };
      } else {
        return {
          analysis: '',
          status: 'error',
          error: response.error || 'Unknown error occurred'
        };
      }
    } catch (error) {
      console.error('Failed to process Llama node:', error);
      return {
        analysis: '',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}