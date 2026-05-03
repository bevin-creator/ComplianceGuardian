import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign,
  MapPin,
  Clock,
  Filter,
  Search,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiService from '@/services/api';
import { formatCurrency, formatDateTime, getRiskColor } from '@/utils/format';

const AMLMonitor = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [riskFilter, setRiskFilter] = useState('all');

  // Fetch AML-specific alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts', { type: 'AML' }],
    queryFn: () => apiService.getAlerts({ pageSize: 100 }),
  });

  // Fetch flagged transactions
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['transactions', { status: 'FLAGGED' }],
    queryFn: () => apiService.getTransactions({ status: 'FLAGGED', pageSize: 100 }),
  });

  // Fetch metrics
  const { data: metricsData } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => apiService.getMetrics(),
  });

  const alerts = alertsData?.data?.data?.filter((a: any) => a.type === 'AML') || [];
  const transactions = transactionsData?.data?.data || [];
  const metrics = metricsData?.data;

  // Calculate AML-specific metrics
  const amlMetrics = {
    totalFlagged: transactions.length,
    highRisk: transactions.filter((t: any) => t.riskScore >= 80).length,
    mediumRisk: transactions.filter((t: any) => t.riskScore >= 50 && t.riskScore < 80).length,
    lowRisk: transactions.filter((t: any) => t.riskScore < 50).length,
    totalValue: transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0),
    activeAlerts: alerts.filter((a: any) => a.status === 'ACTIVE' || a.status === 'OPEN').length,
  };

  // Pattern detection categories
  const patterns = [
    {
      name: 'Structuring',
      count: transactions.filter((t: any) => 
        t.flaggedRules?.includes('STRUCTURING') || 
        t.violationType?.includes('structuring')
      ).length,
      severity: 'high',
      icon: TrendingUp,
    },
    {
      name: 'High Value',
      count: transactions.filter((t: any) => 
        t.flaggedRules?.includes('HIGH_VALUE') || 
        t.amount > 10000
      ).length,
      severity: 'medium',
      icon: DollarSign,
    },
    {
      name: 'Rapid Movement',
      count: transactions.filter((t: any) => 
        t.flaggedRules?.includes('RAPID_MOVEMENT') || 
        t.violationType?.includes('velocity')
      ).length,
      severity: 'high',
      icon: Clock,
    },
    {
      name: 'Sanctioned Countries',
      count: transactions.filter((t: any) => 
        t.flaggedRules?.includes('SANCTIONED') || 
        ['IR', 'KP', 'SY', 'CU'].includes(t.country)
      ).length,
      severity: 'critical',
      icon: MapPin,
    },
  ];

  // Top risky customers
  const customerRiskMap = new Map<string, { name: string; count: number; totalAmount: number; maxRisk: number }>();
  transactions.forEach((t: any) => {
    const existing = customerRiskMap.get(t.customerId) || {
      name: t.customerName,
      count: 0,
      totalAmount: 0,
      maxRisk: 0,
    };
    customerRiskMap.set(t.customerId, {
      name: t.customerName,
      count: existing.count + 1,
      totalAmount: existing.totalAmount + (t.amount || 0),
      maxRisk: Math.max(existing.maxRisk, t.riskScore || 0),
    });
  });

  const topRiskyCustomers = Array.from(customerRiskMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.maxRisk - a.maxRisk)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AML Monitor</h1>
          <p className="text-dark-400">
            Anti-Money Laundering pattern detection and risk analysis
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Flagged Transactions</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {transactionsLoading ? '...' : amlMetrics.totalFlagged}
          </p>
          <p className="text-sm text-dark-400">
            {amlMetrics.highRisk} high risk
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900/20 to-orange-800/10 border-orange-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Active Alerts</h3>
            <Shield className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {alertsLoading ? '...' : amlMetrics.activeAlerts}
          </p>
          <p className="text-sm text-dark-400">
            Requires investigation
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Total Value at Risk</h3>
            <DollarSign className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {transactionsLoading ? '...' : formatCurrency(amlMetrics.totalValue, 'USD')}
          </p>
          <p className="text-sm text-dark-400">
            Flagged transaction value
          </p>
        </Card>

        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-dark-300">Risk Distribution</h3>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-red-400">High:</span>
              <span className="text-white font-semibold">{amlMetrics.highRisk}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-yellow-400">Medium:</span>
              <span className="text-white font-semibold">{amlMetrics.mediumRisk}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Low:</span>
              <span className="text-white font-semibold">{amlMetrics.lowRisk}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pattern Detection */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">
          Detected Money Laundering Patterns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {patterns.map((pattern) => (
            <div
              key={pattern.name}
              className="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <pattern.icon className={`w-6 h-6 ${
                  pattern.severity === 'critical' ? 'text-red-500' :
                  pattern.severity === 'high' ? 'text-orange-500' :
                  pattern.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <Badge variant={
                  pattern.severity === 'critical' ? 'danger' :
                  pattern.severity === 'high' ? 'danger' :
                  pattern.severity === 'medium' ? 'warning' : 'info'
                }>
                  {pattern.severity}
                </Badge>
              </div>
              <h4 className="text-white font-semibold mb-1">{pattern.name}</h4>
              <p className="text-2xl font-bold text-primary-400">{pattern.count}</p>
              <p className="text-xs text-dark-400 mt-1">detected instances</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* High-Risk Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">High-Risk Transactions</h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate('/transactions')}
              >
                View All
              </Button>
            </div>

            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-dark-700 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-dark-600 mx-auto mb-2" />
                <p className="text-dark-400">No high-risk transactions detected</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx: any) => (
                  <div
                    key={tx.id}
                    onClick={() => navigate(`/transactions/${tx.id}`)}
                    className="p-4 bg-dark-800 rounded-lg border border-dark-700 hover:border-primary-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-mono text-primary-400">
                            {tx.id?.slice(0, 12)}...
                          </span>
                          <Badge variant={
                            tx.riskScore >= 80 ? 'danger' :
                            tx.riskScore >= 50 ? 'warning' : 'info'
                          }>
                            Risk: {tx.riskScore}
                          </Badge>
                        </div>
                        <p className="text-white font-medium">{tx.customerName}</p>
                        <p className="text-sm text-dark-400">{tx.customerId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">
                          {formatCurrency(tx.amount, tx.currency)}
                        </p>
                        <p className="text-xs text-dark-400">{tx.country}</p>
                      </div>
                    </div>
                    {tx.flaggedRules && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tx.flaggedRules.split(',').map((rule: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded"
                          >
                            {rule.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-dark-500 mt-2">
                      {formatDateTime(tx.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Top Risky Customers */}
        <div>
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Top Risky Customers</h3>
              <Users className="w-5 h-5 text-primary-500" />
            </div>

            {transactionsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-dark-700 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : topRiskyCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-dark-600 mx-auto mb-2" />
                <p className="text-dark-400 text-sm">No risky customers identified</p>
              </div>
            ) : (
              <div className="space-y-3">
                {topRiskyCustomers.map((customer, idx) => (
                  <div
                    key={customer.id}
                    className="p-3 bg-dark-800 rounded-lg border border-dark-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary-400">#{idx + 1}</span>
                          <span className={`text-sm font-semibold ${getRiskColor(customer.maxRisk)}`}>
                            {customer.maxRisk}
                          </span>
                        </div>
                        <p className="text-white font-medium text-sm mt-1">{customer.name}</p>
                        <p className="text-xs text-dark-400">{customer.id}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-dark-700">
                      <div>
                        <p className="text-xs text-dark-400">Transactions</p>
                        <p className="text-sm font-semibold text-white">{customer.count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-dark-400">Total Value</p>
                        <p className="text-sm font-semibold text-white">
                          {formatCurrency(customer.totalAmount, 'USD')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AMLMonitor;

// Made with Bob
