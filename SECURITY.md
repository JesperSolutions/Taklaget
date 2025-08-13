# 🔒 Security Guidelines

## Firebase Security Best Practices

### 1. Environment Variables

**✅ SAFE TO COMMIT (Frontend Config):**
```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

**❌ NEVER COMMIT (Backend Config):**
```bash
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PROJECT_ID=
```

### 2. Service Account Keys

- **Generate separate keys** for development and production
- **Store in environment variables** on your deployment platform
- **Rotate keys regularly** (every 90 days recommended)
- **Revoke immediately** if accidentally exposed

### 3. Firestore Security Rules

Our rules implement role-based access control:

```javascript
// Users can only access their organization's data
function getUserOrgId() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.orgId;
}

// Super admins have full access
function isSuperAdmin() {
  return getUserRole() == 'SUPER_ADMIN';
}
```

### 4. Storage Security Rules

```javascript
// Only authenticated users can upload
// Only admins can delete files
match /reports/{reportId}/{allPaths=**} {
  allow read: if isAuthenticated();
  allow write: if isAuthenticated();
  allow delete: if isSuperAdmin() || isOrgAdmin();
}
```

### 5. Cloud Functions Security

- Functions automatically validate authentication
- Role-based access checks in function code
- Email logging for audit trails
- Input validation and sanitization

### 6. Development vs Production

**Development:**
- Use Firebase Emulators
- Separate test data
- Local environment variables

**Production:**
- Real Firebase project
- Environment variables in deployment platform
- Monitoring and logging enabled

## 🚨 If Keys Are Compromised

1. **Immediately revoke** the compromised key in Firebase Console
2. **Generate new key** with minimal required permissions
3. **Update environment variables** in all deployment platforms
4. **Review access logs** for unauthorized usage
5. **Consider rotating all related credentials**

## Deployment Platforms

### Vercel
```bash
vercel env add FIREBASE_ADMIN_PRIVATE_KEY
vercel env add FIREBASE_ADMIN_CLIENT_EMAIL
```

### Netlify
```bash
netlify env:set FIREBASE_ADMIN_PRIVATE_KEY "your_key"
netlify env:set FIREBASE_ADMIN_CLIENT_EMAIL "your_email"
```

### Railway
```bash
railway variables set FIREBASE_ADMIN_PRIVATE_KEY="your_key"
```

## Monitoring

- Enable Firebase Security Rules monitoring
- Set up Cloud Function error alerts
- Monitor authentication anomalies
- Regular security audits