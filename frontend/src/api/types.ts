// TypeScript interfaces matching backend Java models

export enum ViolationType {
  AML_THRESHOLD = 'AML_THRESHOLD',
  KYC_MISSING_CUSTOMER_ID = 'KYC_MISSING_CUSTOMER_ID',
  HIGH_RISK_COUNTRY = 'HIGH_RISK_COUNTRY',
  BASEL_III_EXPOSURE = 'BASEL_III_EXPOSURE',
  CONTRACT_JURISDICTION = 'CONTRACT_JURISDICTION',
  REPORT_ANOMALY = 'REPORT_ANOMALY',
}

export interface Violation {
  type: ViolationType;
  description: string;
  explanation?: string;
  traceId: string;
}

export interface AuditLog {
  id: string;
  traceId: string;
  timestamp: string;
  eventType: string;
  violations: Violation[];
  riskScore: number;
  riskLevel: string;
}

export interface Transaction {
  transactionId: string;
  amount: number;
  currency: string;
  originCountry: string;
  destinationCountry: string;
  customerId: string;
  timestamp?: string;
}

export interface Contract {
  contractId: string;
  partyA: string;
  partyB: string;
  jurisdiction: string;
  contractType: string;
  effectiveDate: string;
  expiryDate: string;
}

export interface KYCPayload {
  customerId: string;
  [key: string]: any;
}

export interface ReportPayload {
  reportId: string;
  [key: string]: any;
}

// API Response types
export interface IngestResponse {
  status: string;
  traceId: string;
  eventId: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
  };
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
}

// API Error type
export interface ApiError {
  error: string;
  message?: string;
  status?: number;
}


