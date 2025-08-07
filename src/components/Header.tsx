import React from 'react';
import { Building2, Download, Upload, Printer } from 'lucide-react';

interface HeaderProps {
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExport, onImport, onPrint }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-primary-600 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Taklaget</h1>
              <p className="text-sm text-gray-500">Professionel tagrapporten</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onPrint}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            
            <button
              onClick={onExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Eksporter
            </button>
            
            <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Importer
              <input
                type="file"
                accept=".json"
                onChange={onImport}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </header>
  );
};