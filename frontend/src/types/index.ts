export interface User {
  id: string;
  email: string;
  name: string;
  role: 'executive' | 'analyst' | 'compliance_officer';
  token?: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
}

export interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  country: string;
  jurisdiction: string;
  timestamp: string;
  riskScore: number;
  status: 'pending' | 'flagged' | 'cleared' | 'escalated';
  violationType?: string;
  rulesTriggered?: string[];
}

export interface Alert {
  id: string;
  transactionId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: 'AML' | 'KYC' | 'Basel' | 'Sanctions';
  title: string;
  description: string;
  timestamp: string;
  status: 'open' | 'investigating' | 'resolved';
  assignedTo?: string;
}

export interface Case {
  id: string;
  transactionId: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'under_review' | 'escalated' | 'resolved';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  sarStatus?: 'pending' | 'filed' | 'not_required';
  description: string;
  timeline?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  type: 'detected' | 'ai_reviewed' | 'assigned' | 'edd_started' | 'sar_filed' | 'closed';
  description: string;
  timestamp: string;
  user?: string;
}

export interface ComplianceRule {
  id: string;
  code: string;
  name: string;
  category: 'AML' | 'KYC' | 'Basel';
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
}

export interface ActivityItem {
  id: string;
  type: 'transaction' | 'alert' | 'case' | 'report';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  metadata?: Record<string, any>;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  confidence?: number;
}

export interface DashboardMetrics {
  totalTransactions: number;
  flaggedTransactions: number;
  complianceScore: number;
  openCases: number;
  resolvedCases: number;
  criticalAlerts: number;
  amlViolations: number;
  kycDeficiencies: number;
  baselBreaches: number;
}

export interface RiskHeatmapData {
  country: string;
  riskLevel: 'high' | 'medium' | 'low';
  transactionCount: number;
  flaggedCount: number;
}

export interface Report {
  id: string;
  type: 'AML' | 'KYC' | 'Basel' | 'SAR';
  title: string;
  generatedAt: string;
  generatedBy: string;
  status: 'draft' | 'final';
  downloadUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  severity?: string;
  dateFrom?: string;
  dateTo?: string;
  country?: string;
  riskLevel?: string;
  type?: string;
}

// Made with Bob
