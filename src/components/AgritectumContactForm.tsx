import React from 'react';
import { AgritectumContact } from '../types/report';

interface AgritectumContactFormProps {
  data: AgritectumContact;
  onChange: (data: AgritectumContact) => void;
}

export const AgritectumContactForm: React.FC<AgritectumContactFormProps> = ({ data, onChange }) => {
  const handleChange = (field: keyof AgritectumContact, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="form-section">
      <h3 className="text-lg font-medium text-gray-900 mb-4">AGRITECTUM Kontakt</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="form-group">
          <label className="form-label">Kontakt</label>
          <input
            type="text"
            value={data.kontakt}
            onChange={(e) => handleChange('kontakt', e.target.value)}
            className="form-input"
            placeholder="Navn"
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
            placeholder="email@agritectum.com"
          />
        </div>
      </div>
    </div>
  );
};