"""Integration test for split node functionality."""

import pytest
import pandas as pd
import io
from fastapi.testclient import TestClient
from app.main import app


class TestSplitIntegration:
    """Integration tests for split node workflow."""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Set up test client and sample data."""
        self.client = TestClient(app)
        
        # Create sample CSV data with 10 rows
        self.sample_data = {
            'id': list(range(1, 11)),
            'name': [f'Person_{i}' for i in range(1, 11)],
            'age': [20 + i for i in range(10)],
            'salary': [30000 + i * 5000 for i in range(10)],
            'department': ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] * 2
        }
        
        self.df = pd.DataFrame(self.sample_data)
        self.csv_content = self.df.to_csv(index=False)
        
    def test_split_by_rows_integration(self):
        """Test complete workflow: upload CSV, add split node, configure for row splitting, verify outputs."""
        
        # Step 1: Upload CSV file (simulated via direct CSV content)
        csv_data = {
            'csv_content': self.csv_content,
            'filename': 'test_employees.csv'
        }
        
        # Step 2: Add split node and configure it to split by rows at position 5
        split_request = {
            'node_id': 'split_node_001',
            'node_type': 'split',
            'parameters': {
                'splitType': 'rows',
                'rowCount': 5,
                'selectedColumns1': [],
                'selectedColumns2': []
            },
            'input_data': csv_data
        }
        
        # Step 3: Execute split transformation
        response = self.client.post('/api/v1/transform/split', json=split_request)
        
        # Step 4: Verify response structure
        assert response.status_code == 200
        result = response.json()
        
        assert result['success'] is True
        assert 'output_data' in result
        assert 'output_data_2' in result
        assert 'metadata' in result
        
        # Step 5: Verify the outputs contain correct row counts
        output1_df = pd.read_csv(io.StringIO(result['output_data']))
        output2_df = pd.read_csv(io.StringIO(result['output_data_2']))
        
        # Verify row counts
        assert len(output1_df) == 5, f"Output 1 should have 5 rows, got {len(output1_df)}"
        assert len(output2_df) == 5, f"Output 2 should have 5 rows, got {len(output2_df)}"
        
        # Verify column structure is preserved
        assert list(output1_df.columns) == list(self.df.columns)
        assert list(output2_df.columns) == list(self.df.columns)
        
        # Verify data integrity - first 5 rows in output1
        expected_output1 = self.df.iloc[:5]
        pd.testing.assert_frame_equal(output1_df.reset_index(drop=True), expected_output1.reset_index(drop=True))
        
        # Verify data integrity - remaining rows in output2
        expected_output2 = self.df.iloc[5:]
        pd.testing.assert_frame_equal(output2_df.reset_index(drop=True), expected_output2.reset_index(drop=True))
        
        # Step 6: Verify metadata
        metadata = result['metadata']
        assert metadata['split_type'] == 'rows'
        assert metadata['row_count'] == 5
        assert metadata['original_shape'] == [10, 5]
        assert metadata['output1_shape'] == [5, 5]
        assert metadata['output2_shape'] == [5, 5]
        assert metadata['node_id'] == 'split_node_001'
        assert metadata['node_type'] == 'split'
        
    def test_split_by_columns_integration(self):
        """Test complete workflow for column-based splitting."""
        
        # Step 1: Prepare CSV data
        csv_data = {
            'csv_content': self.csv_content,
            'filename': 'test_employees.csv'
        }
        
        # Step 2: Configure split node for column splitting
        split_request = {
            'node_id': 'split_node_002',
            'node_type': 'split',
            'parameters': {
                'splitType': 'columns',
                'rowCount': 10,  # Not used for column splitting
                'selectedColumns1': ['id', 'name', 'age'],
                'selectedColumns2': ['salary', 'department']
            },
            'input_data': csv_data
        }
        
        # Step 3: Execute split transformation
        response = self.client.post('/api/v1/transform/split', json=split_request)
        
        # Step 4: Verify response
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is True
        
        # Step 5: Verify column-based splitting
        output1_df = pd.read_csv(io.StringIO(result['output_data']))
        output2_df = pd.read_csv(io.StringIO(result['output_data_2']))
        
        # Verify column selections
        assert list(output1_df.columns) == ['id', 'name', 'age']
        assert list(output2_df.columns) == ['salary', 'department']
        
        # Verify row counts are preserved
        assert len(output1_df) == 10
        assert len(output2_df) == 10
        
        # Verify data integrity
        expected_output1 = self.df[['id', 'name', 'age']]
        expected_output2 = self.df[['salary', 'department']]
        
        pd.testing.assert_frame_equal(output1_df, expected_output1)
        pd.testing.assert_frame_equal(output2_df, expected_output2)
        
        # Step 6: Verify metadata
        metadata = result['metadata']
        assert metadata['split_type'] == 'columns'
        assert metadata['selected_columns1'] == ['id', 'name', 'age']
        assert metadata['selected_columns2'] == ['salary', 'department']
        assert metadata['output1_shape'] == [10, 3]
        assert metadata['output2_shape'] == [10, 2]
        
    def test_split_edge_cases(self):
        """Test edge cases and error conditions."""
        
        csv_data = {
            'csv_content': self.csv_content,
            'filename': 'test_employees.csv'
        }
        
        # Test invalid row count (too large)
        split_request = {
            'node_id': 'split_node_003',
            'node_type': 'split',
            'parameters': {
                'splitType': 'rows',
                'rowCount': 15,  # More than available rows
                'selectedColumns1': [],
                'selectedColumns2': []
            },
            'input_data': csv_data
        }
        
        response = self.client.post('/api/v1/transform/split', json=split_request)
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False
        assert 'Invalid row_count' in result['error']
        
        # Test invalid column names
        split_request = {
            'node_id': 'split_node_004',
            'node_type': 'split',
            'parameters': {
                'splitType': 'columns',
                'rowCount': 10,
                'selectedColumns1': ['invalid_column'],
                'selectedColumns2': ['another_invalid_column']
            },
            'input_data': csv_data
        }
        
        response = self.client.post('/api/v1/transform/split', json=split_request)
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False
        assert 'Invalid columns' in result['error']
        
    def test_split_boundary_conditions(self):
        """Test boundary conditions for row splitting."""
        
        csv_data = {
            'csv_content': self.csv_content,
            'filename': 'test_employees.csv'
        }
        
        # Test splitting at row 1 (minimum valid split)
        split_request = {
            'node_id': 'split_node_005',
            'node_type': 'split',
            'parameters': {
                'splitType': 'rows',
                'rowCount': 1,
                'selectedColumns1': [],
                'selectedColumns2': []
            },
            'input_data': csv_data
        }
        
        response = self.client.post('/api/v1/transform/split', json=split_request)
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is True
        
        output1_df = pd.read_csv(io.StringIO(result['output_data']))
        output2_df = pd.read_csv(io.StringIO(result['output_data_2']))
        
        assert len(output1_df) == 1
        assert len(output2_df) == 9
        
        # Test splitting at row 9 (maximum valid split for 10-row dataset)
        split_request['parameters']['rowCount'] = 9
        split_request['node_id'] = 'split_node_006'
        
        response = self.client.post('/api/v1/transform/split', json=split_request)
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is True
        
        output1_df = pd.read_csv(io.StringIO(result['output_data']))
        output2_df = pd.read_csv(io.StringIO(result['output_data_2']))
        
        assert len(output1_df) == 9
        assert len(output2_df) == 1
        
    def test_empty_column_selection(self):
        """Test column splitting with empty selections."""
        
        csv_data = {
            'csv_content': self.csv_content,
            'filename': 'test_employees.csv'
        }
        
        # Test with no columns selected for either output
        split_request = {
            'node_id': 'split_node_007',
            'node_type': 'split',
            'parameters': {
                'splitType': 'columns',
                'rowCount': 10,
                'selectedColumns1': [],
                'selectedColumns2': []
            },
            'input_data': csv_data
        }
        
        response = self.client.post('/api/v1/transform/split', json=split_request)
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False
        assert 'No columns selected' in result['error']
        
    def test_malformed_csv_input(self):
        """Test handling of malformed CSV input."""
        
        # Test with invalid CSV content
        csv_data = {
            'csv_content': 'invalid,csv,content\nwith,missing,\nfields',
            'filename': 'invalid.csv'
        }
        
        split_request = {
            'node_id': 'split_node_008',
            'node_type': 'split',
            'parameters': {
                'splitType': 'rows',
                'rowCount': 1,
                'selectedColumns1': [],
                'selectedColumns2': []
            },
            'input_data': csv_data
        }
        
        response = self.client.post('/api/v1/transform/split', json=split_request)
        assert response.status_code == 200
        result = response.json()
        # Should handle gracefully, either succeed with available data or fail with clear error
        assert 'success' in result
        
    def test_missing_csv_content(self):
        """Test handling of missing CSV content."""
        
        # Test with missing csv_content
        split_request = {
            'node_id': 'split_node_009',
            'node_type': 'split',
            'parameters': {
                'splitType': 'rows',
                'rowCount': 5,
                'selectedColumns1': [],
                'selectedColumns2': []
            },
            'input_data': {'filename': 'test.csv'}  # Missing csv_content
        }
        
        response = self.client.post('/api/v1/transform/split', json=split_request)
        assert response.status_code == 200
        result = response.json()
        assert result['success'] is False
        assert 'No csv_content found' in result['error']