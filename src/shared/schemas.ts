import { z } from 'zod';

export const UserRoleSchema = z.enum(['SUPER_ADMIN', 'ORG_ADMIN', 'ROOFER']);

export const CustomerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone is required'),
  address: z.string().min(1, 'Address is required'),
});

export const InspectionReportInputSchema = z.object({
  customer: CustomerSchema.omit({ id: true }),
  address: z.string().min(1, 'Address is required'),
  contactPerson: z.string().min(1, 'Contact person is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email'),
  agritectumContact: z.string().min(1, 'Agritectum contact is required'),
  agritectumPhone: z.string().min(1, 'Agritectum phone is required'),
  agritectumEmail: z.string().email('Invalid Agritectum email'),
  roofType: z.string().min(1, 'Roof type is required'),
  roofArea: z.number().min(0, 'Roof area must be non-negative'),
  roofAge: z.string().optional(),
  accessConditions: z.string().min(1, 'Access conditions are required'),
  fallProtection: z.boolean().default(false),
  technicalExecution: z.string().min(1, 'Technical execution assessment required'),
  drainage: z.string().min(1, 'Drainage assessment required'),
  edges: z.string().min(1, 'Edges assessment required'),
  skylights: z.string().min(1, 'Skylights assessment required'),
  technicalInstallations: z.string().min(1, 'Technical installations assessment required'),
  insulationType: z.string().min(1, 'Insulation type required'),
  greenRoof: z.boolean().default(false),
  solarPanels: z.boolean().default(false),
  solarPanelsDescription: z.string().optional(),
  noxReduction: z.boolean().default(false),
  rainwaterCollection: z.boolean().default(false),
  recreationalAreas: z.boolean().default(false),
  findings: z.string().min(1, 'Findings are required'),
  recommendations: z.string().min(1, 'Recommendations are required'),
  photos: z.array(z.string().url()).default([]),
  economicAssessment: z.string().optional(),
});

export const QuoteLineItemInputSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
});

export const QuoteInputSchema = z.object({
  reportId: z.string().optional(),
  customer: CustomerSchema.omit({ id: true }),
  lineItems: z.array(QuoteLineItemInputSchema).min(1, 'At least one line item is required'),
  tax: z.number().min(0, 'Tax must be non-negative'),
  currency: z.string().default('DKK'),
  validUntil: z.string(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  role: UserRoleSchema,
  orgId: z.string().min(1, 'Organization is required'),
  departmentId: z.string().optional(),
});

export const CreateOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  phone: z.string().min(1, 'Phone is required'),
  email: z.string().email('Invalid email'),
});

export const CreateDepartmentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
});