import React, { createContext, useContext, ReactNode } from 'react';
import { DataService } from '../services/DataService';
import { MockDataService } from '../services/MockDataService';

interface DataContextType {
  dataService: DataService;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const dataService = new MockDataService();

export function DataProvider({ children }: { children: ReactNode }) {
  return (
    <DataContext.Provider value={{ dataService }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}