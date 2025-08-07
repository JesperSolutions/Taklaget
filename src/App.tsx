import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BuildingContactForm } from './components/BuildingContactForm';
import { AgritectumContactForm } from './components/AgritectumContactForm';
import { ChecklistForm } from './components/ChecklistForm';
import { PhotoManager } from './components/PhotoManager';
import { RecommendationsForm } from './components/RecommendationsForm';
import { EconomyForm } from './components/EconomyForm';
import { ResponsibilityForm } from './components/ResponsibilityForm';
import { PrintReport } from './components/PrintReport';
import { ReportData } from './types/report';
import { defaultReportData } from './data/defaultData';

function App() {
  const [reportData, setReportData] = useState<ReportData>(defaultReportData);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('taklaget-report-data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setReportData(parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever reportData changes
  useEffect(() => {
    localStorage.setItem('taklaget-report-data', JSON.stringify(reportData));
  }, [reportData]);

  const handleExport = () => {
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tagrapporten-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        setReportData(importedData);
      } catch (error) {
        alert('Fejl ved import af fil. Kontroller at filen er korrekt formateret.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onExport={handleExport}
        onImport={handleImport}
        onPrint={handlePrint}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <BuildingContactForm
            data={reportData.buildingContact}
            onChange={(data) => setReportData(prev => ({ ...prev, buildingContact: data }))}
          />
          
          <AgritectumContactForm
            data={reportData.agritectumContact}
            onChange={(data) => setReportData(prev => ({ ...prev, agritectumContact: data }))}
          />
          
          <ChecklistForm
            data={reportData.checklist}
            onChange={(data) => setReportData(prev => ({ ...prev, checklist: data }))}
          />
          
          <PhotoManager
            data={reportData.photos}
            onChange={(data) => setReportData(prev => ({ ...prev, photos: data }))}
          />
          
          <RecommendationsForm
            data={reportData.recommendations}
            onChange={(data) => setReportData(prev => ({ ...prev, recommendations: data }))}
          />
          
          <EconomyForm
            data={reportData.economy}
            onChange={(data) => setReportData(prev => ({ ...prev, economy: data }))}
          />
          
          <ResponsibilityForm
            data={reportData.responsibility}
            onChange={(data) => setReportData(prev => ({ ...prev, responsibility: data }))}
          />
        </div>
      </main>
      
      <PrintReport data={reportData} />
    </div>
  );
}

export default App;