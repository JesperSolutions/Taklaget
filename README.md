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
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Admin SDK service account

### Installation

1. Clone the repository

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
   
3. **🔒 SECURITY SETUP - CRITICAL:**
   
   **For Frontend (Public Config):**
   - Go to Firebase Console > Project Settings > General
   - Copy your web app config to `.env`:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... etc
   ```
   
   **For Backend (Private - NEVER COMMIT):**
   - Go to Firebase Console > Project Settings > Service Accounts
   - Generate new private key (if you exposed the old one)
   - Set environment variables in your deployment platform:
   ```bash
   # In your deployment platform (Vercel, Netlify, etc.)
   FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   FIREBASE_ADMIN_CLIENT_EMAIL="your-service@project.iam.gserviceaccount.com"
   FIREBASE_ADMIN_PROJECT_ID="your-project-id"
   ```
   
4. Install Firebase CLI and login:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

5. Configure Firebase:
   - Create a Firebase project (or use existing: taklaget-mvp)
   - Enable Authentication, Firestore, and Storage
   - Update `.firebaserc` with your project ID

6. Install dependencies:
   ```bash
   npm install
   cd functions && npm install && cd ..
   ```

### 🔒 **SECURITY BEST PRACTICES:**

1. **NEVER commit `.env` files** - they're in `.gitignore`
2. **NEVER commit service account keys** - use environment variables
3. **Rotate keys immediately** if accidentally exposed
4. **Use different keys** for development and production
5. **Set up Firebase security rules** before going live

### 🚀 **Deployment Security:**

**For Vercel:**
```bash
vercel env add FIREBASE_ADMIN_PRIVATE_KEY
vercel env add FIREBASE_ADMIN_CLIENT_EMAIL
vercel env add FIREBASE_ADMIN_PROJECT_ID
```

**For Netlify:**
```bash
netlify env:set FIREBASE_ADMIN_PRIVATE_KEY "your_private_key"
netlify env:set FIREBASE_ADMIN_CLIENT_EMAIL "your_email"
netlify env:set FIREBASE_ADMIN_PROJECT_ID "your_project_id"
```

### Development with Firebase Emulators

1. Start Firebase emulators and development server:
   ```bash
   npm run dev:full
   ```
   
   Or start them separately:
   ```bash
   # Terminal 1: Start Firebase emulators
   npm run dev:emulators
   
   # Terminal 2: Start Vite dev server
   npm run dev
   ```

2. Access the application:
   - **Frontend**: `http://localhost:5173`
   - **Firebase Emulator UI**: `http://localhost:4000`
   - **Firestore Emulator**: `http://localhost:8080`

### Production Deployment

1. Build and deploy to Firebase:
   ```bash
   npm run firebase:deploy
   ```

2. Deploy only hosting:
   ```bash
   npm run firebase:deploy:hosting
   ```

3. Deploy only functions:
   ```bash
   npm run firebase:deploy:functions
   ```

### Demo Users

The application comes with pre-seeded demo users:

| Email | Role | Password | Access Level |
|-------|------|----------|--------------|
| admin@taklaget.dk | Super Admin | any | Full system access |
| manager@taklaget.dk | Organization Admin | any | Taklaget organization |
| peter@taklaget.dk | Roofer | any | København department |
| morten@taklaget.dk | Roofer | any | Aarhus department |

*Note: Mock authentication accepts any password*

### Firebase Emulator Suite

The project is configured to work with Firebase Local Emulator Suite for development:

- **Authentication Emulator**: Port 9099
- **Firestore Emulator**: Port 8080  
- **Storage Emulator**: Port 9199
- **Functions Emulator**: Port 5001
- **Hosting Emulator**: Port 5000
- **Emulator UI**: Port 4000

### Seeding Data

To view the current mock data structure:

```bash
npm run seed
```

### Email Configuration

For email functionality in production:

1. Configure email credentials:
   ```bash
   firebase functions:config:set email.user="your-email@gmail.com" email.password="your-app-password"
   ```

2. Or set environment variables in your deployment environment.

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Data)
├── mockData/           # Mock data for development
├── pages/              # Page components
├── services/           # Data services and interfaces
├── shared/             # Shared types and schemas
├── main.tsx           # Application entry point
├── functions/          # Firebase Cloud Functions
├── firestore.rules     # Firestore security rules
├── storage.rules       # Storage security rules
├── firebase.json       # Firebase configuration
└── .firebaserc        # Firebase project configuration
```

## Firebase Integration

### 🔥 **Production Setup:**

1. **Switch to Firebase Services:**
   ```typescript
   // In src/contexts/DataContext.tsx
   const dataService = new FirebaseDataService();
   
   // In src/contexts/AuthContext.tsx  
   const authService = new FirebaseAuthService();
   ```

2. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Deploy Storage Rules:**
   ```bash
   firebase deploy --only storage
   ```

### 📧 **Email Integration:**
- Development: Uses `MockEmailService`
- Production: Uses `FirebaseEmailService` with Cloud Functions
- PDF generation hooks included for future implementation

### 🔒 **Security Rules:**
- **Role-based access control** implemented in Firestore rules
- **Organization-level data isolation**
- **User-specific data access** for roofers
- **Admin privileges** for super admins and org admins

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

### 🚀 **Available Scripts:**
- `npm run dev` - Development server only
- `npm run dev:emulators` - Firebase emulators only  
- `npm run dev:full` - Both emulators and dev server
- `npm run firebase:deploy` - Deploy everything
- `npm run firebase:deploy:hosting` - Deploy hosting only
- `npm run firebase:deploy:functions` - Deploy functions only

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