export type UserRole = 'SUPER_ADMIN' | 'ORG_ADMIN' | 'ROOFER';

export interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  orgId: string;
  departmentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  orgId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InspectionReport {
  id: string;
  orgId: string;
  departmentId: string;
  rooferId: string;
  customer: Customer;
  address: string;
  roofType: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED';
  findings: string;
  recommendations: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  orgId: string;
  departmentId: string;
  rooferId: string;
  reportId?: string;
  customer: Customer;
  lineItems: QuoteLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiToken {
  id: string;
  name: string;
  token: string;
  createdBy: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

export interface InspectionReportInput {
  customer: Customer;
  address: string;
  roofType: string;
  findings: string;
  recommendations: string;
  photos: string[];
}

export interface QuoteInput {
  reportId?: string;
  customer: Customer;
  lineItems: Omit<QuoteLineItem, 'id' | 'total'>[];
  tax: number;
  currency: string;
  validUntil: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
}