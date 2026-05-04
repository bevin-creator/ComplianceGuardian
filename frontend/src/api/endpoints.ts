import { apiClient } from './client';
import {
  Transaction,
  Contract,
  KYCPayload,
  ReportPayload,
  IngestResponse,
  AuditLogsResponse,
  HealthResponse,
} from './types';

// Ingestion endpoints
export const ingestTransaction = async (
  transaction: Transaction
): Promise<IngestResponse> => {
  return apiClient.post<IngestResponse>('/ingest/transaction', transaction);
};

export const ingestContract = async (
  contract: Contract
): Promise<IngestResponse> => {
  return apiClient.post<IngestResponse>('/ingest/contract', contract);
};

export const ingestKYC = async (
  kycPayload: KYCPayload
): Promise<IngestResponse> => {
  return apiClient.post<IngestResponse>('/ingest/kyc', kycPayload);
};

export const ingestReport = async (
  reportPayload: ReportPayload
): Promise<IngestResponse> => {
  return apiClient.post<IngestResponse>('/ingest/report', reportPayload);
};

// Audit endpoints
export const getAuditLogs = async (params?: {
  traceId?: string;
  limit?: number;
  offset?: number;
}): Promise<AuditLogsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.traceId) {
    queryParams.append('traceId', params.traceId);
  }
  if (params?.limit !== undefined) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.offset !== undefined) {
    queryParams.append('offset', params.offset.toString());
  }

  const queryString = queryParams.toString();
  const endpoint = `/audit/logs${queryString ? `?${queryString}` : ''}`;
  
  return apiClient.get<AuditLogsResponse>(endpoint);
};

// Health endpoint
export const getHealth = async (): Promise<HealthResponse> => {
  return apiClient.get<HealthResponse>('/health');
};


