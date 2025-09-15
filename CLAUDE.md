# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Data Science Workflow Canvas application built with:
- **Frontend**: Next.js 15 with React 19, TypeScript, TailwindCSS
- **Backend**: FastAPI with Python 3.12+ optimizations
- **Architecture**: Full-stack application with EDA (Exploratory Data Analysis) capabilities and Jupyter notebook integration

## Development Commands

### Frontend (Next.js)
```bash
cd civic-data-trust
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Backend (FastAPI)
```bash
cd civic-data-trust/backend

# Install dependencies
pip install -r requirements.txt

# Start development server
python run_server.py
# OR
python -m app.main_refactored
# OR
uvicorn app.main:app --reload

# Server runs on http://localhost:8000
# API docs at http://localhost:8000/docs
# API endpoints at http://localhost:8000/api/v1
```

### Testing
```bash
# Backend testing
cd civic-data-trust/backend
pytest                    # Run all tests
pytest tests/unit/        # Run unit tests only
pytest tests/integration/ # Run integration tests only
pytest --cov=app tests/   # Run with coverage
```

## Architecture

### High-Level Structure
```
UofT-DataTrust/
├── civic-data-trust/           # Main application
│   ├── app/                    # Next.js frontend
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (community)/       # Community features
│   │   ├── store/             # Redux store
│   │   └── types/             # TypeScript types
│   └── backend/               # FastAPI backend
│       ├── app/               # Main application code
│       │   ├── api/           # API endpoints and routing
│       │   ├── core/          # Business logic modules
│       │   │   ├── eda/       # EDA workflow management
│       │   │   ├── file_processing/ # File handling
│       │   │   └── notebook/  # Jupyter notebook integration
│       │   ├── services/      # External service integrations
│       │   ├── models/        # Pydantic models
│       │   └── utils/         # Utility functions
│       ├── tests/             # Test suite
│       └── notebooks/         # Jupyter notebook storage
```

### Backend Architecture (Refactored FastAPI)

The backend has been refactored into a modular, domain-driven architecture:

#### Core Modules:
- **EDA Module** (`app/core/eda/`): Handles exploratory data analysis workflows
- **File Processing** (`app/core/file_processing/`): File type detection and processing
- **Notebook Management** (`app/core/notebook/`): Jupyter notebook session management
- **API Layer** (`app/api/`): FastAPI endpoints with dependency injection

#### Key Features:
- **Dependency Injection**: Proper FastAPI patterns with cached dependencies
- **Exception Handling**: Custom exception hierarchy with proper HTTP responses
- **Performance Monitoring**: Built-in execution time tracking and memory monitoring
- **Background Tasks**: Automated cleanup of notebook files (24-hour retention)
- **Type Safety**: Comprehensive type hints throughout

### Frontend Architecture (Next.js)

- **App Router**: Using Next.js 15 app router structure
- **State Management**: Redux Toolkit (@reduxjs/toolkit)
- **Styling**: TailwindCSS with dark mode support
- **Components**: React 19 with TypeScript
- **Canvas Integration**: Konva.js for interactive data visualization

## Key Configuration Files

- `civic-data-trust/package.json`: Frontend dependencies and scripts
- `civic-data-trust/backend/requirements.txt`: Python dependencies
- `civic-data-trust/backend/app/core/config.py`: Backend configuration
- `civic-data-trust/tsconfig.json`: TypeScript configuration
- `civic-data-trust/tailwind.config.js`: TailwindCSS configuration

## Important Development Notes

### Backend Development:
- The backend supports both legacy (`app.main`) and refactored (`app.main_refactored`) entry points
- Use `run_server.py` for simplified development server startup
- All API endpoints are under `/api/v1/` prefix
- Built-in performance optimizations for Python 3.12+
- Automated notebook file cleanup runs every 6 hours

### Frontend Development:
- Dark mode is enabled by default in the layout
- Uses Geist fonts (Sans and Mono)
- Redux store is configured for state management
- Authentication routes are in `app/(auth)/`
- Community features are in `app/(community)/`

### File Processing:
- Supports CSV, Excel, JSON file types
- Automatic file type detection with metadata extraction
- Security validation for uploaded files
- EDA workflows with predefined analysis patterns

### Testing:
- Backend uses pytest with organized test structure
- Unit tests in `tests/unit/`
- Integration tests in `tests/integration/`
- Legacy tests preserved in `tests/legacy/`
- Test fixtures in `conftest.py`

## Development Workflow

1. **Start Backend**: `cd civic-data-trust/backend && python run_server.py`
2. **Start Frontend**: `cd civic-data-trust && npm run dev`
3. **Access Application**: http://localhost:3000 (frontend), http://localhost:8000/docs (API docs)
4. **Run Tests**: Use pytest for backend testing
5. **Lint Code**: `npm run lint` for frontend linting

## Key Endpoints

- **Root**: `/` - System information and health status
- **Health Check**: `/health` - Application health with metrics
- **API Docs**: `/docs` - Interactive API documentation
- **EDA Endpoints**: `/api/v1/eda/*` - Data analysis workflows
- **File Processing**: `/api/v1/data/*` - File upload and processing
- **Notebook Management**: `/api/v1/notebook/*` - Jupyter integration