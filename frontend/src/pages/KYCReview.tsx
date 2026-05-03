import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Calendar,
  Search,
  Filter,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiService from '@/services/api';
import { formatDateTime } from '@/utils/format';

const KYCReview = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch KYC-related alerts and transactions
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts', { type: 'KYC' }],
    queryFn: () => apiService.getAlerts({ pageSize: 100 }),
  });

  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.getTransactions({ pageSize: 500 }),
  });

  const { data: metricsData } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => apiService.getMetrics(),
  });

  const alerts = alertsData?.data?.data?.filter((a: any) => a.type === 'KYC') || [];
  const transactions = transactionsData?.data?.data || [];
  const metrics = metricsData?.data;

  // Group transactions by customer for KYC analysis
  const customerMap = new Map<string, {
    id: string;
    name: string;
    transactions: any[];
    totalAmount: number;
    countries: Set<string>;
    firstSeen: string;
    lastSeen: string;
    riskScore: number;
    kycStatus: 'verified' | 'pending' | 'deficient' | 'expired';
  }>();

  transactions.forEach((t: any) => {
    const existing = customerMap.get(t.customerId) || {
      id: t.customerId,
      name: t.customerName,
      transactions: [] as any[],
      totalAmount: 0,
      countries: new Set<string>(),
      firstSeen: t.timestamp,
      lastSeen: t.timestamp,
      riskScore: 0,
      kycStatus: 'pending' as const,
    };

    existing.transactions.push(t);
    existing.totalAmount += t.amount || 0;
    existing.countries.add(t.country);
    existing.riskScore = Math.max(existing.riskScore, t.riskScore || 0);
    
    if (new Date(t.timestamp) < new Date(existing.firstSeen)) {
      existing.firstSeen = t.timestamp;
    }
    if (new Date(t.timestamp) > new Date(existing.lastSeen)) {
      existing.lastSeen = t.timestamp;
    }

    // Determine KYC status based on risk and activity
    if (existing.riskScore >= 80 || existing.countries.size > 5) {
      existing.kycStatus = 'deficient';
    } else if (existing.riskScore >= 50 || existing.transactions.length > 20) {
      existing.kycStatus = 'pending';
    } else if (existing.transactions.length > 0) {
      existing.kycStatus = 'verified';
    }

    customerMap.set(t.customerId, existing);
  });

  const customers = Array.from(customerMap.values());

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    if (statusFilter !== 'all' && c.kycStatus !== statusFilter) return false;
    if (searchTerm && !c.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !c.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // KYC Metrics
  const kycMetrics = {
    total: customers.length,
    verified: customers.filter((c) => c.kycStatus === 'verified').length,
    pending: customers.filter((c) => c.kycStatus === 'pending').length,
    deficient: customers.filter((c) => c.kycStatus === 'deficient').length,
    expired: customers.filter((c) => c.kycStatus === 'expired').length,
    activeAlerts: alerts.filter((a: any) => a.status === 'ACTIVE' || a.status === 'OPEN').length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-500';
      case 'pending': return 'text-yellow-500';
      case 'deficient': return 'text-red-500';
      case 'expired': return 'text-orange-500';
      default: return 'text-dark-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'deficient': return AlertTriangle;
      case 'expired': return AlertTriangle;
      default: return UserCheck;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">KYC Review</h1>
          <p className="text-dark-400">
            Know Your Customer verification and compliance monitoring
          </p>
        </div>
      </div>

      {/* KYC Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Total Customers</h3>
            <UserCheck className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {transactionsLoading ? '...' : kycMetrics.total}
          </p>
          <p className="text-sm text-dark-400">Under monitoring</p>
        </Card>

        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Verified</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {transactionsLoading ? '...' : kycMetrics.verified}
          </p>
          <p className="text-sm text-dark-400">
            {kycMetrics.total > 0 ? Math.round((kycMetrics.verified / kycMetrics.total) * 100) : 0}% of total
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Pending Review</h3>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {transactionsLoading ? '...' : kycMetrics.pending}
          </p>
          <p className="text-sm text-dark-400">Requires verification</p>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Deficient</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {transactionsLoading ? '...' : kycMetrics.deficient}
          </p>
          <p className="text-sm text-dark-400">Immediate action needed</p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Active Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {alertsLoading ? '...' : kycMetrics.activeAlerts}
          </p>
          <p className="text-sm text-dark-400">KYC-related issues</p>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="Search by customer name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 input"
              />
            </div>
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input w-full md:w-48"
          >
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending Review</option>
            <option value="deficient">Deficient</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </Card>

      {/* Customer List */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Customer KYC Status ({filteredCustomers.length})
          </h3>
        </div>

        {transactionsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-dark-700 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <UserCheck className="w-16 h-16 text-dark-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Customers Found</h3>
            <p className="text-dark-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your filters' 
                : 'No customer data available'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCustomers.slice(0, 20).map((customer) => {
              const StatusIcon = getStatusIcon(customer.kycStatus);
              return (
                <div
                  key={customer.id}
                  className="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-700 transition-colors cursor-pointer"
                  onClick={() => {
                    // Navigate to first transaction of this customer
                    if (customer.transactions.length > 0) {
                      navigate(`/transactions/${customer.transactions[0].id}`);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(customer.kycStatus)}`} />
                        <h4 className="text-white font-semibold">{customer.name}</h4>
                        <Badge variant={
                          customer.kycStatus === 'verified' ? 'success' :
                          customer.kycStatus === 'pending' ? 'warning' :
                          customer.kycStatus === 'deficient' ? 'danger' : 'warning'
                        }>
                          {customer.kycStatus.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-dark-400 font-mono">{customer.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">
                        Risk Score: <span className={
                          customer.riskScore >= 80 ? 'text-red-500' :
                          customer.riskScore >= 50 ? 'text-yellow-500' : 'text-green-500'
                        }>{customer.riskScore}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Transactions</p>
                      <p className="text-sm font-semibold text-white">
                        {customer.transactions.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Total Value</p>
                      <p className="text-sm font-semibold text-white">
                        ${customer.totalAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Countries</p>
                      <p className="text-sm font-semibold text-white">
                        {customer.countries.size}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-400 mb-1">Last Activity</p>
                      <p className="text-sm font-semibold text-white">
                        {new Date(customer.lastSeen).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {customer.kycStatus === 'deficient' && (
                    <div className="flex items-start space-x-2 p-2 bg-red-500/10 rounded border border-red-700">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-red-400 font-medium">KYC Deficiency Detected</p>
                        <p className="text-xs text-red-300 mt-1">
                          {customer.riskScore >= 80 ? 'High risk score requires enhanced due diligence' :
                           customer.countries.size > 5 ? 'Multiple jurisdictions require additional verification' :
                           'Documentation incomplete or expired'}
                        </p>
                      </div>
                    </div>
                  )}

                  {customer.kycStatus === 'pending' && (
                    <div className="flex items-start space-x-2 p-2 bg-yellow-500/10 rounded border border-yellow-700">
                      <Clock className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs text-yellow-400 font-medium">Pending Verification</p>
                        <p className="text-xs text-yellow-300 mt-1">
                          Customer profile requires compliance review
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* KYC Alerts */}
      {alerts.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent KYC Alerts</h3>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/cases')}
            >
              View All
            </Button>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert: any) => (
              <div
                key={alert.id}
                className="p-3 bg-dark-800 rounded-lg border border-dark-700 flex items-center justify-between hover:border-primary-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.severity === 'CRITICAL' ? 'text-red-500' :
                    alert.severity === 'HIGH' ? 'text-orange-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <p className="text-white font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-dark-400 mt-1">{alert.description}</p>
                    <p className="text-xs text-dark-500 mt-1">
                      {formatDateTime(alert.timestamp)}
                    </p>
                  </div>
                </div>
                <Badge variant={
                  alert.severity === 'CRITICAL' ? 'danger' :
                  alert.severity === 'HIGH' ? 'warning' : 'info'
                }>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default KYCReview;

// Made with Bob
