#!/usr/bin/env python3
"""
Automatic GPU/CPU detection and configuration for Jupyter notebooks
This script runs automatically when a new kernel starts
"""

import os
import sys
import multiprocessing

def setup_gpu():
    """Detect and configure GPU if available"""
    try:
        import torch
        
        if torch.cuda.is_available():
            gpu_count = torch.cuda.device_count()
            gpu_name = torch.cuda.get_device_name(0)
            gpu_memory = torch.cuda.get_device_properties(0).total_memory / 1e9
            
            print("🚀 GPU Configuration:")
            print(f"   ✅ GPU Available: {gpu_name}")
            print(f"   📊 GPU Memory: {gpu_memory:.1f} GB")
            print(f"   🔢 GPU Count: {gpu_count}")
            
            # Set GPU device order for consistent behavior
            os.environ['CUDA_DEVICE_ORDER'] = 'PCI_BUS_ID'
            
            # Set default GPU device
            torch.cuda.set_device(0)
            
            return True, gpu_name, gpu_memory
        else:
            print("💻 GPU Configuration:")
            print("   ❌ GPU not available or not configured")
            return False, None, None
            
    except ImportError:
        print("💻 GPU Configuration:")
        print("   ⚠️  PyTorch not installed - GPU detection skipped")
        return False, None, None

def setup_cpu():
    """Configure CPU threading"""
    cpu_count = multiprocessing.cpu_count()
    
    # Set optimal CPU threading for various libraries
    os.environ['OMP_NUM_THREADS'] = str(cpu_count)
    os.environ['MKL_NUM_THREADS'] = str(cpu_count)
    os.environ['NUMEXPR_NUM_THREADS'] = str(cpu_count)
    os.environ['NUMBA_NUM_THREADS'] = str(cpu_count)
    
    print("🔧 CPU Configuration:")
    print(f"   ✅ CPU Cores: {cpu_count}")
    print(f"   🧵 Thread Count: {cpu_count}")
    
    return cpu_count

def setup_memory():
    """Display memory information"""
    try:
        import psutil
        memory = psutil.virtual_memory()
        memory_gb = memory.total / 1e9
        
        print("💾 Memory Configuration:")
        print(f"   ✅ Total RAM: {memory_gb:.1f} GB")
        print(f"   📊 Available RAM: {memory.available / 1e9:.1f} GB")
        
        return memory_gb
    except ImportError:
        print("💾 Memory Configuration:")
        print("   ⚠️  psutil not installed - memory info unavailable")
        return None

def setup_environment():
    """Configure the notebook environment"""
    print("=" * 60)
    print("🔧 UofT-DataTrust Notebook Environment Setup")
    print("=" * 60)
    
    # Setup components
    gpu_available, gpu_name, gpu_memory = setup_gpu()
    cpu_count = setup_cpu()
    memory_gb = setup_memory()
    
    print("-" * 60)
    print("📦 Environment Summary:")
    print(f"   🐍 Python: {sys.version.split()[0]}")
    print(f"   💻 CPU Cores: {cpu_count}")
    print(f"   💾 RAM: {memory_gb:.1f} GB" if memory_gb else "   💾 RAM: Unknown")
    
    if gpu_available:
        print(f"   🚀 GPU: {gpu_name} ({gpu_memory:.1f} GB)")
    else:
        print("   🚀 GPU: Not available")
    
    print("-" * 60)
    print("✅ Environment ready for data science!")
    print("=" * 60)
    
    # Set up common imports for convenience
    setup_common_imports()

def setup_common_imports():
    """Import commonly used libraries"""
    try:
        # Add to global namespace for convenience
        globals_dict = globals()
        
        # Data science essentials
        import numpy as np
        import pandas as pd
        import matplotlib.pyplot as plt
        import seaborn as sns
        
        globals_dict['np'] = np
        globals_dict['pd'] = pd
        globals_dict['plt'] = plt
        globals_dict['sns'] = sns
        
        # Configure matplotlib for notebook
        plt.style.use('default')
        
        print("📚 Pre-loaded libraries:")
        print("   ✅ numpy as np")
        print("   ✅ pandas as pd") 
        print("   ✅ matplotlib.pyplot as plt")
        print("   ✅ seaborn as sns")
        
        # Try to import torch if available
        try:
            import torch
            globals_dict['torch'] = torch
            print("   ✅ torch")
        except ImportError:
            pass
            
    except Exception as e:
        print(f"⚠️  Warning: Could not pre-load some libraries: {e}")

# Run setup automatically when script is imported
if __name__ == "__main__" or "startup" in __file__:
    setup_environment()