#!/usr/bin/env python3
"""
Minimal file detector to test imports
"""

print("Starting minimal detector test...")

# Test imports one by one
print("1. Testing os...")
import os
print("✅ os OK")

print("2. Testing mimetypes...")
import mimetypes
print("✅ mimetypes OK")

print("3. Testing enum...")
from enum import Enum
print("✅ enum OK")

print("4. Testing typing...")
from typing import Dict, Any, List, Optional
print("✅ typing OK")

print("5. Testing pandas...")
import pandas as pd
print("✅ pandas OK")

print("6. Testing numpy...")
import numpy as np
print("✅ numpy OK")

print("7. Testing pathlib...")
from pathlib import Path
print("✅ pathlib OK")

print("8. Testing logging...")
import logging
print("✅ logging OK")

print("9. Testing datetime...")
from datetime import datetime
print("✅ datetime OK")

print("10. Testing FileType enum...")
class FileType(Enum):
    TABULAR_CSV = "TABULAR_CSV"
    UNSUPPORTED = "UNSUPPORTED"
print("✅ FileType enum OK")

print("11. Testing simple class...")
class SimpleDetector:
    def __init__(self):
        self.test = True
        
    def detect_file_type(self, file_path: str):
        return FileType.TABULAR_CSV

print("✅ SimpleDetector class OK")

print("12. Testing class instantiation...")
detector = SimpleDetector()
print("✅ Class instantiation OK")

print("\n🎉 All tests passed! The issue is not with basic imports.")