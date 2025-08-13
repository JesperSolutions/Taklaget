import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { InspectionReport } from '../shared/types';
import { InspectionReportInputSchema } from '../shared/schemas';
import { ZodError } from 'zod';
import { X } from 'lucide-react';

interface CreateReportModalProps {
  onClose: () => void;
  onReportCreated: (report: InspectionReport) => void;
}

export default function CreateReportModal({ onClose, onReportCreated }: CreateReportModalProps) {
  const { user } = useAuth();
  const { dataService } = useData();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    address: '',
    roofType: '',
    findings: '',
    recommendations: '',
    photos: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrors({});
    setLoading(true);

    try {
      const reportData = {
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
          address: formData.customerAddress,
        },
        address: formData.address,
        roofType: formData.roofType,
        findings: formData.findings,
        recommendations: formData.recommendations,
        photos: formData.photos,
      };

      const validatedData = InspectionReportInputSchema.parse(reportData);
      
      const newReport = await dataService.createReport(
        user.orgId,
        user.departmentId || '',
        user.uid,
        validatedData
      );

      onReportCreated(newReport);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
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
              <h3 className="text-lg font-medium text-gray-900">Create Inspection Report</h3>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                  {errors['customer.name'] && <p className="mt-1 text-sm text-red-600">{errors['customer.name']}</p>}
                </div>

                <div>
                  <label className="form-label">Customer Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                  {errors['customer.email'] && <p className="mt-1 text-sm text-red-600">{errors['customer.email']}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Customer Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                  {errors['customer.phone'] && <p className="mt-1 text-sm text-red-600">{errors['customer.phone']}</p>}
                </div>

                <div>
                  <label className="form-label">Roof Type</label>
                  <select
                    className="form-input"
                    value={formData.roofType}
                    onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                  >
                    <option value="">Select roof type</option>
                    <option value="Tegl tag">Tegl tag</option>
                    <option value="Beton tag">Beton tag</option>
                    <option value="Metal tag">Metal tag</option>
                    <option value="Stråtag">Stråtag</option>
                    <option value="Fladt tag">Fladt tag</option>
                  </select>
                  {errors.roofType && <p className="mt-1 text-sm text-red-600">{errors.roofType}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Customer Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.customerAddress}
                  onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                />
                {errors['customer.address'] && <p className="mt-1 text-sm text-red-600">{errors['customer.address']}</p>}
              </div>

              <div>
                <label className="form-label">Inspection Address</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label className="form-label">Findings</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={formData.findings}
                  onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                  placeholder="Describe what you found during the inspection..."
                />
                {errors.findings && <p className="mt-1 text-sm text-red-600">{errors.findings}</p>}
              </div>

              <div>
                <label className="form-label">Recommendations</label>
                <textarea
                  rows={3}
                  className="form-input"
                  value={formData.recommendations}
                  onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
                  placeholder="Recommend actions to be taken..."
                />
                {errors.recommendations && <p className="mt-1 text-sm text-red-600">{errors.recommendations}</p>}
              </div>

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
                  {loading ? 'Creating...' : 'Create Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}