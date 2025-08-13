import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { User, Organization } from '../shared/types';
import { Plus, Users, Edit, Trash2, Filter } from 'lucide-react';
import CreateUserModal from '../components/CreateUserModal';

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const { dataService } = useData();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string>(searchParams.get('orgId') || '');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!currentUser) return;

        // Load organizations for super admin
        if (currentUser.role === 'SUPER_ADMIN') {
          const orgs = await dataService.getOrganizations();
          setOrganizations(orgs);
        }

        // Load users based on role and filters
        let fetchedUsers: User[] = [];
        
        if (currentUser.role === 'SUPER_ADMIN') {
          if (selectedOrgId) {
            fetchedUsers = await dataService.getUsers(selectedOrgId);
          } else {
            fetchedUsers = await dataService.getUsers();
          }
        } else if (currentUser.role === 'ORG_ADMIN') {
          fetchedUsers = await dataService.getUsers(currentUser.orgId);
        }

        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, dataService, selectedOrgId]);

  const handleUserCreated = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
    setShowCreateModal(false);
  };

  const handleDeleteUser = async (userToDelete: User) => {
    if (userToDelete.uid === currentUser?.uid) {
      alert("You cannot delete your own account.");
      return;
    }

    if (confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      try {
        // In a real implementation, you'd call dataService.deleteUser(userToDelete.uid)
        setUsers(prev => prev.filter(u => u.uid !== userToDelete.uid));
        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'text-purple-600 bg-purple-100';
      case 'ORG_ADMIN':
        return 'text-blue-600 bg-blue-100';
      case 'ROOFER':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getOrganizationName = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    return org?.name || 'Unknown Organization';
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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      {/* Filters for Super Admin */}
      {currentUser?.role === 'SUPER_ADMIN' && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Organization:</label>
              <select
                className="form-input w-64"
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
              >
                <option value="">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new user.</p>
          <div className="mt-6">
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.uid}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                            {formatRole(user.role)}
                          </span>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {currentUser?.role === 'SUPER_ADMIN' && (
                              <span>{getOrganizationName(user.orgId)}</span>
                            )}
                            <span>Created {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      {user.uid !== currentUser?.uid && (
                        <button 
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onUserCreated={handleUserCreated}
          preselectedOrgId={selectedOrgId}
        />
      )}
    </div>
  );
}