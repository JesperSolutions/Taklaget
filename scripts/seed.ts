import { mockData } from '../src/mockData/data';

console.log('🌱 Seeding mock data...');

console.log('\n📊 Current mock data:');
console.log(`Organizations: ${mockData.organizations.length}`);
console.log(`Departments: ${mockData.departments.length}`);
console.log(`Users: ${mockData.users.length}`);
console.log(`Inspection Reports: ${mockData.inspectionReports.length}`);
console.log(`Quotes: ${mockData.quotes.length}`);
console.log(`API Tokens: ${mockData.apiTokens.length}`);

console.log('\n👥 Demo Users:');
mockData.users.forEach(user => {
  console.log(`- ${user.name} (${user.email}) - ${user.role}`);
});

console.log('\n🏢 Organizations:');
mockData.organizations.forEach(org => {
  console.log(`- ${org.name} (${org.id})`);
});

console.log('\n🏬 Departments:');
mockData.departments.forEach(dept => {
  console.log(`- ${dept.name} (${dept.orgId})`);
});

console.log('\n📋 Sample Reports:');
mockData.inspectionReports.forEach(report => {
  console.log(`- ${report.customer.name} - ${report.status} (${report.roofType})`);
});

console.log('\n💰 Sample Quotes:');
mockData.quotes.forEach(quote => {
  console.log(`- ${quote.customer.name} - ${quote.total} ${quote.currency} (${quote.status})`);
});

console.log('\n✅ Mock data is ready!');
console.log('\nTo test the application:');
console.log('1. Run: npm run dev');
console.log('2. Navigate to the login page');
console.log('3. Use any of the demo user credentials shown above');
console.log('4. Password can be anything (mock authentication)');