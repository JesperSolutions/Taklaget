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
- **Backend**: Firebase (Firestore + Storage + Auth)
- **Data Layer**: Firebase service with mock fallback
- **Authentication**: Firebase Auth with role-based access
- **File Storage**: Firebase Storage for photos
- **Email Service**: Configurable email service (mock/production)
- **State Management**: React Context
- **Validation**: Zod schemas
- **UI Components**: Custom components with Lucide React icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   
3. Configure Firebase:
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase config to `.env`

4. Install dependencies:
   ```bash
   npm install
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser to `http://localhost:5173`

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

## Firebase Integration

The application is now Firebase-ready with:

### 🔥 **Firebase Services Implemented:**
- **Authentication**: Email/password with role-based access
- **Firestore**: Document-based data storage
- **Storage**: Photo upload and management
- **Security Rules**: Role-based data access

### 📁 **File Structure:**
```
src/
├── config/firebase.ts          # Firebase configuration
├── services/
│   ├── FirebaseDataService.ts  # Production data service
│   ├── FirebaseAuthService.ts  # Production auth service
│   ├── MockDataService.ts      # Development fallback
│   └── EmailService.ts         # Email functionality
```

### 🔄 **Switching to Firebase:**
1. Configure environment variables in `.env`
2. Update `src/contexts/DataContext.tsx` to use `FirebaseDataService`
3. Update `src/contexts/AuthContext.tsx` to use `FirebaseAuthService`
4. Deploy Firestore security rules
5. Set up Firebase Storage rules

### 📧 **Email Integration:**
- Mock email service for development
- Firebase Cloud Functions ready for production
- PDF generation hooks included
- Customer email integration

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
4. Implement in both `MockDataService` and `FirebaseDataService`
5. Create UI components and pages
6. Add proper RBAC checks
7. Add email/PDF functionality if needed

## Deployment

The application is ready for deployment to any static hosting service:

```bash
npm run build
```

The `dist` folder contains the production build.

### Firebase Deployment

For Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## Contributing

1. Follow the existing code structure
2. Maintain type safety throughout
3. Add proper error handling
4. Include validation for all user inputs
5. Respect the RBAC model
6. Keep the mock data service in sync with any interface changes

## License

Private - Taklaget ApS