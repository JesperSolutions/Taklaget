import React, { createContext, useContext, ReactNode } from 'react';
import { DataService } from '../services/DataService';
import { MockDataService } from '../services/MockDataService';
import { FirebaseDataService } from '../services/FirebaseDataService';

interface DataContextType {
  dataService: DataService;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Use Firebase in production, Mock in development (you can change this)
const dataService = new FirebaseDataService();

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