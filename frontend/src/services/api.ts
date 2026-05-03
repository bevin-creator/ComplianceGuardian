import axios, { AxiosInstance, AxiosError } from 'axios';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Transaction, 
  Alert, 
  Case, 
  DashboardMetrics,
  ActivityItem,
  ComplianceRule,
  Report,
  AIMessage,
  User
} from '@/types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false, // Set to false for dev, true if using cookies
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async register(data: {
    username: string;
    email: string;
    password: string;
    name: string;
    role: string;
  }): Promise<ApiResponse<User>> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(email: string, password: string): Promise<ApiResponse<User>> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
    localStorage.removeItem('token');
  }

  // Dashboard Metrics
  async getMetrics(): Promise<ApiResponse<DashboardMetrics>> {
    const response = await this.api.get('/metrics');
    return response.data;
  }

  // Transactions
  async getTransactions(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: string;
    riskLevel?: string;
  }): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const response = await this.api.get('/transactions', { params });
    return response.data;
  }

  async getTransaction(id: string): Promise<ApiResponse<Transaction>> {
    const response = await this.api.get(`/transactions/${id}`);
    return response.data;
  }

  async uploadTransactions(formData: FormData): Promise<ApiResponse<{
    batchId: string;
    totalRecords: number;
    successfulRecords: number;
    failedRecords: number;
    errors: string[];
    startTime: string;
    endTime: string;
  }>> {
    const response = await this.api.post('/transactions/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  }

  // Alerts
  async getAlerts(params?: {
    page?: number;
    pageSize?: number;
    severity?: string;
    status?: string;
  }): Promise<ApiResponse<PaginatedResponse<Alert>>> {
    const response = await this.api.get('/alerts', { params });
    return response.data;
  }

  async getAlert(id: string): Promise<ApiResponse<Alert>> {
    const response = await this.api.get(`/alerts/${id}`);
    return response.data;
  }

  async updateAlertStatus(id: string, status: string): Promise<ApiResponse<Alert>> {
    const response = await this.api.patch(`/alerts/${id}/status`, { status });
    return response.data;
  }

  // Cases
  async getCases(params?: {
    page?: number;
    pageSize?: number;
    status?: string;
    severity?: string;
  }): Promise<ApiResponse<PaginatedResponse<Case>>> {
    const response = await this.api.get('/cases', { params });
    return response.data;
  }

  async getCase(id: string): Promise<ApiResponse<Case>> {
    const response = await this.api.get(`/cases/${id}`);
    return response.data;
  }

  async createCase(data: Partial<Case>): Promise<ApiResponse<Case>> {
    const response = await this.api.post('/cases', data);
    return response.data;
  }

  async updateCase(id: string, data: Partial<Case>): Promise<ApiResponse<Case>> {
    const response = await this.api.patch(`/cases/${id}`, data);
    return response.data;
  }

  async assignCase(id: string, userId: string): Promise<ApiResponse<Case>> {
    const response = await this.api.post(`/cases/${id}/assign`, { userId });
    return response.data;
  }

  // Activity Feed
  async getActivity(params?: {
    page?: number;
    pageSize?: number;
    type?: string;
  }): Promise<ApiResponse<PaginatedResponse<ActivityItem>>> {
    const response = await this.api.get('/activity', { params });
    return response.data;
  }

  // Compliance Rules
  async getRules(): Promise<ApiResponse<ComplianceRule[]>> {
    const response = await this.api.get('/rules');
    return response.data;
  }

  async updateRule(id: string, data: Partial<ComplianceRule>): Promise<ApiResponse<ComplianceRule>> {
    const response = await this.api.patch(`/rules/${id}`, data);
    return response.data;
  }

  // AI Assistant
  async queryAI(query: string, context?: Record<string, any>): Promise<ApiResponse<AIMessage>> {
    const response = await this.api.post('/ai/query', { query, context });
    return response.data;
  }

  async explainTransaction(transactionId: string): Promise<ApiResponse<AIMessage>> {
    const response = await this.api.post('/ai/explain', { transactionId });
    return response.data;
  }

  async generateSAR(caseId: string): Promise<ApiResponse<{ content: string }>> {
    const response = await this.api.post('/ai/generate-sar', { caseId });
    return response.data;
  }

  async getComplianceSummary(): Promise<ApiResponse<{ summary: string }>> {
    const response = await this.api.get('/ai/compliance-summary');
    return response.data;
  }

  // Reports
  async getReports(): Promise<ApiResponse<Report[]>> {
    const response = await this.api.get('/reports');
    return response.data;
  }

  async generateReport(config: {
    reportType: string;
    dateFrom: string;
    dateTo: string;
    format: string;
    filters: Record<string, any>;
  }): Promise<ApiResponse<Report>> {
    const response = await this.api.post('/reports/generate', config);
    return response.data;
  }

  async downloadReport(id: string): Promise<Blob> {
    const response = await this.api.get(`/reports/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;

// Made with Bob
