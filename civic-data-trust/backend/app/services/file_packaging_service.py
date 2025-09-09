import os
import zipfile
import json
import tempfile
import shutil
from typing import Dict, Any, List, Optional
from datetime import datetime
import pandas as pd
import base64
import io
from pathlib import Path
import logging


class FilePackagingService:
    """Service for creating structured packages of EDA results
    
    Provides:
    - Zip file creation with organized directory structure
    - Metadata generation and inclusion
    - README file generation
    - Google Colab notebook creation
    - Security validation and cleanup
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
        # Package structure template
        self.package_structure = {
            'data/': 'Processed datasets and data files',
            'visualizations/': 'Generated plots and charts',
            'metadata/': 'Execution metadata and logs',
            'notebooks/': 'Google Colab notebooks (optional)',
            'scripts/': 'Generated analysis scripts (optional)'
        }
    
    def create_eda_package(self, files: Dict[str, str], package_name: str, 
                          output_dir: str, organize_by_type: bool = False) -> str:
        """Create EDA results package
        
        Args:
            files: Dictionary mapping file types to file paths
            package_name: Name for the package
            output_dir: Directory to create package in
            organize_by_type: Whether to organize files by type in subdirectories
            
        Returns:
            Path to created zip file
        """
        try:
            # Validate inputs
            self._validate_package_inputs(files, package_name, output_dir)
            
            # Create temporary working directory
            with tempfile.TemporaryDirectory() as temp_dir:
                package_dir = os.path.join(temp_dir, package_name)
                os.makedirs(package_dir, exist_ok=True)
                
                # Create directory structure if organizing by type
                if organize_by_type:
                    for dir_name in self.package_structure.keys():
                        os.makedirs(os.path.join(package_dir, dir_name), exist_ok=True)
                
                # Copy and organize files
                file_manifest = self._organize_files(files, package_dir, organize_by_type)
                
                # Generate and add metadata
                metadata = self._generate_package_metadata(files, file_manifest)
                metadata_path = os.path.join(package_dir, 'metadata' if organize_by_type else '', 'metadata.json')
                os.makedirs(os.path.dirname(metadata_path), exist_ok=True)
                with open(metadata_path, 'w') as f:
                    json.dump(metadata, f, indent=2)
                
                # Generate README
                readme_content = self._generate_readme(metadata)
                readme_path = os.path.join(package_dir, 'README.md')
                with open(readme_path, 'w') as f:
                    f.write(readme_content)
                
                # Create zip file
                zip_path = os.path.join(output_dir, f"{package_name}.zip")
                self._create_zip_file(package_dir, zip_path)
                
                return zip_path
                
        except Exception as e:
            self.logger.error(f"Failed to create EDA package: {str(e)}")
            raise
    
    def create_structured_package(self, files: Dict[str, str], package_name: str, 
                                output_dir: str, organize_by_type: bool = True) -> str:
        """Create structured EDA package with organized directories"""
        return self.create_eda_package(files, package_name, output_dir, organize_by_type)
    
    def generate_package_metadata(self, files: Dict[str, str], 
                                execution_summary: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive package metadata
        
        Args:
            files: Dictionary of files in package
            execution_summary: Summary of EDA execution
            
        Returns:
            Dict with package metadata
        """
        try:
            # Basic package info
            package_info = {
                'package_name': f"eda_results_{execution_summary.get('execution_id', 'unknown')}",
                'created_at': datetime.now().isoformat(),
                'version': '1.0.0',
                'generator': 'EDA Processor v1.0'
            }
            
            # Execution summary
            exec_summary = {
                'execution_id': execution_summary.get('execution_id'),
                'libraries_used': execution_summary.get('libraries_used', []),
                'total_functions': execution_summary.get('total_functions', 0),
                'execution_time_ms': execution_summary.get('execution_time_ms', 0),
                'success_rate': execution_summary.get('success_rate', 0.0),
                'data_shape': execution_summary.get('data_shape', [0, 0])
            }
            
            # File manifest
            file_manifest = []
            for file_type, file_path in files.items():
                if os.path.exists(file_path):
                    file_info = {
                        'type': file_type,
                        'filename': os.path.basename(file_path),
                        'size_bytes': os.path.getsize(file_path),
                        'size_mb': os.path.getsize(file_path) / 1024 / 1024,
                        'modified_at': datetime.fromtimestamp(os.path.getmtime(file_path)).isoformat()
                    }
                    file_manifest.append(file_info)
            
            # Google Colab instructions
            colab_instructions = {
                'download_command': 'wget <download_url>',
                'extract_command': f'unzip {package_info["package_name"]}.zip',
                'setup_commands': [
                    'pip install pandas numpy matplotlib seaborn',
                    'import pandas as pd',
                    'import numpy as np',
                    'import matplotlib.pyplot as plt'
                ],
                'load_data_command': 'df = pd.read_csv("data/processed_data.csv")'
            }
            
            return {
                'package_info': package_info,
                'execution_summary': exec_summary,
                'file_manifest': file_manifest,
                'colab_instructions': colab_instructions,
                'directory_structure': self.package_structure
            }
            
        except Exception as e:
            self.logger.error(f"Failed to generate metadata: {str(e)}")
            return {'error': str(e)}
    
    def generate_readme(self, execution_summary: Dict[str, Any], 
                       download_url: Optional[str] = None) -> str:
        """Generate README file for the package
        
        Args:
            execution_summary: Summary of EDA execution
            download_url: Optional download URL for the package
            
        Returns:
            README content as string
        """
        execution_id = execution_summary.get('execution_id', 'unknown')
        libraries_used = execution_summary.get('libraries_used', ['pandas', 'numpy', 'matplotlib'])
        functions_executed = execution_summary.get('functions_executed', [])
        data_shape = execution_summary.get('data_shape', [0, 0])
        execution_time = execution_summary.get('execution_time_ms', 0)
        
        readme_content = f"""
# EDA Results Package

This package contains the results of an Exploratory Data Analysis (EDA) workflow executed on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}.

## Package Information

- **Execution ID**: {execution_id}
- **Libraries Used**: {', '.join(libraries_used)}
- **Data Shape**: {data_shape[0]} rows × {data_shape[1]} columns
- **Execution Time**: {execution_time:.2f}ms
- **Functions Executed**: {len(functions_executed)}

## Package Contents

### 📊 Data Files (`data/`)
- `processed_data.csv` - Cleaned and processed dataset
- `original_data.csv` - Original input dataset (if available)

### 📈 Visualizations (`visualizations/`)
- Generated plots and charts from the analysis
- PNG format for easy viewing and inclusion in reports

### 📋 Metadata (`metadata/`)
- `metadata.json` - Detailed execution information
- `execution_log.txt` - Step-by-step execution log (if available)

### 📓 Notebooks (`notebooks/`)
- `analysis.ipynb` - Google Colab notebook for further analysis (if generated)

## Google Colab Usage

### Quick Start

1. **Download the package**:
   ```bash
   wget {download_url or '<download_url>'}
   ```

2. **Extract the contents**:
   ```bash
   unzip eda_results_{execution_id}.zip
   cd eda_results_{execution_id}/
   ```

3. **Install required libraries**:
   ```python
   !pip install pandas numpy matplotlib seaborn plotly
   ```

4. **Load the processed data**:
   ```python
   import pandas as pd
   import numpy as np
   import matplotlib.pyplot as plt
   import seaborn as sns
   
   # Load the main dataset
   df = pd.read_csv('data/processed_data.csv')
   print(f"Dataset shape: {{df.shape}}")
   df.head()
   ```

5. **View generated visualizations**:
   ```python
   from IPython.display import Image, display
   import os
   
   # Display all generated plots
   viz_files = [f for f in os.listdir('visualizations/') if f.endswith('.png')]
   for viz_file in viz_files:
       print(f"\n--- {{viz_file}} ---")
       display(Image(f'visualizations/{{viz_file}}'))
   ```

### Advanced Analysis

```python
# Load metadata for detailed information
import json
with open('metadata/metadata.json', 'r') as f:
    metadata = json.load(f)

print("Execution Summary:")
print(json.dumps(metadata['execution_summary'], indent=2))

# Recreate analysis steps
functions_used = metadata['execution_summary']['functions_executed']
print(f"\nFunctions executed: {', '.join(functions_used)}")
```

## Functions Executed

{self._format_functions_list(functions_executed)}

## Data Quality Summary

- **Missing Values**: Check `metadata.json` for detailed information
- **Data Types**: Automatically detected and processed
- **Duplicates**: Removed during cleaning (if applicable)

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all required libraries are installed
   ```python
   !pip install pandas numpy matplotlib seaborn
   ```

2. **File Not Found**: Ensure you're in the correct directory
   ```python
   import os
   print("Current directory:", os.getcwd())
   print("Files:", os.listdir('.'))
   ```

3. **Visualization Issues**: Try different backends
   ```python
   import matplotlib
   matplotlib.use('Agg')  # For headless environments
   ```

## Next Steps

1. **Explore the Data**: Use pandas operations to dive deeper into the dataset
2. **Create New Visualizations**: Build upon the existing analysis
3. **Statistical Analysis**: Apply statistical tests and models
4. **Export Results**: Save your findings and create reports

## Support

For questions about this package or the EDA Processor:
- Check the `metadata.json` file for detailed execution information
- Review the execution log for step-by-step details
- Refer to the original data source documentation

---

*Generated by EDA Processor v1.0 on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        return readme_content
    
    def create_colab_notebook(self, execution_summary: Dict[str, Any], 
                            output_path: str) -> str:
        """Create a Google Colab notebook for the analysis
        
        Args:
            execution_summary: Summary of EDA execution
            output_path: Path to save the notebook
            
        Returns:
            Path to created notebook
        """
        try:
            notebook_content = {
                "nbformat": 4,
                "nbformat_minor": 0,
                "metadata": {
                    "colab": {
                        "provenance": [],
                        "name": f"EDA_Analysis_{execution_summary.get('execution_id', 'unknown')}.ipynb"
                    },
                    "kernelspec": {
                        "name": "python3",
                        "display_name": "Python 3"
                    }
                },
                "cells": self._generate_notebook_cells(execution_summary)
            }
            
            with open(output_path, 'w') as f:
                json.dump(notebook_content, f, indent=2)
            
            return output_path
            
        except Exception as e:
            self.logger.error(f"Failed to create Colab notebook: {str(e)}")
            raise
    
    def cleanup_temporary_files(self, package_path: str, 
                              source_files: List[str]) -> Dict[str, Any]:
        """Cleanup temporary files after package creation
        
        Args:
            package_path: Path to created package
            source_files: List of source files to cleanup
            
        Returns:
            Dict with cleanup results
        """
        try:
            files_cleaned = 0
            errors = []
            
            # Clean up source files
            for file_path in source_files:
                try:
                    if os.path.exists(file_path) and file_path.startswith(tempfile.gettempdir()):
                        os.unlink(file_path)
                        files_cleaned += 1
                except Exception as e:
                    errors.append(f"Failed to delete {file_path}: {str(e)}")
            
            return {
                'success': True,
                'files_cleaned': files_cleaned,
                'errors': errors,
                'package_retained': os.path.exists(package_path)
            }
            
        except Exception as e:
            self.logger.error(f"Cleanup failed: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    # Helper methods
    
    def _validate_package_inputs(self, files: Dict[str, str], 
                               package_name: str, output_dir: str):
        """Validate package creation inputs"""
        if not files:
            raise ValueError("No files provided for packaging")
        
        if not package_name or '..' in package_name or '/' in package_name:
            raise ValueError("Invalid package name")
        
        if not os.path.exists(output_dir):
            os.makedirs(output_dir, exist_ok=True)
        
        # Check for path traversal in file paths
        for file_type, file_path in files.items():
            if '..' in file_path:
                raise ValueError(f"Path traversal detected in {file_type}: {file_path}")
    
    def _organize_files(self, files: Dict[str, str], package_dir: str, 
                       organize_by_type: bool) -> List[Dict[str, Any]]:
        """Organize files in package directory"""
        file_manifest = []
        
        for file_type, file_path in files.items():
            if not os.path.exists(file_path):
                continue
            
            # Determine destination directory
            if organize_by_type:
                if file_type in ['data', 'processed_data', 'csv']:
                    dest_dir = os.path.join(package_dir, 'data')
                elif file_type in ['visualization', 'plot', 'chart']:
                    dest_dir = os.path.join(package_dir, 'visualizations')
                elif file_type in ['metadata', 'log']:
                    dest_dir = os.path.join(package_dir, 'metadata')
                else:
                    dest_dir = package_dir
            else:
                dest_dir = package_dir
            
            # Copy file
            os.makedirs(dest_dir, exist_ok=True)
            dest_path = os.path.join(dest_dir, os.path.basename(file_path))
            shutil.copy2(file_path, dest_path)
            
            # Add to manifest
            file_manifest.append({
                'original_path': file_path,
                'package_path': os.path.relpath(dest_path, package_dir),
                'type': file_type,
                'size_bytes': os.path.getsize(dest_path)
            })
        
        return file_manifest
    
    def _generate_package_metadata(self, files: Dict[str, str], 
                                 file_manifest: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate package metadata"""
        return {
            'created_at': datetime.now().isoformat(),
            'file_count': len(file_manifest),
            'total_size_bytes': sum(f['size_bytes'] for f in file_manifest),
            'files': file_manifest,
            'generator': 'EDA Processor File Packaging Service v1.0'
        }
    
    def _generate_readme(self, metadata: Dict[str, Any]) -> str:
        """Generate basic README content"""
        return f"""
# EDA Results Package

Generated on: {metadata['created_at']}
Total files: {metadata['file_count']}
Package size: {metadata['total_size_bytes'] / 1024 / 1024:.2f} MB

## Contents

{chr(10).join(f"- {f['package_path']} ({f['size_bytes']} bytes)" for f in metadata['files'])}

## Usage

See the main README.md file for detailed usage instructions.
"""
    
    def _create_zip_file(self, source_dir: str, zip_path: str):
        """Create zip file from directory"""
        with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    arc_path = os.path.relpath(file_path, source_dir)
                    zipf.write(file_path, arc_path)
    
    def _format_functions_list(self, functions: List[str]) -> str:
        """Format functions list for README"""
        if not functions:
            return "No functions executed."
        
        formatted = []
        for i, func in enumerate(functions, 1):
            formatted.append(f"{i}. `{func}`")
        
        return "\n".join(formatted)
    
    def _generate_notebook_cells(self, execution_summary: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate cells for Colab notebook"""
        cells = [
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    f"# EDA Analysis - {execution_summary.get('execution_id', 'Unknown')}\n",
                    "\n",
                    "This notebook contains the analysis generated by the EDA Processor.\n"
                ]
            },
            {
                "cell_type": "code",
                "metadata": {},
                "execution_count": None,
                "outputs": [],
                "source": [
                    "# Install required libraries\n",
                    "!pip install pandas numpy matplotlib seaborn\n",
                    "\n",
                    "# Import libraries\n",
                    "import pandas as pd\n",
                    "import numpy as np\n",
                    "import matplotlib.pyplot as plt\n",
                    "import seaborn as sns\n",
                    "from IPython.display import Image, display\n"
                ]
            },
            {
                "cell_type": "code",
                "metadata": {},
                "execution_count": None,
                "outputs": [],
                "source": [
                    "# Load the processed data\n",
                    "df = pd.read_csv('data/processed_data.csv')\n",
                    "print(f'Dataset shape: {df.shape}')\n",
                    "df.head()\n"
                ]
            },
            {
                "cell_type": "code",
                "metadata": {},
                "execution_count": None,
                "outputs": [],
                "source": [
                    "# Display generated visualizations\n",
                    "import os\n",
                    "viz_files = [f for f in os.listdir('visualizations/') if f.endswith('.png')]\n",
                    "\n",
                    "for viz_file in viz_files:\n",
                    "    print(f'--- {viz_file} ---')\n",
                    "    display(Image(f'visualizations/{viz_file}'))\n"
                ]
            }
        ]
        
        return cells