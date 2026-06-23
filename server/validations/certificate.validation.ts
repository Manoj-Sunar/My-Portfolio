import { ValidationRule } from "../middleware/validation.js";


export interface CreateCertificateDto {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: { url: string; publicId: string };
}

export const createCertificateDtoRules: ValidationRule[] = [
  { field: 'title', required: true, type: 'string', message: 'Certificate/document title is required' },
  { field: 'issuer', required: true, type: 'string', message: 'Issuing organization is required' },
  { field: 'issueDate', required: true, type: 'string', message: 'Issue date is required' },
  { field: 'expiryDate', type: 'string' },
  { field: 'credentialId', type: 'string' },
  { field: 'credentialUrl', type: 'string' },
];
