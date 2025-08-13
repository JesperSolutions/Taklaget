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
        name: 'DANDY Business Park',
        email: 'fwk@dandybusinesspark.dk',
        phone: '+4529815911',
        address: 'Resilience House, Lysholt Allé 10, 7100 Vejle',
      },
      address: 'Resilience House, Lysholt Allé 10, 7100 Vejle',
      contactPerson: 'Flemming Krarup & Michael Juul Andersen',
      phone: '+4529815911',
      email: 'fwk@dandybusinesspark.dk - mja@dandybusinesspark.dk',
      agritectumContact: 'Flemming Adolfsen',
      agritectumPhone: '+4521619540',
      agritectumEmail: 'flemming.adolfsen@agritectum.com',
      roofType: 'Tagpap',
      roofArea: 490,
      roofAge: 'Ikke angivet',
      accessConditions: 'Adgang med lang stige',
      fallProtection: true,
      technicalExecution: 'OK',
      drainage: 'UV tagbrønde',
      edges: 'OK',
      skylights: 'Et enkelt OK',
      technicalInstallations: 'OK',
      insulationType: 'EPS og Mineraluld',
      greenRoof: true,
      solarPanels: true,
      solarPanelsDescription: '2 mindre områder, limet løsning',
      noxReduction: false,
      rainwaterCollection: false,
      recreationalAreas: false,
      status: 'COMPLETED' as const,
      findings: 'Taget virker generelt i god stand, men der er detaljer omkring folder, brønde og vedligeholdelse af det grønne tag som bør efterses nærmere.',
      recommendations: '1. Taget virker generelt i god stand, men der er detaljer omkring folder, brønde og vedligeholdelse af det grønne tag som bør efterses nærmere af en autoriseret tagdækker.\n2. Vi vil anbefale at der laves en serviceaftale for taget således at taget løbende efterses og eventuelle fejl, mangler og slitage udbedres.\n3. Vi vil anbefale at der udføres ekstraordinære test af fugtighed i isoleringen så eventuelle genbrug opdages i tide.\n4. Vi anbefaler at udarbejde en ESG-handlingsplan for taget, så det kan understøtte bæredygtighedstiltag i DANDY Business Park.',
      photos: [
        'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
        'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
        'https://images.pexels.com/photos/159045/the-interior-of-the-repair-interior-design-159045.jpeg'
      ],
      economicAssessment: 'Økonomisk vurdering følger efter detaljeret gennemgang.',
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