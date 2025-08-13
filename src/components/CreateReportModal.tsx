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
  const [currentTab, setCurrentTab] = useState('building');
  const [formData, setFormData] = useState({
    // Building & Contact Info
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    address: '',
    postalCode: '',
    contactPerson: '',
    phone: '',
    email: '',
    agritectumContact: '',
    agritectumPhone: '',
    agritectumEmail: '',
    
    // Technical Details
    roofType: '',
    roofArea: 0,
    roofAge: '',
    accessConditions: '',
    fallProtection: false,
    technicalExecution: '',
    drainage: '',
    edges: '',
    skylights: '',
    technicalInstallations: '',
    insulationType: '',
    greenRoof: false,
    solarPanels: false,
    solarPanelsDescription: '',
    noxReduction: false,
    rainwaterCollection: false,
    recreationalAreas: false,
    
    // Assessment
    findings: '',
    recommendations: '',
    economicAssessment: '',
    photos: [] as string[],
  });

  const tabs = [
    { id: 'building', name: 'Building & Contact', icon: '🏢' },
    { id: 'checklist', name: 'Check List', icon: '✅' },
    { id: 'assessment', name: 'Assessment', icon: '📋' },
  ];

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
        postalCode: formData.postalCode,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        agritectumContact: formData.agritectumContact,
        agritectumPhone: formData.agritectumPhone,
        agritectumEmail: formData.agritectumEmail,
        roofType: formData.roofType,
        roofArea: Number(formData.roofArea),
        roofAge: formData.roofAge,
        accessConditions: formData.accessConditions,
        fallProtection: formData.fallProtection,
        technicalExecution: formData.technicalExecution,
        drainage: formData.drainage,
        edges: formData.edges,
        skylights: formData.skylights,
        technicalInstallations: formData.technicalInstallations,
        insulationType: formData.insulationType,
        greenRoof: formData.greenRoof,
        solarPanels: formData.solarPanels,
        solarPanelsDescription: formData.solarPanelsDescription,
        noxReduction: formData.noxReduction,
        rainwaterCollection: formData.rainwaterCollection,
        recreationalAreas: formData.recreationalAreas,
        findings: formData.findings,
        recommendations: formData.recommendations,
        economicAssessment: formData.economicAssessment,
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

  const renderBuildingTab = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">BUILDING & CONTACT PERSONS</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Building Owner</label>
            <input
              type="text"
              className="form-input"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            {errors['customer.name'] && <p className="mt-1 text-sm text-red-600">{errors['customer.name']}</p>}
          </div>

          <div>
            <label className="form-label">Contact Person</label>
            <input
              type="text"
              className="form-input"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
            {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-input"
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
            />
            {errors['customer.address'] && <p className="mt-1 text-sm text-red-600">{errors['customer.address']}</p>}
          </div>

          <div>
            <label className="form-label">Postal Code</label>
            <input
              type="text"
              className="form-input"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">COMPANY CONTACT</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Contact</label>
            <input
              type="text"
              className="form-input"
              value={formData.agritectumContact}
              onChange={(e) => setFormData({ ...formData, agritectumContact: e.target.value })}
            />
            {errors.agritectumContact && <p className="mt-1 text-sm text-red-600">{errors.agritectumContact}</p>}
          </div>

          <div>
            <label className="form-label">Phone</label>
            <input
              type="tel"
              className="form-input"
              value={formData.agritectumPhone}
              onChange={(e) => setFormData({ ...formData, agritectumPhone: e.target.value })}
            />
            {errors.agritectumPhone && <p className="mt-1 text-sm text-red-600">{errors.agritectumPhone}</p>}
          </div>
        </div>

        <div>
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={formData.agritectumEmail}
            onChange={(e) => setFormData({ ...formData, agritectumEmail: e.target.value })}
          />
          {errors.agritectumEmail && <p className="mt-1 text-sm text-red-600">{errors.agritectumEmail}</p>}
        </div>
      </div>
    </div>
  );

  const renderChecklistTab = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-medium text-gray-900 mb-4">CHECK LIST</h4>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="form-label">Roof Material</label>
          <select
            className="form-input"
            value={formData.roofType}
            onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
          >
            <option value="">Select roof type</option>
            <option value="Roofing Felt">Roofing Felt</option>
            <option value="Tile Roof">Tile Roof</option>
            <option value="Concrete Roof">Concrete Roof</option>
            <option value="Metal Roof">Metal Roof</option>
            <option value="Thatched Roof">Thatched Roof</option>
            <option value="Flat Roof">Flat Roof</option>
          </select>
          {errors.roofType && <p className="mt-1 text-sm text-red-600">{errors.roofType}</p>}
        </div>

        <div>
          <label className="form-label">Area (m²)</label>
          <input
            type="number"
            min="0"
            className="form-input"
            value={formData.roofArea}
            onChange={(e) => setFormData({ ...formData, roofArea: parseFloat(e.target.value) || 0 })}
          />
          {errors.roofArea && <p className="mt-1 text-sm text-red-600">{errors.roofArea}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="form-label">Roof Age</label>
          <input
            type="text"
            className="form-input"
            value={formData.roofAge}
            onChange={(e) => setFormData({ ...formData, roofAge: e.target.value })}
            placeholder="e.g. 10 years"
          />
        </div>

        <div>
          <label className="form-label">Access Conditions</label>
          <input
            type="text"
            className="form-input"
            value={formData.accessConditions}
            onChange={(e) => setFormData({ ...formData, accessConditions: e.target.value })}
            placeholder="e.g. Access with long ladder"
          />
          {errors.accessConditions && <p className="mt-1 text-sm text-red-600">{errors.accessConditions}</p>}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="fallProtection"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.fallProtection}
            onChange={(e) => setFormData({ ...formData, fallProtection: e.target.checked })}
          />
          <label htmlFor="fallProtection" className="ml-2 block text-sm text-gray-900">
            Fall protection / railing established
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="greenRoof"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.greenRoof}
            onChange={(e) => setFormData({ ...formData, greenRoof: e.target.checked })}
          />
          <label htmlFor="greenRoof" className="ml-2 block text-sm text-gray-900">
            Green roof
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="solarPanels"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.solarPanels}
            onChange={(e) => setFormData({ ...formData, solarPanels: e.target.checked })}
          />
          <label htmlFor="solarPanels" className="ml-2 block text-sm text-gray-900">
            Solar panels
          </label>
        </div>

        {formData.solarPanels && (
          <div className="ml-6">
            <label className="form-label">Solar panels description</label>
            <input
              type="text"
              className="form-input"
              value={formData.solarPanelsDescription}
              onChange={(e) => setFormData({ ...formData, solarPanelsDescription: e.target.value })}
              placeholder="e.g. 2 smaller areas, adhesive solution"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="noxReduction"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.noxReduction}
            onChange={(e) => setFormData({ ...formData, noxReduction: e.target.checked })}
          />
          <label htmlFor="noxReduction" className="ml-2 block text-sm text-gray-900">
            NOx reduction
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rainwaterCollection"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.rainwaterCollection}
            onChange={(e) => setFormData({ ...formData, rainwaterCollection: e.target.checked })}
          />
          <label htmlFor="rainwaterCollection" className="ml-2 block text-sm text-gray-900">
            Rainwater collection
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="recreationalAreas"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            checked={formData.recreationalAreas}
            onChange={(e) => setFormData({ ...formData, recreationalAreas: e.target.checked })}
          />
          <label htmlFor="recreationalAreas" className="ml-2 block text-sm text-gray-900">
            Recreational areas
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Technical execution</label>
          <input
            type="text"
            className="form-input"
            value={formData.technicalExecution}
            onChange={(e) => setFormData({ ...formData, technicalExecution: e.target.value })}
            placeholder="e.g. OK"
          />
          {errors.technicalExecution && <p className="mt-1 text-sm text-red-600">{errors.technicalExecution}</p>}
        </div>

        <div>
          <label className="form-label">Drainage</label>
          <input
            type="text"
            className="form-input"
            value={formData.drainage}
            onChange={(e) => setFormData({ ...formData, drainage: e.target.value })}
            placeholder="e.g. UV roof drains"
          />
          {errors.drainage && <p className="mt-1 text-sm text-red-600">{errors.drainage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Edges and parapets</label>
          <input
            type="text"
            className="form-input"
            value={formData.edges}
            onChange={(e) => setFormData({ ...formData, edges: e.target.value })}
            placeholder="e.g. OK"
          />
          {errors.edges && <p className="mt-1 text-sm text-red-600">{errors.edges}</p>}
        </div>

        <div>
          <label className="form-label">Skylights</label>
          <input
            type="text"
            className="form-input"
            value={formData.skylights}
            onChange={(e) => setFormData({ ...formData, skylights: e.target.value })}
            placeholder="e.g. Single unit OK"
          />
          {errors.skylights && <p className="mt-1 text-sm text-red-600">{errors.skylights}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Technical installations</label>
          <input
            type="text"
            className="form-input"
            value={formData.technicalInstallations}
            onChange={(e) => setFormData({ ...formData, technicalInstallations: e.target.value })}
            placeholder="e.g. OK"
          />
          {errors.technicalInstallations && <p className="mt-1 text-sm text-red-600">{errors.technicalInstallations}</p>}
        </div>

        <div>
          <label className="form-label">Insulation type</label>
          <input
            type="text"
            className="form-input"
            value={formData.insulationType}
            onChange={(e) => setFormData({ ...formData, insulationType: e.target.value })}
            placeholder="e.g. EPS and Mineral Wool"
          />
          {errors.insulationType && <p className="mt-1 text-sm text-red-600">{errors.insulationType}</p>}
        </div>
      </div>
    </div>
  );

  const renderAssessmentTab = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Documentation / Findings</label>
        <textarea
          rows={4}
          className="form-input"
          value={formData.findings}
          onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
          placeholder="Describe what was found during the inspection..."
        />
        {errors.findings && <p className="mt-1 text-sm text-red-600">{errors.findings}</p>}
      </div>

      <div>
        <label className="form-label">Recommendations</label>
        <textarea
          rows={6}
          className="form-input"
          value={formData.recommendations}
          onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
          placeholder="1. First recommendation...&#10;2. Second recommendation...&#10;3. Third recommendation..."
        />
        {errors.recommendations && <p className="mt-1 text-sm text-red-600">{errors.recommendations}</p>}
      </div>

      <div>
        <label className="form-label">Economic Assessment</label>
        <textarea
          rows={3}
          className="form-input"
          value={formData.economicAssessment}
          onChange={(e) => setFormData({ ...formData, economicAssessment: e.target.value })}
          placeholder="Economic assessment and estimates..."
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Create Inspection Report</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      currentTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              {errors.general && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <p className="text-sm text-red-800">{errors.general}</p>
                </div>
              )}

              <div className="max-h-96 overflow-y-auto">
                {currentTab === 'building' && renderBuildingTab()}
                {currentTab === 'checklist' && renderChecklistTab()}
                {currentTab === 'assessment' && renderAssessmentTab()}
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
                <div className="flex space-x-3">
                  {currentTab !== 'building' && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
                        if (currentIndex > 0) {
                          setCurrentTab(tabs[currentIndex - 1].id);
                        }
                      }}
                      className="btn-secondary"
                    >
                      Previous
                    </button>
                  )}
                  {currentTab !== 'assessment' && (
                    <button
                      type="button"
                      onClick={() => {
                        const currentIndex = tabs.findIndex(tab => tab.id === currentTab);
                        if (currentIndex < tabs.length - 1) {
                          setCurrentTab(tabs[currentIndex + 1].id);
                        }
                      }}
                      className="btn-secondary"
                    >
                      Next
                    </button>
                  )}
                </div>
                
                <div className="flex space-x-3">
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}