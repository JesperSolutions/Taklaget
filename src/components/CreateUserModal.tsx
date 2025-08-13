import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { User, Organization, Department } from '../shared/types';
import { CreateUserSchema } from '../shared/schemas';
import { ZodError } from 'zod';
import { X, UserPlus } from 'lucide-react';

interface CreateUserModalProps {
  onClose: () => void;
  onUserCreated: (user: User) => void;
  preselectedOrgId?: string;
}

export default function CreateUserModal({ onClose, onUserCreated, preselectedOrgId }: CreateUserModalProps) {
  const { dataService } = useData();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ROOFER' as const,
    orgId: preselectedOrgId || '',
    departmentId: '',
  });

  useEffect(() => {
    const loadOrganizations = async () => {
      try {
        const orgs = await dataService.getOrganizations();
        setOrganizations(orgs);
        if (!preselectedOrgId && orgs.length > 0) {
          setFormData(prev => ({ ...prev, orgId: orgs[0].id }));
        }
      } catch (error) {
        console.error('Error loading organizations:', error);
      }
    };
    loadOrganizations();
  }, [dataService, preselectedOrgId]);

  useEffect(() => {
    const loadDepartments = async () => {
      if (formData.orgId) {
        try {
          const depts = await dataService.getDepartments(formData.orgId);
          setDepartments(depts);
          if (depts.length > 0) {
            setFormData(prev => ({ ...prev, departmentId: depts[0].id }));
          }
        } catch (error) {
          console.error('Error loading departments:', error);
        }
      }
    };
    loadDepartments();
  }, [formData.orgId, dataService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const userData = {
        ...formData,
        departmentId: formData.role === 'ROOFER' ? formData.departmentId : undefined,
      };
      const validatedData = CreateUserSchema.parse(userData);
      const newUser = await dataService.createUser(validatedData);
      onUserCreated(newUser);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        setErrors({ general: (error as Error).message });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserPlus className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Add User</h3>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              <div>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. john@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label className="form-label">Role</label>
                <select
                  className="form-input"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                >
                  <option value="ROOFER">Roofer</option>
                  <option value="ORG_ADMIN">Organization Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
                {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
              </div>

              <div>
                <label className="form-label">Organization</label>
                <select
                  className="form-input"
                  value={formData.orgId}
                  onChange={(e) => setFormData({ ...formData, orgId: e.target.value })}
                  disabled={!!preselectedOrgId}
                >
                  <option value="">Select organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
                </select>
                {errors.orgId && <p className="mt-1 text-sm text-red-600">{errors.orgId}</p>}
              </div>

              {formData.role === 'ROOFER' && (
                <div>
                  <label className="form-label">Department</label>
                  <select
                    className="form-input"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {errors.departmentId && <p className="mt-1 text-sm text-red-600">{errors.departmentId}</p>}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}