import { 
  Organization, 
  Department, 
  User, 
  InspectionReport, 
  Quote, 
  ApiToken 
} from '../shared/types';

export const mockData = {
  organizations: [
    {
      id: 'taklaget',
      name: 'Taklaget ApS',
      address: 'Hovedgade 123, 2100 København Ø',
      phone: '+45 12 34 56 78',
      email: 'kontakt@taklaget.dk',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  ] as Organization[],

  departments: [
    {
      id: 'dept-1',
      orgId: 'taklaget',
      name: 'København',
      description: 'København og omegn',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'dept-2',
      orgId: 'taklaget',
      name: 'Aarhus',
      description: 'Aarhus og Jylland',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  ] as Department[],

  users: [
    {
      uid: 'super-admin-1',
      email: 'admin@taklaget.dk',
      name: 'Super Administrator',
      role: 'SUPER_ADMIN' as const,
      orgId: 'taklaget',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      uid: 'org-admin-1',
      email: 'manager@taklaget.dk',
      name: 'Lars Nielsen',
      role: 'ORG_ADMIN' as const,
      orgId: 'taklaget',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      uid: 'roofer-1',
      email: 'peter@taklaget.dk',
      name: 'Peter Hansen',
      role: 'ROOFER' as const,
      orgId: 'taklaget',
      departmentId: 'dept-1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      uid: 'roofer-2',
      email: 'morten@taklaget.dk',
      name: 'Morten Andersen',
      role: 'ROOFER' as const,
      orgId: 'taklaget',
      departmentId: 'dept-2',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  ] as User[],

  inspectionReports: [
    {
      id: 'report-1',
      orgId: 'taklaget',
      departmentId: 'dept-1',
      rooferId: 'roofer-1',
      customer: {
        id: 'customer-1',
        name: 'Jens Olsen',
        email: 'jens@example.com',
        phone: '+45 98 76 54 32',
        address: 'Nørrebrogade 45, 2200 København N',
      },
      address: 'Nørrebrogade 45, 2200 København N',
      roofType: 'Tegl tag',
      status: 'COMPLETED' as const,
      findings: 'Flere løse tagsten observeret. Tagrender har mindre skader.',
      recommendations: 'Udskiftning af 15-20 tagsten anbefales. Reparation af tagrender.',
      photos: [
        'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
    }
  ] as InspectionReport[],

  quotes: [
    {
      id: 'quote-1',
      orgId: 'taklaget',
      departmentId: 'dept-1',
      rooferId: 'roofer-1',
      reportId: 'report-1',
      customer: {
        id: 'customer-1',
        name: 'Jens Olsen',
        email: 'jens@example.com',
        phone: '+45 98 76 54 32',
        address: 'Nørrebrogade 45, 2200 København N',
      },
      lineItems: [
        {
          id: 'line-1',
          description: 'Udskiftning af tagsten',
          quantity: 20,
          unitPrice: 125,
          total: 2500,
        },
        {
          id: 'line-2',
          description: 'Reparation af tagrender',
          quantity: 1,
          unitPrice: 1500,
          total: 1500,
        },
        {
          id: 'line-3',
          description: 'Arbejdsløn',
          quantity: 8,
          unitPrice: 450,
          total: 3600,
        }
      ],
      subtotal: 7600,
      tax: 1900,
      total: 9500,
      currency: 'DKK',
      status: 'SENT' as const,
      validUntil: '2024-02-15T23:59:59Z',
      createdAt: '2024-01-16T09:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
    }
  ] as Quote[],

  apiTokens: [] as ApiToken[],
};