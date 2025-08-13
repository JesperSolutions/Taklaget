#!/usr/bin/env node

/**
 * Firebase Setup Script
 * This script helps you set up your Firebase project with initial data
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const db = admin.firestore();

// Sample data to seed your database
const sampleData = {
  organizations: [
    {
      id: 'taklaget',
      name: 'Taklaget ApS',
      address: 'Hovedgade 123, 2100 København Ø',
      phone: '+45 12 34 56 78',
      email: 'kontakt@taklaget.dk',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],
  
  departments: [
    {
      id: 'dept-1',
      orgId: 'taklaget',
      name: 'København',
      description: 'København og omegn',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'dept-2',
      orgId: 'taklaget',
      name: 'Aarhus',
      description: 'Aarhus og Jylland',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ],

  users: [
    {
      uid: 'super-admin-1',
      email: 'admin@taklaget.dk',
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
      orgId: 'taklaget',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: 'org-admin-1',
      email: 'manager@taklaget.dk',
      name: 'Lars Nielsen',
      role: 'ORG_ADMIN',
      orgId: 'taklaget',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: 'roofer-1',
      email: 'peter@taklaget.dk',
      name: 'Peter Hansen',
      role: 'ROOFER',
      orgId: 'taklaget',
      departmentId: 'dept-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      uid: 'roofer-2',
      email: 'morten@taklaget.dk',
      name: 'Morten Andersen',
      role: 'ROOFER',
      orgId: 'taklaget',
      departmentId: 'dept-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed organizations
    for (const org of sampleData.organizations) {
      await db.collection('organizations').doc(org.id).set(org);
      console.log(`✅ Created organization: ${org.name}`);
    }

    // Seed departments
    for (const dept of sampleData.departments) {
      await db.collection('departments').doc(dept.id).set(dept);
      console.log(`✅ Created department: ${dept.name}`);
    }

    // Seed users
    for (const user of sampleData.users) {
      await db.collection('users').doc(user.uid).set(user);
      console.log(`✅ Created user: ${user.name} (${user.email})`);
    }

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Demo Users Created:');
    sampleData.users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - ${user.role}`);
    });
    
    console.log('\n🔐 You can now log in with any of these emails and any password (mock auth)');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seeding
seedDatabase();