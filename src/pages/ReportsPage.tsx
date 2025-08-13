import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { InspectionReport } from '../shared/types';
import { Plus, FileText, Eye, Edit } from 'lucide-react';
import CreateReportModal from '../components/CreateReportModal';

export default function ReportsPage() {
  const { user } = useAuth();
  const { dataService } = useData();
  const [reports, setReports] = useState<InspectionReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        if (!user) return;

        let fetchedReports: InspectionReport[] = [];

        if (user.role === 'SUPER_ADMIN') {
          // Super admin sees all reports across all organizations
          const organizations = await dataService.getOrganizations();
          for (const org of organizations) {
            const orgReports = await dataService.getReports(org.id);
            fetchedReports.push(...orgReports);
          }
        } else if (user.role === 'ORG_ADMIN') {
          // Org admin sees all reports in their organization
          fetchedReports = await dataService.getReports(user.orgId);
        } else if (user.role === 'ROOFER') {
          // Roofer sees only their own reports
          fetchedReports = await dataService.getReports(user.orgId, user.departmentId, user.uid);
        }

        setReports(fetchedReports);
      } catch (error) {
        console.error('Error loading reports:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [user, dataService]);

  const handleReportCreated = (newReport: InspectionReport) => {
    setReports(prev => [newReport, ...prev]);
    setShowCreateModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'APPROVED':
        return 'text-purple-600 bg-purple-100';
      case 'DRAFT':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inspection Reports</h1>
          <p className="text-gray-600">
            {user?.role === 'ROOFER' ? 'Your inspection reports' : 'Manage inspection reports'}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new inspection report.</p>
          <div className="mt-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {report.customer.name}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {report.status}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">{report.address}</p>
                          <p className="text-sm text-gray-500">
                            {report.roofType} • Created {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {report.findings && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 line-clamp-2">{report.findings}</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showCreateModal && (
        <CreateReportModal
          onClose={() => setShowCreateModal(false)}
          onReportCreated={handleReportCreated}
        />
      )}
    </div>
  );
}