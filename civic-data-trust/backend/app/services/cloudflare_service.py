import requests
import json
import uuid
import os
import tempfile
from typing import Dict, Any, Optional, List
import logging
from datetime import datetime, timedelta
import asyncio
import aiohttp
from urllib.parse import urlparse


class CloudflareService:
    """Service for Cloudflare tunnel integration and public link generation
    
    Provides:
    - Cloudflare tunnel creation and management
    - Public hostname configuration
    - Download link generation for Google Colab compatibility
    - Tunnel cleanup and resource management
    """
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.base_url = "https://api.cloudflare.com/client/v4"
        self.active_tunnels = {}  # Track active tunnels for cleanup
        
        # Default configuration
        self.default_config = {
            'tunnel_timeout_hours': 24,
            'max_concurrent_tunnels': 10,
            'retry_attempts': 3,
            'retry_delay_seconds': 5
        }
    
    def create_tunnel(self, name: str, credentials: Dict[str, str]) -> Dict[str, Any]:
        """Create a new Cloudflare tunnel
        
        Args:
            name: Name for the tunnel
            credentials: Cloudflare API credentials
            
        Returns:
            Dict with tunnel creation results
        """
        try:
            headers = {
                'Authorization': f"Bearer {credentials['api_key']}",
                'Content-Type': 'application/json'
            }
            
            tunnel_data = {
                'name': name,
                'tunnel_secret': self._generate_tunnel_secret()
            }
            
            url = f"{self.base_url}/accounts/{credentials['account_id']}/cfd_tunnel"
            
            response = requests.post(url, headers=headers, json=tunnel_data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    tunnel_info = result['result']
                    tunnel_id = tunnel_info['id']
                    
                    # Store tunnel info for management
                    self.active_tunnels[tunnel_id] = {
                        'name': name,
                        'created_at': datetime.now(),
                        'credentials': credentials
                    }
                    
                    return {
                        'success': True,
                        'tunnel_id': tunnel_id,
                        'tunnel_name': name,
                        'cname': tunnel_info.get('cname', f"{tunnel_id}.cfargotunnel.com")
                    }
                else:
                    return {
                        'success': False,
                        'error': f"Cloudflare API error: {result.get('errors', 'Unknown error')}"
                    }
            else:
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            self.logger.error(f"Failed to create tunnel: {str(e)}")
            return {
                'success': False,
                'error': f"Exception during tunnel creation: {str(e)}"
            }
    
    def create_public_hostname(self, tunnel_id: str, hostname: str, 
                             service_url: str, credentials: Dict[str, str]) -> Dict[str, Any]:
        """Create a public hostname for the tunnel
        
        Args:
            tunnel_id: ID of the tunnel
            hostname: Public hostname to create
            service_url: Local service URL to route to
            credentials: Cloudflare API credentials
            
        Returns:
            Dict with hostname creation results
        """
        try:
            headers = {
                'Authorization': f"Bearer {credentials['api_key']}",
                'Content-Type': 'application/json'
            }
            
            hostname_data = {
                'hostname': hostname,
                'service': service_url,
                'type': 'http'
            }
            
            url = f"{self.base_url}/accounts/{credentials['account_id']}/cfd_tunnel/{tunnel_id}/configurations"
            
            response = requests.post(url, headers=headers, json=hostname_data)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success'):
                    return {
                        'success': True,
                        'public_url': f"https://{hostname}",
                        'hostname': hostname,
                        'service_url': service_url,
                        'wget_compatible': True
                    }
                else:
                    return {
                        'success': False,
                        'error': f"Hostname creation failed: {result.get('errors', 'Unknown error')}"
                    }
            else:
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            self.logger.error(f"Failed to create hostname: {str(e)}")
            return {
                'success': False,
                'error': f"Exception during hostname creation: {str(e)}"
            }
    
    def validate_colab_compatibility(self, url: str) -> Dict[str, Any]:
        """Validate URL compatibility with Google Colab
        
        Args:
            url: URL to validate
            
        Returns:
            Dict with compatibility results
        """
        try:
            # Parse URL
            parsed = urlparse(url)
            
            # Check basic requirements
            if not parsed.scheme or not parsed.netloc:
                return {
                    'is_compatible': False,
                    'reason': 'Invalid URL format'
                }
            
            # Must be HTTPS for Colab
            if parsed.scheme != 'https':
                return {
                    'is_compatible': False,
                    'reason': 'Google Colab requires HTTPS URLs'
                }
            
            # Generate wget command
            wget_command = f"wget {url}"
            
            # Add additional wget options for better Colab compatibility
            if url.endswith('.zip'):
                filename = os.path.basename(parsed.path)
                wget_command = f"wget -O {filename} {url}"
            
            return {
                'is_compatible': True,
                'wget_command': wget_command,
                'curl_command': f"curl -L -O {url}",
                'colab_ready': True
            }
            
        except Exception as e:
            return {
                'is_compatible': False,
                'reason': f"Error validating URL: {str(e)}"
            }
    
    async def test_download_accessibility(self, url: str, timeout: int = 30) -> Dict[str, Any]:
        """Test if download URL is accessible
        
        Args:
            url: URL to test
            timeout: Request timeout in seconds
            
        Returns:
            Dict with accessibility results
        """
        try:
            async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=timeout)) as session:
                async with session.head(url) as response:
                    return {
                        'accessible': response.status == 200,
                        'status_code': response.status,
                        'headers': dict(response.headers),
                        'file_size_bytes': int(response.headers.get('content-length', 0)),
                        'content_type': response.headers.get('content-type', 'unknown')
                    }
                    
        except asyncio.TimeoutError:
            return {
                'accessible': False,
                'error': 'Request timeout',
                'status_code': 0
            }
        except Exception as e:
            return {
                'accessible': False,
                'error': str(e),
                'status_code': 0
            }
    
    def execute_complete_workflow(self, files: Dict[str, str], 
                                execution_summary: Dict[str, Any], 
                                credentials: Dict[str, str]) -> Dict[str, Any]:
        """Execute complete Cloudflare workflow
        
        Args:
            files: Dictionary of files to package
            execution_summary: Summary of EDA execution
            credentials: Cloudflare API credentials
            
        Returns:
            Dict with complete workflow results
        """
        try:
            # Generate unique identifiers
            workflow_id = str(uuid.uuid4())[:8]
            tunnel_name = f"eda-results-{workflow_id}"
            hostname = f"eda-{workflow_id}.{credentials.get('domain', 'example.com')}"
            
            # Step 1: Create package (mock implementation)
            package_path = self._create_mock_package(files, execution_summary, workflow_id)
            
            # Step 2: Create tunnel
            tunnel_result = self.create_tunnel(tunnel_name, credentials)
            if not tunnel_result['success']:
                return {
                    'success': False,
                    'error': f"Tunnel creation failed: {tunnel_result['error']}"
                }
            
            tunnel_id = tunnel_result['tunnel_id']
            
            # Step 3: Create public hostname
            service_url = f"http://localhost:8080/{workflow_id}"
            hostname_result = self.create_public_hostname(
                tunnel_id, hostname, service_url, credentials
            )
            
            if not hostname_result['success']:
                # Cleanup tunnel on hostname failure
                self.delete_tunnel(tunnel_id, credentials)
                return {
                    'success': False,
                    'error': f"Hostname creation failed: {hostname_result['error']}"
                }
            
            # Step 4: Generate download URL and commands
            download_url = f"https://{hostname}/download/package.zip"
            wget_command = f"wget {download_url}"
            
            # Step 5: Generate Colab instructions
            colab_instructions = self._generate_colab_instructions(
                download_url, execution_summary
            )
            
            return {
                'success': True,
                'workflow_id': workflow_id,
                'tunnel_id': tunnel_id,
                'package_path': package_path,
                'download_url': download_url,
                'wget_command': wget_command,
                'colab_instructions': colab_instructions,
                'hostname': hostname,
                'expires_at': (datetime.now() + timedelta(hours=24)).isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Complete workflow failed: {str(e)}")
            return {
                'success': False,
                'error': f"Workflow execution failed: {str(e)}"
            }
    
    def delete_tunnel(self, tunnel_id: str, credentials: Dict[str, str]) -> Dict[str, Any]:
        """Delete a Cloudflare tunnel
        
        Args:
            tunnel_id: ID of tunnel to delete
            credentials: Cloudflare API credentials
            
        Returns:
            Dict with deletion results
        """
        try:
            headers = {
                'Authorization': f"Bearer {credentials['api_key']}",
                'Content-Type': 'application/json'
            }
            
            url = f"{self.base_url}/accounts/{credentials['account_id']}/cfd_tunnel/{tunnel_id}"
            
            response = requests.delete(url, headers=headers)
            
            if response.status_code == 200:
                # Remove from active tunnels
                if tunnel_id in self.active_tunnels:
                    del self.active_tunnels[tunnel_id]
                
                return {
                    'success': True,
                    'tunnel_id': tunnel_id
                }
            else:
                return {
                    'success': False,
                    'error': f"HTTP {response.status_code}: {response.text}"
                }
                
        except Exception as e:
            self.logger.error(f"Failed to delete tunnel: {str(e)}")
            return {
                'success': False,
                'error': f"Exception during tunnel deletion: {str(e)}"
            }
    
    def cleanup_expired_tunnels(self, credentials: Dict[str, str]) -> Dict[str, Any]:
        """Cleanup expired tunnels
        
        Args:
            credentials: Cloudflare API credentials
            
        Returns:
            Dict with cleanup results
        """
        try:
            current_time = datetime.now()
            expired_tunnels = []
            
            for tunnel_id, tunnel_info in list(self.active_tunnels.items()):
                created_at = tunnel_info['created_at']
                age_hours = (current_time - created_at).total_seconds() / 3600
                
                if age_hours > self.default_config['tunnel_timeout_hours']:
                    delete_result = self.delete_tunnel(tunnel_id, credentials)
                    if delete_result['success']:
                        expired_tunnels.append(tunnel_id)
            
            return {
                'success': True,
                'cleaned_tunnels': len(expired_tunnels),
                'tunnel_ids': expired_tunnels
            }
            
        except Exception as e:
            self.logger.error(f"Cleanup failed: {str(e)}")
            return {
                'success': False,
                'error': f"Cleanup failed: {str(e)}"
            }
    
    def _generate_tunnel_secret(self) -> str:
        """Generate a secure tunnel secret"""
        import secrets
        return secrets.token_urlsafe(32)
    
    def _create_mock_package(self, files: Dict[str, str], 
                           execution_summary: Dict[str, Any], 
                           workflow_id: str) -> str:
        """Create mock package for testing (replace with actual packaging service)"""
        # This would be replaced with actual file packaging service
        package_dir = tempfile.mkdtemp()
        package_path = os.path.join(package_dir, f"eda_results_{workflow_id}.zip")
        
        # Mock package creation
        with open(package_path, 'w') as f:
            f.write(f"Mock EDA package for workflow {workflow_id}")
        
        return package_path
    
    def _generate_colab_instructions(self, download_url: str, 
                                   execution_summary: Dict[str, Any]) -> str:
        """Generate Google Colab usage instructions"""
        workflow_id = execution_summary.get('execution_id', 'unknown')
        libraries_used = execution_summary.get('libraries_used', ['pandas', 'numpy', 'matplotlib'])
        
        instructions = f"""
# EDA Results - Google Colab Instructions

## Download and Setup

```python
# 1. Download the EDA results package
!wget {download_url}

# 2. Extract the package
!unzip eda_results_{workflow_id}.zip

# 3. Install required libraries
!pip install pandas numpy matplotlib seaborn

# 4. Import libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from IPython.display import Image, display
```

## Load Processed Data

```python
# Load the processed dataset
df = pd.read_csv('processed_data.csv')
print(f"Dataset shape: {{df.shape}}")
df.head()
```

## View Generated Visualizations

```python
# Display generated plots
import os
plot_files = [f for f in os.listdir('.') if f.endswith('.png')]

for plot_file in plot_files:
    print(f"\n--- {{plot_file}} ---")
    display(Image(plot_file))
```

## Libraries Used in Analysis
{', '.join(libraries_used)}

## Execution Summary
- Execution ID: {workflow_id}
- Total Functions: {execution_summary.get('total_functions', 'N/A')}
- Execution Time: {execution_summary.get('execution_time_ms', 0):.2f}ms

## Next Steps

1. Explore the processed data using pandas operations
2. Create additional visualizations with matplotlib/seaborn
3. Perform further analysis based on your research questions

For questions or issues, refer to the metadata.json file for detailed execution information.
"""
        
        return instructions
    
    def get_active_tunnels(self) -> Dict[str, Any]:
        """Get information about active tunnels"""
        return {
            'active_count': len(self.active_tunnels),
            'tunnels': {
                tunnel_id: {
                    'name': info['name'],
                    'created_at': info['created_at'].isoformat(),
                    'age_hours': (datetime.now() - info['created_at']).total_seconds() / 3600
                }
                for tunnel_id, info in self.active_tunnels.items()
            }
        }