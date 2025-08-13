import { 
  Organization, 
  Department, 
  InspectionReport, 
  Quote, 
  User, 
  ApiToken,
  InspectionReportInput,
  QuoteInput
} from '../shared/types';

export interface DataService {
  // Organizations
  getOrganizations(): Promise<Organization[]>;
  getOrganization(id: string): Promise<Organization | null>;
  createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization>;
  updateOrganization(id: string, data: Partial<Organization>): Promise<Organization>;

  // Departments
  getDepartments(orgId: string): Promise<Department[]>;
  getDepartment(orgId: string, id: string): Promise<Department | null>;
  createDepartment(orgId: string, data: Omit<Department, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>): Promise<Department>;
  updateDepartment(orgId: string, id: string, data: Partial<Department>): Promise<Department>;

  // Users
  getUsers(orgId?: string, departmentId?: string): Promise<User[]>;
  getUser(uid: string): Promise<User | null>;
  createUser(data: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>): Promise<User>;
  updateUser(uid: string, data: Partial<User>): Promise<User>;

  // Inspection Reports
  getReports(orgId: string, departmentId?: string, rooferId?: string): Promise<InspectionReport[]>;
  getReport(id: string): Promise<InspectionReport | null>;
  createReport(orgId: string, departmentId: string, rooferId: string, data: InspectionReportInput): Promise<InspectionReport>;
  updateReport(id: string, data: Partial<InspectionReport>): Promise<InspectionReport>;

  // Quotes
  getQuotes(orgId: string, departmentId?: string, rooferId?: string): Promise<Quote[]>;
  getQuote(id: string): Promise<Quote | null>;
  createQuote(orgId: string, departmentId: string, rooferId: string, data: QuoteInput): Promise<Quote>;
  updateQuote(id: string, data: Partial<Quote>): Promise<Quote>;

  // API Tokens
  getApiTokens(): Promise<ApiToken[]>;
  createApiToken(name: string, createdBy: string): Promise<ApiToken>;
  revokeApiToken(id: string): Promise<void>;
}