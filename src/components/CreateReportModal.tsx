import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { InspectionReport } from '../shared/types';
import { InspectionReportInputSchema } from '../shared/schemas';
import { ZodError } from 'zod';
import { X, Camera } from 'lucide-react';
import PhotoUpload from './PhotoUpload';

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

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    // Required fields validation
    if (!formData.customerName.trim()) errors['customer.name'] = 'Building owner name is required';
    if (!formData.customerEmail.trim()) errors['customer.email'] = 'Building owner email is required';
    if (!formData.customerPhone.trim()) errors['customer.phone'] = 'Building owner phone is required';
    if (!formData.customerAddress.trim()) errors['customer.address'] = 'Building owner address is required';
    if (!formData.address.trim()) errors.address = 'Property address is required';
    if (!formData.postalCode.trim()) errors.postalCode = 'Postal code is required';
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Contact person is required';
    if (!formData.phone.trim()) errors.phone = 'Contact phone is required';
    if (!formData.email.trim()) errors.email = 'Contact email is required';
    if (!formData.agritectumContact.trim()) errors.agritectumContact = 'Company contact is required';
    if (!formData.agritectumPhone.trim()) errors.agritectumPhone = 'Company phone is required';
    if (!formData.agritectumEmail.trim()) errors.agritectumEmail = 'Company email is required';
    if (!formData.roofType.trim()) errors.roofType = 'Roof type is required';
    if (!formData.accessConditions.trim()) errors.accessConditions = 'Access conditions are required';
    if (!formData.technicalExecution.trim()) errors.technicalExecution = 'Technical execution assessment is required';
    if (!formData.drainage.trim()) errors.drainage = 'Drainage assessment is required';
    if (!formData.edges.trim()) errors.edges = 'Edges assessment is required';
    if (!formData.skylights.trim()) errors.skylights = 'Skylights assessment is required';
    if (!formData.technicalInstallations.trim()) errors.technicalInstallations = 'Technical installations assessment is required';
    if (!formData.insulationType.trim()) errors.insulationType = 'Insulation type is required';
    if (!formData.findings.trim()) errors.findings = 'Findings are required';
    if (!formData.recommendations.trim()) errors.recommendations = 'Recommendations are required';
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Client-side validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.log('Client-side validation errors:', validationErrors);
      return;
    }

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

      console.log('Submitting report data:', reportData);
      
      const validatedData = InspectionReportInputSchema.parse(reportData);
      console.log('Validated data:', validatedData);
      
      const newReport = await dataService.createReport(
        user.orgId,
        user.departmentId || '',
        user.uid,
        validatedData
      );
      
      console.log('Report created successfully:', newReport);

      onReportCreated(newReport);
    } catch (error) {
      console.error('Error creating report:', error);
      
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
        console.log('Validation errors:', fieldErrors);
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setErrors({ general: errorMessage });
        console.error('General error:', errorMessage);
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
            <label className="form-label">Building Owner *</label>
            <input
              type="text"
              className="form-input"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              required
            />
            {errors['customer.name'] && <p className="mt-1 text-sm text-red-600">{errors['customer.name']}</p>}
          </div>

          <div>
            <label className="form-label">Contact Person *</label>
            <input
              type="text"
              className="form-input"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
            {errors.contactPerson && <p className="mt-1 text-sm text-red-600">{errors.contactPerson}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Building Owner Email *</label>
            <input
              type="email"
              className="form-input"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              required
            />
            {errors['customer.email'] && <p className="mt-1 text-sm text-red-600">{errors['customer.email']}</p>}
          </div>

          <div>
            <label className="form-label">Building Owner Phone *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              required
            />
            {errors['customer.phone'] && <p className="mt-1 text-sm text-red-600">{errors['customer.phone']}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Building Owner Address *</label>
            <input
              type="text"
              className="form-input"
              value={formData.customerAddress}
              onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
              required
            />
            {errors['customer.address'] && <p className="mt-1 text-sm text-red-600">{errors['customer.address']}</p>}
          </div>

          <div>
            <label className="form-label">Postal Code *</label>
            <input
              type="text"
              className="form-input"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              required
            />
            {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Property Address *</label>
            <input
              type="text"
              className="form-input"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="form-label">Phone *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium text-gray-900 mb-4">COMPANY CONTACT</h4>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Contact *</label>
            <input
              type="text"
              className="form-input"
              value={formData.agritectumContact}
              onChange={(e) => setFormData({ ...formData, agritectumContact: e.target.value })}
              required
            />
            {errors.agritectumContact && <p className="mt-1 text-sm text-red-600">{errors.agritectumContact}</p>}
          </div>

          <div>
            <label className="form-label">Phone *</label>
            <input
              type="tel"
              className="form-input"
              value={formData.agritectumPhone}
              onChange={(e) => setFormData({ ...formData, agritectumPhone: e.target.value })}
              required
            />
            {errors.agritectumPhone && <p className="mt-1 text-sm text-red-600">{errors.agritectumPhone}</p>}
          </div>
        </div>

        <div>
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-input"
            value={formData.agritectumEmail}
            onChange={(e) => setFormData({ ...formData, agritectumEmail: e.target.value })}
            required
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
          <label className="form-label">Roof Material *</label>
          <select
            className="form-input"
            value={formData.roofType}
            onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
            required
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
          <label className="form-label">Area (m²) *</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-input"
            value={formData.roofArea}
            onChange={(e) => setFormData({ ...formData, roofArea: parseFloat(e.target.value) || 0 })}
            required
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
          <label className="form-label">Access Conditions *</label>
          <input
            type="text"
            className="form-input"
            value={formData.accessConditions}
            onChange={(e) => setFormData({ ...formData, accessConditions: e.target.value })}
            placeholder="e.g. Access with long ladder"
            required
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
          <label className="form-label">Technical execution *</label>
          <input
            type="text"
            className="form-input"
            value={formData.technicalExecution}
            onChange={(e) => setFormData({ ...formData, technicalExecution: e.target.value })}
            placeholder="e.g. OK"
            required
          />
          {errors.technicalExecution && <p className="mt-1 text-sm text-red-600">{errors.technicalExecution}</p>}
        </div>

        <div>
          <label className="form-label">Drainage *</label>
          <input
            type="text"
            className="form-input"
            value={formData.drainage}
            onChange={(e) => setFormData({ ...formData, drainage: e.target.value })}
            placeholder="e.g. UV roof drains"
            required
          />
          {errors.drainage && <p className="mt-1 text-sm text-red-600">{errors.drainage}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Edges and parapets *</label>
          <input
            type="text"
            className="form-input"
            value={formData.edges}
            onChange={(e) => setFormData({ ...formData, edges: e.target.value })}
            placeholder="e.g. OK"
            required
          />
          {errors.edges && <p className="mt-1 text-sm text-red-600">{errors.edges}</p>}
        </div>

        <div>
          <label className="form-label">Skylights *</label>
          <input
            type="text"
            className="form-input"
            value={formData.skylights}
            onChange={(e) => setFormData({ ...formData, skylights: e.target.value })}
            placeholder="e.g. Single unit OK"
            required
          />
          {errors.skylights && <p className="mt-1 text-sm text-red-600">{errors.skylights}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label">Technical installations *</label>
          <input
            type="text"
            className="form-input"
            value={formData.technicalInstallations}
            onChange={(e) => setFormData({ ...formData, technicalInstallations: e.target.value })}
            placeholder="e.g. OK"
            required
          />
          {errors.technicalInstallations && <p className="mt-1 text-sm text-red-600">{errors.technicalInstallations}</p>}
        </div>

        <div>
          <label className="form-label">Insulation type *</label>
          <input
            type="text"
            className="form-input"
            value={formData.insulationType}
            onChange={(e) => setFormData({ ...formData, insulationType: e.target.value })}
            placeholder="e.g. EPS and Mineral Wool"
            required
          />
          {errors.insulationType && <p className="mt-1 text-sm text-red-600">{errors.insulationType}</p>}
        </div>
      </div>
    </div>
  );

  const renderAssessmentTab = () => (
    <div className="space-y-6">
      <div>
        <label className="form-label">Documentation / Findings *</label>
        <textarea
          rows={4}
          className="form-input"
          value={formData.findings}
          onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
          placeholder="Describe what was found during the inspection..."
          required
        />
        {errors.findings && <p className="mt-1 text-sm text-red-600">{errors.findings}</p>}
      </div>

      <div>
        <label className="form-label">Recommendations *</label>
        <textarea
          rows={6}
          className="form-input"
          value={formData.recommendations}
          onChange={(e) => setFormData({ ...formData, recommendations: e.target.value })}
          placeholder="1. First recommendation...&#10;2. Second recommendation...&#10;3. Third recommendation..."
          required
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

      <div>
        <PhotoUpload
          photos={formData.photos}
          onPhotosChange={(photos) => setFormData({ ...formData, photos })}
          maxPhotos={10}
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

            {/* Form Progress */}
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-800 font-medium">Form Progress:</span>
                <span className="text-blue-600">
                  {(() => {
                    const totalFields = 25; // Total required fields
                    const completedFields = [
                      formData.customerName, formData.customerEmail, formData.customerPhone, formData.customerAddress,
                      formData.address, formData.postalCode, formData.contactPerson, formData.phone, formData.email,
                      formData.agritectumContact, formData.agritectumPhone, formData.agritectumEmail,
                      formData.roofType, formData.roofArea > 0, formData.accessConditions,
                      formData.technicalExecution, formData.drainage, formData.edges, formData.skylights,
                      formData.technicalInstallations, formData.insulationType,
                      formData.findings, formData.recommendations
                    ].filter(Boolean).length;
                    
                    const percentage = Math.round((completedFields / totalFields) * 100);
                    return `${completedFields}/${totalFields} fields complete (${percentage}%)`;
                  })()}
                </span>
              </div>
              <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(() => {
                      const totalFields = 25;
                      const completedFields = [
                        formData.customerName, formData.customerEmail, formData.customerPhone, formData.customerAddress,
                        formData.address, formData.postalCode, formData.contactPerson, formData.phone, formData.email,
                        formData.agritectumContact, formData.agritectumPhone, formData.agritectumEmail,
                        formData.roofType, formData.roofArea > 0, formData.accessConditions,
                        formData.technicalExecution, formData.drainage, formData.edges, formData.skylights,
                        formData.technicalInstallations, formData.insulationType,
                        formData.findings, formData.recommendations
                      ].filter(Boolean).length;
                      
                      return (completedFields / totalFields) * 100;
                    })()}%`
                  }}
                ></div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                  const isComplete = (() => {
                    switch (tab.id) {
                      case 'building':
                        return formData.customerName && formData.customerEmail && formData.customerPhone && 
                               formData.customerAddress && formData.address && formData.postalCode && 
                               formData.contactPerson && formData.phone && formData.email && 
                               formData.agritectumContact && formData.agritectumPhone && formData.agritectumEmail;
                      case 'checklist':
                        return formData.roofType && formData.roofArea > 0 && formData.accessConditions && 
                               formData.technicalExecution && formData.drainage && formData.edges && 
                               formData.skylights && formData.technicalInstallations && formData.insulationType;
                      case 'assessment':
                        return formData.findings && formData.recommendations;
                      default:
                        return false;
                    }
                  })();
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                        currentTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name}
                      {isComplete && (
                        <span className="ml-2 text-green-500">✓</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Error Summary */}
              {(errors.general || Object.keys(errors).length > 0) && (
                <div className="rounded-md bg-red-50 p-4 mb-6">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h4>
                  {errors.general && (
                    <p className="text-sm text-red-700 mb-2">{errors.general}</p>
                  )}
                  {Object.keys(errors).filter(key => key !== 'general').length > 0 && (
                    <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                      {Object.entries(errors)
                        .filter(([key]) => key !== 'general')
                        .map(([key, message]) => (
                          <li key={key}>
                            <strong>{key.replace('.', ' ')}:</strong> {message}
                          </li>
                        ))}
                    </ul>
                  )}
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