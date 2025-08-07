import React from 'react';
import { BuildingContact } from '../types/report';

interface BuildingContactFormProps {
  data: BuildingContact;
  onChange: (data: BuildingContact) => void;
}

export const BuildingContactForm: React.FC<BuildingContactFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof BuildingContact, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center text-sm font-bold mr-3">1</span>
        Bygning & Kontaktpersoner
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label">Bygherre</label>
          <input
            type="text"
            value={data.bygherre}
            onChange={(e) => handleChange('bygherre', e.target.value)}
            className="form-input"
            placeholder="Navn på bygherre"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Adresse</label>
          <input
            type="text"
            value={data.adresse}
            onChange={(e) => handleChange('adresse', e.target.value)}
            className="form-input"
            placeholder="Adresse"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Postnummer</label>
          <input
            type="text"
            value={data.postnummer}
            onChange={(e) => handleChange('postnummer', e.target.value)}
            className="form-input"
            placeholder="Postnummer og by"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Kontaktperson</label>
          <input
            type="text"
            value={data.kontaktperson}
            onChange={(e) => handleChange('kontaktperson', e.target.value)}
            className="form-input"
            placeholder="Navn på kontaktperson"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Telefon</label>
          <input
            type="tel"
            value={data.telefon}
            onChange={(e) => handleChange('telefon', e.target.value)}
            className="form-input"
            placeholder="+45 XX XX XX XX"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">E-mail</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className="form-input"
            placeholder="email@example.com"
          />
        </div>
      </div>
    </div>
  );
};