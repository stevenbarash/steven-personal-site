# Architecture Documentation

## Overview

This project follows Next.js 15 and TypeScript best practices with a modular, component-based architecture. The application has been refactored from a monolithic page component into a well-structured, maintainable codebase.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main page (now clean and minimal)
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   │   └── Windows95Layout.tsx
│   ├── ui/               # UI components
│   │   ├── win95/        # Windows 95 themed components
│   │   │   ├── WindowTitleBar.tsx
│   │   │   ├── MenuBar.tsx
│   │   │   ├── ProfileSection.tsx
│   │   │   ├── FileSystemExplorer.tsx
│   │   │   ├── Terminal.tsx
│   │   │   ├── Taskbar.tsx
│   │   │   └── index.ts
│   │   └── ...           # Other UI components
│   └── DarkModeToggle.tsx
├── data/                  # Data layer
│   └── profile.ts        # Profile and social data
├── types/                 # TypeScript type definitions
│   └── index.ts
├── constants/             # Application constants
│   └── index.ts
└── lib/                   # Utility functions
    └── utils.ts
```

## Key Architectural Principles

### 1. **Separation of Concerns**
- **Data Layer**: All hardcoded data moved to `src/data/`
- **Presentation Layer**: UI components in `src/components/ui/`
- **Business Logic**: Separated from presentation components
- **Configuration**: Centralized in `src/constants/`

### 2. **Type Safety**
- Comprehensive TypeScript interfaces in `src/types/`
- Strict typing for all components and data structures
- Type-safe props and event handlers

### 3. **Component Composition**
- Small, focused components with single responsibilities
- Reusable UI components with proper prop interfaces
- Layout components for structural organization

### 4. **Maintainability**
- Constants extracted to avoid magic strings
- Consistent naming conventions
- Clear component hierarchy

## Component Architecture

### Layout Components
- **Windows95Layout**: Wraps the entire Windows 95 interface
- Handles window title bar and menu bar consistently

### UI Components
Each Windows 95 component is:
- **Focused**: Single responsibility
- **Reusable**: Accepts props for customization
- **Accessible**: Includes ARIA labels and keyboard support
- **Type-safe**: Full TypeScript support

### Data Flow
```
Constants → Types → Data → Components → Page
```

## Best Practices Implemented

### 1. **Next.js Best Practices**
- App Router structure
- Server components by default
- Client components only where needed
- Proper metadata configuration

### 2. **TypeScript Best Practices**
- Strict type checking enabled
- Comprehensive interface definitions
- Type-safe component props
- Proper import/export patterns

### 3. **React Best Practices**
- Functional components with hooks
- Proper prop drilling prevention
- Component composition over inheritance
- Accessibility considerations

### 4. **Code Organization**
- Feature-based folder structure
- Clear separation of concerns
- Consistent naming conventions
- Modular component design

## Development Workflow

### Available Scripts
```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
npm run type-check   # TypeScript type checking
npm run type-check:watch  # TypeScript watching
```

### Quality Assurance
- ESLint for code quality
- TypeScript for type safety
- Build-time validation
- Consistent formatting

## Benefits of This Architecture

1. **Maintainability**: Easy to modify and extend
2. **Reusability**: Components can be reused across the app
3. **Type Safety**: Catch errors at compile time
4. **Performance**: Optimized bundle size and loading
5. **Developer Experience**: Clear structure and tooling
6. **Scalability**: Easy to add new features

## Future Enhancements

- Add unit tests for components
- Implement error boundaries
- Add loading states
- Implement proper state management if needed
- Add more accessibility features 