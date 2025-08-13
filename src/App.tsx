import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import ReportsPage from './pages/ReportsPage'
import QuotesPage from './pages/QuotesPage'
import UsersPage from './pages/UsersPage'
import OrganizationsPage from './pages/OrganizationsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import { DatabaseInitService } from './services/DatabaseInitService'

function App() {
  useEffect(() => {
    // Initialize database on first launch
    const initDatabase = async () => {
      try {
        const dbInitService = DatabaseInitService.getInstance();
        await dbInitService.initializeDatabase();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute>
              <Layout>
                <ReportsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/quotes" element={
            <ProtectedRoute>
              <Layout>
                <QuotesPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute requiredRole="ORG_ADMIN">
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="/organizations" element={
            <ProtectedRoute requiredRole="SUPER_ADMIN">
              <Layout>
                <OrganizationsPage />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  )
}

export default App