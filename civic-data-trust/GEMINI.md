# GEMINI.md

## Project Overview

This is a Next.js project bootstrapped with `create-next-app`. It appears to be a web application for a "Civic Data Trust," a platform for secure and collaborative data sharing.

The project uses the following technologies:

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **UI:** Radix UI, shadcn/ui (inferred from `tailwind.config.ts` and component structure)
*   **Charting:** Recharts
*   **Authentication:** The project uses a context-based authentication system (`app/components/contexts/auth-context.tsx`).

The application features role-based access control, with different dashboards and workflows for "community members" and "researchers." The main entry point for the application is `app/page.tsx`, which presents a welcome screen and a dialog to select a user role.

## Building and Running

To get the development environment running, use the following command:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

Other useful commands are:

*   `npm run build`: To build the application for production.
*   `npm run start`: To start the production server.
*   `npm run lint`: To lint the code and check for errors.

## Development Conventions

*   **Directory Structure:** The project follows the Next.js `app` directory structure.
    *   `app/(auth)`: Contains authentication-related pages like sign-in, sign-up, and reset-password.
    *   `app/(dashboard)`: Contains the main dashboard, with subdirectories for different user roles (e.g., `community-member`, `researcher`).
    *   `app/components`: Contains reusable React components.
    *   `app/lib`: Contains utility functions and API-related code.
*   **Styling:** The project uses Tailwind CSS for styling. The configuration is in `tailwind.config.ts`. It also uses a `ThemeProvider` for light and dark mode support.
*   **State Management:** The project uses React's Context API for state management, as seen with the `AuthProvider` and `BreadcrumbProvider`.
*   **Routing:** The project uses Next.js's file-based routing.
*   **Linting:** The project uses ESLint for code linting, with the configuration in `eslint.config.mjs`.
