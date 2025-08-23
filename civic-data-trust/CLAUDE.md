# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Commands
- `npm run dev` - Start development server (runs on http://localhost:3000)
- `npm run build --no-lint` - Build the application (note: linting is disabled during build)
- `npm run start` - Start production server
- `npm run lint` - Run ESLint on the codebase

### Development Server
Use `npm run dev` for all development work. The application auto-updates when files are changed.

## Project Architecture

This is a **Next.js 15** application using the **App Router** with **TypeScript** and **React 19**. The project follows a specific architectural pattern for role-based dashboards.

### Key Technologies
- **Next.js 15** with App Router (file-system based routing)
- **React 19** with TypeScript
- **Tailwind CSS v4** with class-based dark mode
- **Radix UI** components for accessible UI primitives
- **next-themes** for theme management
- **Lucide React** for icons

### Directory Structure

#### Core Application Structure
```
app/
├── layout.tsx                    # Root layout with font optimization (JetBrains Mono)
├── page.tsx                      # Landing page with role selector
├── globals.css                   # Global styles
├── (auth)/                       # Authentication pages (grouped route)
├── (dashboard)/                  # Dashboard pages (grouped route)
│   ├── community-member-wf/      # Community member workflow
│   ├── community-member/         # Community member standard
│   ├── researcher-wf/            # Researcher workflow
│   └── researcher/               # Researcher standard
└── components/                   # Reusable components
    ├── ui/                       # UI primitives (shadcn/ui style)
    ├── dashboard/                # Dashboard-specific components
    ├── contexts/                 # React contexts
    └── [feature]-wf.tsx          # Workflow components
```

### Role-Based Architecture

The application supports **multiple user roles** with dedicated dashboards:

1. **Community Member** (`/community-member/`) - Standard community member experience
2. **Community Member WF** (`/community-member-wf/`) - Workflow-focused community member experience  
3. **Researcher** (`/researcher/`) - Standard researcher experience
4. **Researcher WF** (`/researcher-wf/`) - Workflow-focused researcher experience

Each role has its own:
- Dashboard layout (`layout.tsx` in role directory)
- Navigation structure
- Page hierarchy
- Feature set

### Key Components & Contexts

#### Context Providers
- **UserProvider** (`app/components/contexts/user-context.tsx`) - Manages mock user data, datasets, and user operations
- **CommunityProvider** - Community-related state management
- **BreadcrumbProvider** - Navigation breadcrumb management
- **ThemeProvider** - Dark/light theme management

#### Dashboard Architecture
- **RoleSelectorDialog** - Initial role selection modal
- **Sidebar** - Role-specific navigation
- **TopNav** - Global navigation bar
- **Breadcrumb** - Dynamic navigation breadcrumbs

### Routing Conventions

#### File-System Routing (Next.js App Router)
- `page.tsx` - Route page component
- `layout.tsx` - Shared layout for route segment
- `[param]/` - Dynamic route segments
- `(group)/` - Route groups (don't affect URL structure)

#### Route Examples
- `/` - Landing page with role selector
- `/community-member/dashboard` - Community member dashboard
- `/researcher-wf/home` - Researcher workflow home
- `/community-member-wf/community-discovery-portal/[id]` - Dynamic community details

### Styling & Theming

#### Tailwind Configuration
- Uses Tailwind CSS v4
- Dark mode: `class` strategy (toggle via `next-themes`)
- Content paths: `app/**/*.{js,ts,jsx,tsx,mdx}`

#### Typography
- **Primary Font**: JetBrains Mono (monospace for entire application)
- Font loading optimized with `next/font/google`
- Alternative fonts available (Fira Code, Source Code Pro) in root layout

### Mock Data Architecture

#### User System
- Mock users defined in `user-context.tsx`
- Each user has: id, name, bio, avatar, stats, online status
- Current user defaults to "Alex Ryder" (USR-734-B)

#### Dataset System  
- Mock datasets linked to users via `authorId`
- Dataset properties: title, description, category, file type, visibility, stats
- Categories: Technology, Agriculture, Ethics, Gaming, Travel, Finance

### TypeScript Configuration
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Path Mapping**: `@/*` maps to project root
- **Strict Mode**: Enabled
- JSX: preserve (handled by Next.js)

### Development Patterns

#### Component Naming
- Standard components: PascalCase (e.g., `UserProfile.tsx`)
- Workflow components: kebab-case with `-wf` suffix (e.g., `community-details-wf.tsx`)
- UI primitives: lowercase (e.g., `button.tsx`, `dialog.tsx`)

#### File Organization
- Group related functionality in subdirectories
- Keep workflow (`-wf`) and standard versions separate
- Use contexts for cross-component state management
- UI components follow shadcn/ui patterns

#### Navigation Architecture
- Role-based sidebar navigation
- Breadcrumb navigation with context management
- Dynamic routing with Next.js App Router
- Theme-aware UI components