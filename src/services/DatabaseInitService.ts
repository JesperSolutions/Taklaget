import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  writeBatch,
  query,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  Organization, 
  Department, 
  User, 
  InspectionReport, 
  Quote,
  ApiToken 
} from '../shared/types';

export class DatabaseInitService {
  private static instance: DatabaseInitService;
  private isInitialized = false;

  static getInstance(): DatabaseInitService {
    if (!DatabaseInitService.instance) {
      DatabaseInitService.instance = new DatabaseInitService();
    }
    return DatabaseInitService.instance;
  }

  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) {
      console.log('Database already initialized, skipping...');
      return;
    }

    try {
      console.log('Checking database structure...');
      
      // Check if database has any data
      const hasData = await this.checkIfDatabaseHasData();
      
      if (hasData) {
        console.log('Database already contains data, skipping initialization');
        this.isInitialized = true;
        return;
      }

      console.log('Initializing database with required structure and sample data...');
      
      // Create collections and add sample data
      await this.createCollections();
      await this.seedSampleData();
      
      this.isInitialized = true;
      console.log('Database initialization completed successfully!');
      
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  private async checkIfDatabaseHasData(): Promise<boolean> {
    try {
      // Check if database has been initialized by looking for the system document
      const systemQuery = await getDocs(query(collection(db, '_system'), limit(1)));
      if (!systemQuery.empty) {
        const systemDoc = systemQuery.docs[0];
        if (systemDoc.data().initialized) {
          return true;
        }
      }
      
      // Also check if any main collections have data
      const collections = ['organizations', 'users', 'departments'];
      
      for (const collectionName of collections) {
        const querySnapshot = await getDocs(query(collection(db, collectionName), limit(1)));
        if (!querySnapshot.empty) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.warn('Error checking database data:', error);
      return false;
    }
  }

  private async createCollections(): Promise<void> {
    // Create a system document to mark database as initialized
    const initDoc = doc(collection(db, '_system'));
    await setDoc(initDoc, {
      initialized: true,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }

  private async seedSampleData(): Promise<void> {
    console.log('Seeding sample data...');
    
    // Create sample organization
    const sampleOrg: Omit<Organization, 'id' | 'createdAt' | 'updatedAt'> = {
      name: 'Taklaget AS',
      description: 'Professional roofing and construction company',
      address: 'Sample Address 123',
      postalCode: '0001',
      city: 'Oslo',
      country: 'Norway',
      phone: '+47 123 45 678',
      email: 'info@taklaget.no',
      website: 'https://taklaget.no',
      organizationNumber: '123456789',
      vatNumber: 'NO123456789MVA',
      contactPerson: 'John Doe',
      contactPhone: '+47 123 45 679',
      contactEmail: 'john@taklaget.no',
      logo: '',
      isActive: true
    };

    const orgRef = doc(collection(db, 'organizations'));
    await setDoc(orgRef, {
      ...sampleOrg,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const orgId = orgRef.id;

    // Create sample department
    const sampleDept: Omit<Department, 'id' | 'orgId' | 'createdAt' | 'updatedAt'> = {
      name: 'Roofing Department',
      description: 'Main roofing operations',
      address: 'Department Address 456',
      postalCode: '0002',
      city: 'Oslo',
      country: 'Norway',
      phone: '+47 123 45 680',
      email: 'roofing@taklaget.no',
      manager: 'Jane Smith',
      managerPhone: '+47 123 45 681',
      managerEmail: 'jane@taklaget.no',
      isActive: true
    };

    const deptRef = doc(collection(db, 'departments'));
    await setDoc(deptRef, {
      ...sampleDept,
      orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const deptId = deptRef.id;

    // Create sample user
    const sampleUser: Omit<User, 'uid' | 'createdAt' | 'updatedAt'> = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@taklaget.no',
      phone: '+47 123 45 682',
      role: 'ROOFER',
      orgId,
      departmentId: deptId,
      isActive: true,
      profilePicture: '',
      skills: ['Roofing', 'Construction', 'Safety'],
      certifications: ['Safety Certificate', 'Roofing License'],
      hireDate: '2024-01-01'
    };

    const userRef = doc(collection(db, 'users'));
    await setDoc(userRef, {
      ...sampleUser,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log('Sample data created successfully!');
  }

  // Method to reset database (useful for development)
  async resetDatabase(): Promise<void> {
    console.warn('Resetting database - this will delete all data!');
    this.isInitialized = false;
    
    // Note: In production, you might want to add confirmation or admin checks
    // For now, this is a development helper
    
    // You can implement collection deletion here if needed
    // But be careful with this in production!
  }
}
