import { DataService } from './DataService';
import { 
  Organization, 
  Department, 
  InspectionReport, 
  Quote, 
  User, 
  ApiToken,
  InspectionReportInput,
  QuoteInput,
  QuoteLineItem
} from '../shared/types';
import { mockData } from '../mockData/data';

export class MockDataService implements DataService {
  private data = mockData;

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    return [...this.data.organizations];
  }

  async getOrganization(id: string): Promise<Organization | null> {
    return this.data.organizations.find(org => org.id === id) || null;
  }

  async createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const now = this.getCurrentTimestamp();
    const organization: Organization = {
      ...data,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.data.organizations.push(organization);
    return organization;
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    const index = this.data.organizations.findIndex(org => org.id === id);
    if (index === -1) throw new Error('Organization not found');
    
    this.data.organizations[index] = {
      ...this.data.organizations[index],
      ...data,
      updatedAt: this.getCurrentTimestamp(),
    };
    return this.data.organizations[index];
  }

  // Departments
  async getDepartments(orgId: string): Promise<Department[]> {
    return this.data.departments.filter(dept => dept.orgId === orgId);
  }

  async getDepartment(orgId: string, id: string): Promise<Department | null> {
    return this.data.departments.find(dept => dept.id === id && dept.orgId === orgId) || null;
  }

  async createDepartment(orgId: string, data: Omit<Department, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const now = this.getCurrentTimestamp();
    const department: Department = {
      ...data,
      id: this.generateId(),
      orgId,
      createdAt: now,
      updatedAt: now,
    };
    this.data.departments.push(department);
    return department;
  }

  async updateDepartment(orgId: string, id: string, data: Partial<Department>): Promise<Department> {
    const index = this.data.departments.findIndex(dept => dept.id === id && dept.orgId === orgId);
    if (index === -1) throw new Error('Department not found');
    
    this.data.departments[index] = {
      ...this.data.departments[index],
      ...data,
      updatedAt: this.getCurrentTimestamp(),
    };
    return this.data.departments[index];
  }

  // Users
  async getUsers(orgId?: string, departmentId?: string): Promise<User[]> {
    let users = [...this.data.users];
    if (orgId) users = users.filter(user => user.orgId === orgId);
    if (departmentId) users = users.filter(user => user.departmentId === departmentId);
    return users;
  }

  async getUser(uid: string): Promise<User | null> {
    return this.data.users.find(user => user.uid === uid) || null;
  }

  async createUser(data: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = this.getCurrentTimestamp();
    const user: User = {
      ...data,
      uid: this.generateId(),
      createdAt: now,
      updatedAt: now,
    };
    this.data.users.push(user);
    return user;
  }

  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    const index = this.data.users.findIndex(user => user.uid === uid);
    if (index === -1) throw new Error('User not found');
    
    this.data.users[index] = {
      ...this.data.users[index],
      ...data,
      updatedAt: this.getCurrentTimestamp(),
    };
    return this.data.users[index];
  }

  // Inspection Reports
  async getReports(orgId: string, departmentId?: string, rooferId?: string): Promise<InspectionReport[]> {
    let reports = this.data.inspectionReports.filter(report => report.orgId === orgId);
    if (departmentId) reports = reports.filter(report => report.departmentId === departmentId);
    if (rooferId) reports = reports.filter(report => report.rooferId === rooferId);
    return reports;
  }

  async getReport(id: string): Promise<InspectionReport | null> {
    return this.data.inspectionReports.find(report => report.id === id) || null;
  }

  async createReport(orgId: string, departmentId: string, rooferId: string, data: InspectionReportInput): Promise<InspectionReport> {
    const now = this.getCurrentTimestamp();
    const report: InspectionReport = {
      id: this.generateId(),
      orgId,
      departmentId,
      rooferId,
      customer: { ...data.customer, id: this.generateId() },
      address: data.address,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      agritectumContact: data.agritectumContact,
      agritectumPhone: data.agritectumPhone,
      agritectumEmail: data.agritectumEmail,
      roofType: data.roofType,
      roofArea: data.roofArea,
      roofAge: data.roofAge,
      accessConditions: data.accessConditions,
      fallProtection: data.fallProtection,
      technicalExecution: data.technicalExecution,
      drainage: data.drainage,
      edges: data.edges,
      skylights: data.skylights,
      technicalInstallations: data.technicalInstallations,
      insulationType: data.insulationType,
      greenRoof: data.greenRoof,
      solarPanels: data.solarPanels,
      solarPanelsDescription: data.solarPanelsDescription,
      noxReduction: data.noxReduction,
      rainwaterCollection: data.rainwaterCollection,
      recreationalAreas: data.recreationalAreas,
      status: 'DRAFT',
      findings: data.findings,
      recommendations: data.recommendations,
      photos: data.photos,
      economicAssessment: data.economicAssessment,
      createdAt: now,
      updatedAt: now,
    };
    this.data.inspectionReports.push(report);
    return report;
  }

  async updateReport(id: string, data: Partial<InspectionReport>): Promise<InspectionReport> {
    const index = this.data.inspectionReports.findIndex(report => report.id === id);
    if (index === -1) throw new Error('Report not found');
    
    this.data.inspectionReports[index] = {
      ...this.data.inspectionReports[index],
      ...data,
      updatedAt: this.getCurrentTimestamp(),
    };
    return this.data.inspectionReports[index];
  }

  // Quotes
  async getQuotes(orgId: string, departmentId?: string, rooferId?: string): Promise<Quote[]> {
    let quotes = this.data.quotes.filter(quote => quote.orgId === orgId);
    if (departmentId) quotes = quotes.filter(quote => quote.departmentId === departmentId);
    if (rooferId) quotes = quotes.filter(quote => quote.rooferId === rooferId);
    return quotes;
  }

  async getQuote(id: string): Promise<Quote | null> {
    return this.data.quotes.find(quote => quote.id === id) || null;
  }

  async createQuote(orgId: string, departmentId: string, rooferId: string, data: QuoteInput): Promise<Quote> {
    const now = this.getCurrentTimestamp();
    
    const lineItems: QuoteLineItem[] = data.lineItems.map(item => ({
      id: this.generateId(),
      ...item,
      total: item.quantity * item.unitPrice,
    }));

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const total = subtotal + data.tax;

    const quote: Quote = {
      id: this.generateId(),
      orgId,
      departmentId,
      rooferId,
      reportId: data.reportId,
      customer: { ...data.customer, id: this.generateId() },
      lineItems,
      subtotal,
      tax: data.tax,
      total,
      currency: data.currency,
      status: 'DRAFT',
      validUntil: data.validUntil,
      createdAt: now,
      updatedAt: now,
    };
    this.data.quotes.push(quote);
    return quote;
  }

  async updateQuote(id: string, data: Partial<Quote>): Promise<Quote> {
    const index = this.data.quotes.findIndex(quote => quote.id === id);
    if (index === -1) throw new Error('Quote not found');
    
    this.data.quotes[index] = {
      ...this.data.quotes[index],
      ...data,
      updatedAt: this.getCurrentTimestamp(),
    };
    return this.data.quotes[index];
  }

  // API Tokens
  async getApiTokens(): Promise<ApiToken[]> {
    return [...this.data.apiTokens];
  }

  async createApiToken(name: string, createdBy: string): Promise<ApiToken> {
    const token: ApiToken = {
      id: this.generateId(),
      name,
      token: `tk_${Math.random().toString(36).substr(2, 32)}`,
      createdBy,
      createdAt: this.getCurrentTimestamp(),
      isActive: true,
    };
    this.data.apiTokens.push(token);
    return token;
  }

  async revokeApiToken(id: string): Promise<void> {
    const index = this.data.apiTokens.findIndex(token => token.id === id);
    if (index !== -1) {
      this.data.apiTokens[index].isActive = false;
    }
  }
}