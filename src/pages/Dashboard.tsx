import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { 
  FileText, 
  Calculator, 
  Users, 
  Building2,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { InspectionReport, Quote, User, Organization } from '../shared/types';
import { DatabaseAdminPanel } from '../components/DatabaseAdminPanel';
import { FirstUserSetup } from '../components/FirstUserSetup';

export default function Dashboard() {
  const { user } = useAuth();
  const { dataService } = useData();
  const [stats, setStats] = useState({
    reports: 0,
    quotes: 0,
    users: 0,
    organizations: 0,
    recentReports: [] as InspectionReport[],
    recentQuotes: [] as Quote[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        let reports: InspectionReport[] = [];
        let quotes: Quote[] = [];
        let users: User[] = [];
        let organizations: Organization[] = [];

        if (user?.role === 'SUPER_ADMIN') {
          // Super admin sees everything
          organizations = await dataService.getOrganizations();
          users = await dataService.getUsers();
          for (const org of organizations) {
            const orgReports = await dataService.getReports(org.id);
            const orgQuotes = await dataService.getQuotes(org.id);
            reports.push(...orgReports);
            quotes.push(...orgQuotes);
          }
        } else if (user?.role === 'ORG_ADMIN') {
          // Org admin sees their organization
          reports = await dataService.getReports(user.orgId);
          quotes = await dataService.getQuotes(user.orgId);
          users = await dataService.getUsers(user.orgId);
        } else if (user?.role === 'ROOFER') {
          // Roofer sees only their own work
          reports = await dataService.getReports(user.orgId, user.departmentId, user.uid);
          quotes = await dataService.getQuotes(user.orgId, user.departmentId, user.uid);
        }

        setStats({
          reports: reports.length,
          quotes: quotes.length,
          users: users.length,
          organizations: organizations.length,
          recentReports: reports.slice(0, 5),
          recentQuotes: quotes.slice(0, 5),
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, dataService]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS':
      case 'SENT':
        return 'text-blue-600 bg-blue-100';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'SUPER_ADMIN' && 'System overview and management'}
          {user?.role === 'ORG_ADMIN' && 'Organization management dashboard'}
          {user?.role === 'ROOFER' && 'Your inspection reports and quotes'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.reports}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calculator className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.quotes}</p>
            </div>
          </div>
        </div>

        {(user?.role === 'SUPER_ADMIN' || user?.role === 'ORG_ADMIN') && (
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.users}</p>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'SUPER_ADMIN' && (
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Organizations</p>
                <p className="text-2xl font-bold text-gray-900">{stats.organizations}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Reports */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentReports.length > 0 ? (
              stats.recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {report.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">{report.address}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No reports yet</p>
            )}
          </div>
        </div>

        {/* Recent Quotes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Recent Quotes</h3>
            <Calculator className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.recentQuotes.length > 0 ? (
              stats.recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {quote.customer.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {quote.total.toLocaleString()} {quote.currency}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                    {quote.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No quotes yet</p>
            )}
          </div>
        </div>
      </div>

                        {/* Database Admin Panel - Only for Super Admins */}
                  {user?.role === 'SUPER_ADMIN' && (
                    <div className="card">
                      <DatabaseAdminPanel />
                    </div>
                  )}

                  {/* First User Setup - Show when no user is logged in */}
                  {!user && (
                    <div className="card">
                      <FirstUserSetup />
                    </div>
                  )}
                </div>
              );
            }