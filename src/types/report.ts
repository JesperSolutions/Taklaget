export interface BuildingContact {
  bygherre: string;
  adresse: string;
  postnummer: string;
  kontaktperson: string;
  telefon: string;
  email: string;
}

export interface AgritectumContact {
  kontakt: string;
  telefon: string;
  email: string;
}

export interface ChecklistItem {
  name: string;
  ikkeRelevant: boolean;
  ikkeEtableret: boolean;
  etableret: boolean;
  m2: string;
  kommentar: string;
}

export interface Photo {
  id: string;
  file?: File;
  url?: string;
  caption: string;
}

export interface Recommendation {
  id: string;
  text: string;
}

export interface EconomyItem {
  description: string;
  amount: number;
  unit: string;
  price: number;
  total: number;
}

export interface ResponsibilityItem {
  task: string;
  responsible: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ReportData {
  buildingContact: BuildingContact;
  agritectumContact: AgritectumContact;
  checklist: ChecklistItem[];
  photos: Photo[];
  recommendations: Recommendation[];
  economy: EconomyItem[];
  responsibility: ResponsibilityItem[];
}