// Mock data for development without backend

import type { 
  DashboardMetrics, 
  Alert, 
  ActivityItem, 
  Transaction,
  Case 
} from '@/types';

export const mockMetrics: DashboardMetrics = {
  totalTransactions: 12847,
  flaggedTransactions: 234,
  complianceScore: 94.8,
  openCases: 18,
  resolvedCases: 156,
  criticalAlerts: 5,
  amlViolations: 89,
  kycDeficiencies: 45,
  baselBreaches: 12,
};

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    transactionId: 'tx-001',
    severity: 'critical',
    type: 'AML',
    title: 'Suspicious Transaction Pattern Detected',
    description: 'Multiple high-value transactions from sanctioned jurisdiction',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'open',
  },
  {
    id: 'alert-2',
    transactionId: 'tx-002',
    severity: 'high',
    type: 'KYC',
    title: 'Missing Customer Documentation',
    description: 'Proof of address verification pending for high-risk customer',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'investigating',
    assignedTo: 'John Doe',
  },
  {
    id: 'alert-3',
    transactionId: 'tx-003',
    severity: 'medium',
    type: 'Basel',
    title: 'Capital Ratio Below Threshold',
    description: 'Tier 1 capital ratio dropped to 9.2% (threshold: 10%)',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'open',
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'alert',
    title: 'New Critical Alert',
    description: 'AML violation detected in transaction TX-12847',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    user: 'System',
  },
  {
    id: 'act-2',
    type: 'case',
    title: 'Case Assigned',
    description: 'Case #CS-089 assigned to Sarah Johnson',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    user: 'Admin',
  },
  {
    id: 'act-3',
    type: 'transaction',
    title: 'Bulk Upload Completed',
    description: '1,247 transactions processed successfully',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    user: 'John Doe',
  },
  {
    id: 'act-4',
    type: 'report',
    title: 'Monthly Report Generated',
    description: 'AML compliance report for November 2024',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: 'System',
  },
];

export const mockTransactions: Transaction[] = Array.from({ length: 20 }, (_, i) => ({
  id: `tx-${String(i + 1).padStart(3, '0')}`,
  customerId: `cust-${String(i + 1).padStart(4, '0')}`,
  customerName: ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'][i % 5],
  amount: Math.floor(Math.random() * 100000) + 1000,
  currency: ['USD', 'EUR', 'GBP'][i % 3],
  country: ['USA', 'UK', 'Germany', 'France', 'Canada'][i % 5],
  jurisdiction: ['US', 'EU', 'UK'][i % 3],
  timestamp: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
  riskScore: Math.floor(Math.random() * 100),
  status: ['pending', 'flagged', 'cleared', 'escalated'][i % 4] as any,
  violationType: i % 3 === 0 ? 'AML' : i % 3 === 1 ? 'KYC' : undefined,
  rulesTriggered: i % 2 === 0 ? ['AML-003 Structuring', 'KYC-002 Missing Documentation'] : undefined,
}));

export const mockCases: Case[] = Array.from({ length: 10 }, (_, i) => ({
  id: `case-${String(i + 1).padStart(3, '0')}`,
  transactionId: `tx-${String(i + 1).padStart(3, '0')}`,
  title: `Compliance Case #${i + 1}`,
  severity: ['critical', 'high', 'medium', 'low'][i % 4] as any,
  status: ['open', 'under_review', 'escalated', 'resolved'][i % 4] as any,
  assignedTo: i % 2 === 0 ? 'John Doe' : 'Sarah Johnson',
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - i * 12 * 60 * 60 * 1000).toISOString(),
  dueDate: new Date(Date.now() + (7 - i) * 24 * 60 * 60 * 1000).toISOString(),
  sarStatus: i % 3 === 0 ? 'filed' : i % 3 === 1 ? 'pending' : 'not_required',
  description: 'Suspicious activity detected requiring investigation',
}));

// Made with Bob
