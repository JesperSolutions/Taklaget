# Taklaget MVP

A TypeScript React application for roof inspection and quote management, built with a mock-first approach for easy Firebase integration.

## Features

- **Multi-tenant Role-based Access Control (RBAC)**
  - Super Admin: Full system access
  - Organization Admin: Organization-level management
  - Roofer: Personal reports and quotes

- **Inspection Reports Management**
  - Create detailed roof inspection reports
  - Customer information tracking
  - Photo documentation support
  - Status tracking (Draft, In Progress, Completed, Approved)

- **Quote Management**
  - Create detailed quotes with line items
  - Link quotes to inspection reports
  - Multiple currency support
  - Status tracking (Draft, Sent, Accepted, Rejected)

- **User Management**
  - Organization and department hierarchy
  - Role-based permissions
  - User profile management

## Architecture

- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Data Layer**: Mock service with Firebase-ready interface
- **Authentication**: Mock authentication (Firebase Auth ready)
- **State Management**: React Context
- **Validation**: Zod schemas
- **UI Components**: Custom components with Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Demo Users

The application comes with pre-seeded demo users:

| Email | Role | Password | Access Level |
|-------|------|----------|--------------|
| admin@taklaget.dk | Super Admin | any | Full system access |
| manager@taklaget.dk | Organization Admin | any | Taklaget organization |
| peter@taklaget.dk | Roofer | any | København department |
| morten@taklaget.dk | Roofer | any | Aarhus department |

*Note: Mock authentication accepts any password*

### Seeding Data

To view the current mock data structure:

```bash
npm run seed
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Data)
├── mockData/           # Mock data for development
├── pages/              # Page components
├── services/           # Data services and interfaces
├── shared/             # Shared types and schemas
└── main.tsx           # Application entry point
```

## Data Service Interface

The application uses a `DataService` interface that abstracts data operations:

```typescript
interface DataService {
  getOrganizations(): Promise<Organization[]>;
  getDepartments(orgId: string): Promise<Department[]>;
  getReports(orgId: string, deptId?: string, rooferId?: string): Promise<InspectionReport[]>;
  createReport(orgId: string, deptId: string, rooferId: string, data: InspectionReportInput): Promise<InspectionReport>;
  // ... more methods
}
```

Currently implemented with `MockDataService` for development. Ready for `FirebaseDataService` implementation.

## Firebase Integration (Future)

To integrate with Firebase:

1. Install Firebase SDK:
   ```bash
   npm install firebase
   ```

2. Create `FirebaseDataService` implementing the same `DataService` interface

3. Update the data provider in `src/contexts/DataContext.tsx`

4. Configure Firebase Auth in the auth service

5. Set up Firestore security rules matching the RBAC model

## Role-Based Access Control

### Permission Matrix

| Feature | Super Admin | Org Admin | Roofer |
|---------|-------------|-----------|--------|
| View all organizations | ✅ | ❌ | ❌ |
| Manage users | ✅ | ✅ (org only) | ❌ |
| View all reports | ✅ | ✅ (org only) | ✅ (own only) |
| Create reports | ✅ | ✅ | ✅ |
| View all quotes | ✅ | ✅ (org only) | ✅ (own only) |
| Create quotes | ✅ | ✅ | ✅ |
| API token management | ✅ | ❌ | ❌ |

### Data Visibility Rules

- **Roofer**: Only sees own reports and quotes within their department
- **Org Admin**: Sees all data within their organization
- **Super Admin**: Sees all data across all organizations

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run seed` - Display mock data structure
- `npm test` - Run tests

### Code Quality

- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Zod** for runtime validation

### Adding New Features

1. Define types in `src/shared/types.ts`
2. Add validation schemas in `src/shared/schemas.ts`
3. Extend the `DataService` interface
4. Implement in `MockDataService`
5. Create UI components and pages
6. Add proper RBAC checks

## Deployment

The application is ready for deployment to any static hosting service:

```bash
npm run build
```

The `dist` folder contains the production build.

## Contributing

1. Follow the existing code structure
2. Maintain type safety throughout
3. Add proper error handling
4. Include validation for all user inputs
5. Respect the RBAC model
6. Keep the mock data service in sync with any interface changes

## License

Private - Taklaget ApS