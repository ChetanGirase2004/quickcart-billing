# AI Development Rules

This document outlines the technology stack and library usage rules for this application. Following these guidelines ensures consistency, maintainability, and proper architecture.

## Tech Stack Overview

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **UI Components**: shadcn/ui with Radix UI primitives and Tailwind CSS
- **State Management**: React Context API with @tanstack/react-query for server state
- **Form Handling**: react-hook-form with zod for validation
- **Styling**: Tailwind CSS with tailwind-merge and clsx for utility class management
- **Icons**: Lucide React
- **Testing**: Vitest with Testing Library
- **Notifications**: Sonner and Radix UI Toast

## Library Usage Rules

### UI & Styling
- ✅ Use **shadcn/ui** components whenever possible for consistent UI elements
- ✅ Style components using **Tailwind CSS** classes exclusively
- ✅ Use **lucide-react** for all icons
- ❌ Avoid external UI libraries unless absolutely necessary
- ❌ Do not use inline styles or CSS modules unless required for dynamic styling

### State Management
- ✅ Use **React Context** for global application state (Auth, Cart, etc.)
- ✅ Use **@tanstack/react-query** for server state management and caching
- ✅ Use **useState/useReducer** for local component state
- ❌ Avoid Redux or Zustand unless a complex state management scenario requires it

### Forms & Validation
- ✅ Use **react-hook-form** for all form handling
- ✅ Use **zod** for form validation schema definition
- ❌ Avoid uncontrolled components for forms
- ❌ Do not use HTML form validation only

### Data Fetching
- ✅ Use **@tanstack/react-query** for all API calls
- ✅ Structure API calls in dedicated service files
- ✅ Handle loading and error states appropriately with query hooks
- ❌ Avoid direct fetch/XMLHttpRequest calls in components

### Routing
- ✅ Use **react-router-dom** for all routing needs
- ✅ Define routes in **src/App.tsx** with appropriate layouts
- ✅ Use route-based code splitting for performance when applicable
- ❌ Do not use anchor tags for navigation within the app

### Utilities & Helpers
- ✅ Use **date-fns** for date manipulation
- ✅ Use **clsx** or **tailwind-merge** for conditional classnames
- ✅ Use **framer-motion** for animations when needed
- ❌ Avoid adding utility libraries that duplicate existing functionality

### Testing
- ✅ Write unit tests using **Vitest** and **@testing-library/react**
- ✅ Test components in isolation with mock data
- ✅ Ensure critical business logic is covered by tests
- ❌ Do not skip testing components with business logic

### File Organization
- ✅ Place pages in **src/pages/** with appropriate role-based subdirectories
- ✅ Place reusable components in **src/components/**
- ✅ Place context providers in **src/contexts/**
- ✅ Place shared types/interfaces in **src/types/**
- ✅ Place utility functions in **src/lib/**

## Component Development Guidelines

1. **Functional Components**: Always use functional components with TypeScript interfaces
2. **Props**: Define prop types using TypeScript interfaces
3. **Hooks**: Extract custom hooks for reusable logic
4. **Accessibility**: Ensure all components are accessible (ARIA labels, keyboard navigation)
5. **Responsiveness**: Design components to work on all screen sizes using Tailwind responsive classes

## Best Practices

- Keep components small and focused on a single responsibility
- Prefer composition over inheritance
- Use meaningful variable and function names
- Comment complex logic but avoid over-commenting obvious code
- Follow the existing code style and patterns
- Destructure props and state variables for cleaner code
- Use early returns to reduce nesting