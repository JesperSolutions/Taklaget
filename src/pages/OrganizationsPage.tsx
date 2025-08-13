import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Organization } from '../shared/types';
import { Plus, Building2, Edit, Users } from 'lucide-react';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import EditOrganizationModal from '../components/EditOrganizationModal';

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const { dataService } = useData();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const fetchedOrganizations = await dataService.getOrganizations();
        setOrganizations(fetchedOrganizations);
      } catch (error) {
        console.error('Error loading organizations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrganizations();
  }, [dataService]);

  const handleOrganizationCreated = (newOrganization: Organization) => {
    setOrganizations(prev => [newOrganization, ...prev]);
    setShowCreateModal(false);
  };

  const handleOrganizationUpdated = (updatedOrganization: Organization) => {
    setOrganizations(prev => 
      prev.map(org => org.id === updatedOrganization.id ? updatedOrganization : org)
    );
    setShowEditModal(false);
    setSelectedOrganization(null);
  };

  const handleEditOrganization = (organization: Organization) => {
    setSelectedOrganization(organization);
    setShowEditModal(true);
  };

  const handleViewUsers = (organization: Organization) => {
    // Navigate to users page with organization filter
    navigate(`/users?orgId=${organization.id}`);
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
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-gray-600">Manage organizations and their settings</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No organizations</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new organization.</p>
          <div className="mt-6">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Organization
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organizations.map((org) => (
            <div key={org.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <h3 className="ml-3 text-lg font-medium text-gray-900">{org.name}</h3>
                </div>
                <button 
                  onClick={() => handleEditOrganization(org)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                  title="Edit organization"
                >
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p>{org.address}</p>
                <p>{org.phone}</p>
                <p>{org.email}</p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Created {new Date(org.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleViewUsers(org)}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Users className="h-4 w-4 mr-1" />
                    View Users
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateOrganizationModal
          onClose={() => setShowCreateModal(false)}
          onOrganizationCreated={handleOrganizationCreated}
        />
      )}

      {showEditModal && selectedOrganization && (
        <EditOrganizationModal
          organization={selectedOrganization}
          onClose={() => {
            setShowEditModal(false);
            setSelectedOrganization(null);
          }}
          onOrganizationUpdated={handleOrganizationUpdated}
        />
      )}
    </div>
  );
}