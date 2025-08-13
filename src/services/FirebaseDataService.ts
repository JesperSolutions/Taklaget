import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
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

export class FirebaseDataService implements DataService {
  private generateId(): string {
    return doc(collection(db, 'temp')).id;
  }

  private getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // File upload helper
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }

  async deleteFile(url: string): Promise<void> {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  }

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'organizations'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Organization));
  }

  async getOrganization(id: string): Promise<Organization | null> {
    const docRef = doc(db, 'organizations', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Organization : null;
  }

  async createOrganization(data: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'>): Promise<Organization> {
    const now = this.getCurrentTimestamp();
    const docRef = await addDoc(collection(db, 'organizations'), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return { id: docRef.id, ...data, createdAt: now, updatedAt: now };
  }

  async updateOrganization(id: string, data: Partial<Organization>): Promise<Organization> {
    const docRef = doc(db, 'organizations', id);
    const updateData = { ...data, updatedAt: this.getCurrentTimestamp() };
    await updateDoc(docRef, updateData);
    const updated = await this.getOrganization(id);
    if (!updated) throw new Error('Organization not found after update');
    return updated;
  }

  // Departments
  async getDepartments(orgId: string): Promise<Department[]> {
    const q = query(
      collection(db, 'departments'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
  }

  async getDepartment(orgId: string, id: string): Promise<Department | null> {
    const docRef = doc(db, 'departments', id);
    const docSnap = await getDoc(docRef);
    const dept = docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Department : null;
    return dept && dept.orgId === orgId ? dept : null;
  }

  async createDepartment(orgId: string, data: Omit<Department, 'id' | 'orgId' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const now = this.getCurrentTimestamp();
    const docRef = await addDoc(collection(db, 'departments'), {
      ...data,
      orgId,
      createdAt: now,
      updatedAt: now,
    });
    return { id: docRef.id, orgId, ...data, createdAt: now, updatedAt: now };
  }

  async updateDepartment(orgId: string, id: string, data: Partial<Department>): Promise<Department> {
    const docRef = doc(db, 'departments', id);
    const updateData = { ...data, updatedAt: this.getCurrentTimestamp() };
    await updateDoc(docRef, updateData);
    const updated = await this.getDepartment(orgId, id);
    if (!updated) throw new Error('Department not found after update');
    return updated;
  }

  // Users
  async getUsers(orgId?: string, departmentId?: string): Promise<User[]> {
    let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    
    if (orgId) {
      q = query(collection(db, 'users'), where('orgId', '==', orgId), orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    let users = querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    
    if (departmentId) {
      users = users.filter(user => user.departmentId === departmentId);
    }
    
    return users;
  }

  async getUser(uid: string): Promise<User | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { uid: docSnap.id, ...docSnap.data() } as User : null;
  }

  async createUser(data: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = this.getCurrentTimestamp();
    const docRef = await addDoc(collection(db, 'users'), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    return { uid: docRef.id, ...data, createdAt: now, updatedAt: now };
  }

  async updateUser(uid: string, data: Partial<User>): Promise<User> {
    const docRef = doc(db, 'users', uid);
    const updateData = { ...data, updatedAt: this.getCurrentTimestamp() };
    await updateDoc(docRef, updateData);
    const updated = await this.getUser(uid);
    if (!updated) throw new Error('User not found after update');
    return updated;
  }

  // Inspection Reports
  async getReports(orgId: string, departmentId?: string, rooferId?: string): Promise<InspectionReport[]> {
    let q = query(
      collection(db, 'inspectionReports'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InspectionReport));

    if (departmentId) {
      reports = reports.filter(report => report.departmentId === departmentId);
    }
    if (rooferId) {
      reports = reports.filter(report => report.rooferId === rooferId);
    }

    return reports;
  }

  async getReport(id: string): Promise<InspectionReport | null> {
    const docRef = doc(db, 'inspectionReports', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as InspectionReport : null;
  }

  async createReport(orgId: string, departmentId: string, rooferId: string, data: InspectionReportInput): Promise<InspectionReport> {
    const now = this.getCurrentTimestamp();
    const report = {
      orgId,
      departmentId,
      rooferId,
      customer: { ...data.customer, id: this.generateId() },
      address: data.address,
      postalCode: data.postalCode,
      contactPerson: data.contactPerson,
      phone: data.phone,
      email: data.email,
      companyContact: data.companyContact,
      companyPhone: data.companyPhone,
      companyEmail: data.companyEmail,
      roofMaterial: data.roofMaterial,
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
      status: 'DRAFT' as const,
      findings: data.findings,
      recommendations: data.recommendations,
      photos: data.photos,
      economicAssessment: data.economicAssessment,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'inspectionReports'), report);
    return { id: docRef.id, ...report };
  }

  async updateReport(id: string, data: Partial<InspectionReport>): Promise<InspectionReport> {
    const docRef = doc(db, 'inspectionReports', id);
    const updateData = { ...data, updatedAt: this.getCurrentTimestamp() };
    await updateDoc(docRef, updateData);
    const updated = await this.getReport(id);
    if (!updated) throw new Error('Report not found after update');
    return updated;
  }

  // Quotes
  async getQuotes(orgId: string, departmentId?: string, rooferId?: string): Promise<Quote[]> {
    let q = query(
      collection(db, 'quotes'),
      where('orgId', '==', orgId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let quotes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quote));

    if (departmentId) {
      quotes = quotes.filter(quote => quote.departmentId === departmentId);
    }
    if (rooferId) {
      quotes = quotes.filter(quote => quote.rooferId === rooferId);
    }

    return quotes;
  }

  async getQuote(id: string): Promise<Quote | null> {
    const docRef = doc(db, 'quotes', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Quote : null;
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

    const quote = {
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
      status: 'DRAFT' as const,
      validUntil: data.validUntil,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'quotes'), quote);
    return { id: docRef.id, ...quote };
  }

  async updateQuote(id: string, data: Partial<Quote>): Promise<Quote> {
    const docRef = doc(db, 'quotes', id);
    const updateData = { ...data, updatedAt: this.getCurrentTimestamp() };
    await updateDoc(docRef, updateData);
    const updated = await this.getQuote(id);
    if (!updated) throw new Error('Quote not found after update');
    return updated;
  }

  // API Tokens
  async getApiTokens(): Promise<ApiToken[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'apiTokens'), orderBy('createdAt', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ApiToken));
  }

  async createApiToken(name: string, createdBy: string): Promise<ApiToken> {
    const token: Omit<ApiToken, 'id'> = {
      name,
      token: `tk_${Math.random().toString(36).substr(2, 32)}`,
      createdBy,
      createdAt: this.getCurrentTimestamp(),
      isActive: true,
    };
    const docRef = await addDoc(collection(db, 'apiTokens'), token);
    return { id: docRef.id, ...token };
  }

  async revokeApiToken(id: string): Promise<void> {
    const docRef = doc(db, 'apiTokens', id);
    await updateDoc(docRef, { isActive: false });
  }
}