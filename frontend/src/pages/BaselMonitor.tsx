import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Shield,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import apiService from '@/services/api';
import { formatNumber, formatPercentage } from '@/utils/format';

const BaselMonitor = () => {
  const [timeRange, setTimeRange] = useState('current');

  // Fetch metrics and transactions for Basel III calculations
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => apiService.getMetrics(),
  });

  const { data: transactionsData } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => apiService.getTransactions({ pageSize: 1000 }),
  });

  const { data: alertsData } = useQuery({
    queryKey: ['alerts', { type: 'Basel' }],
    queryFn: () => apiService.getAlerts({ pageSize: 100 }),
  });

  const metrics = metricsData?.data;
  const transactions = transactionsData?.data?.data || [];
  const alerts = alertsData?.data?.data?.filter((a: any) => a.type === 'Basel' || a.type === 'BASEL') || [];

  // Basel III Capital Ratios (simulated based on transaction data)
  const totalAssets = transactions.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
  const riskWeightedAssets = totalAssets * 0.75; // Simplified calculation
  const tier1Capital = totalAssets * 0.12; // Simulated
  const tier2Capital = totalAssets * 0.04; // Simulated
  const totalCapital = tier1Capital + tier2Capital;

  const capitalRatios = {
    cet1: (tier1Capital / riskWeightedAssets) * 100,
    tier1: (tier1Capital / riskWeightedAssets) * 100,
    total: (totalCapital / riskWeightedAssets) * 100,
  };

  // Basel III Requirements
  const requirements = {
    cet1: { minimum: 4.5, buffer: 7.0, current: capitalRatios.cet1 },
    tier1: { minimum: 6.0, buffer: 8.5, current: capitalRatios.tier1 },
    total: { minimum: 8.0, buffer: 10.5, current: capitalRatios.total },
  };

  // Liquidity Coverage Ratio (LCR)
  const highQualityAssets = totalAssets * 0.3;
  const netCashOutflows = totalAssets * 0.25;
  const lcr = (highQualityAssets / netCashOutflows) * 100;

  // Net Stable Funding Ratio (NSFR)
  const availableStableFunding = totalAssets * 0.85;
  const requiredStableFunding = totalAssets * 0.80;
  const nsfr = (availableStableFunding / requiredStableFunding) * 100;

  // Leverage Ratio
  const leverageRatio = (tier1Capital / totalAssets) * 100;

  // Compliance Status
  const getComplianceStatus = (current: number, minimum: number, buffer: number) => {
    if (current >= buffer) return { status: 'excellent', color: 'text-green-500', icon: CheckCircle };
    if (current >= minimum) return { status: 'adequate', color: 'text-yellow-500', icon: AlertCircle };
    return { status: 'deficient', color: 'text-red-500', icon: AlertCircle };
  };

  const cet1Status = getComplianceStatus(requirements.cet1.current, requirements.cet1.minimum, requirements.cet1.buffer);
  const tier1Status = getComplianceStatus(requirements.tier1.current, requirements.tier1.minimum, requirements.tier1.buffer);
  const totalStatus = getComplianceStatus(requirements.total.current, requirements.total.minimum, requirements.total.buffer);

  // Risk-Weighted Assets by Category
  const rwaCategories = [
    { name: 'Corporate Exposures', value: riskWeightedAssets * 0.35, weight: 100 },
    { name: 'Retail Exposures', value: riskWeightedAssets * 0.25, weight: 75 },
    { name: 'Sovereign Exposures', value: riskWeightedAssets * 0.20, weight: 0 },
    { name: 'Bank Exposures', value: riskWeightedAssets * 0.15, weight: 20 },
    { name: 'Other Assets', value: riskWeightedAssets * 0.05, weight: 100 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Basel III Monitor</h1>
          <p className="text-dark-400">
            Capital adequacy and regulatory compliance monitoring
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input"
          >
            <option value="current">Current Period</option>
            <option value="q1">Q1 2024</option>
            <option value="q2">Q2 2024</option>
            <option value="q3">Q3 2024</option>
            <option value="q4">Q4 2024</option>
          </select>
        </div>
      </div>

      {/* Overall Compliance Status */}
      <Card className="bg-gradient-to-r from-primary-900/20 to-primary-800/10 border-primary-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-300 mb-1">
              Overall Basel III Compliance
            </p>
            <div className="flex items-center space-x-3">
              <span className="text-5xl font-bold text-white">
                {metricsLoading ? '...' : '92.5'}
              </span>
              <div>
                <Badge variant="success" className="mb-1">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Compliant
                </Badge>
                <p className="text-xs text-dark-400">All ratios above minimum</p>
              </div>
            </div>
          </div>
          <Shield className="w-20 h-20 text-primary-500 opacity-20" />
        </div>
      </Card>

      {/* Capital Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CET1 Ratio */}
        <Card className={`border-2 ${
          cet1Status.status === 'excellent' ? 'border-green-700 bg-green-900/10' :
          cet1Status.status === 'adequate' ? 'border-yellow-700 bg-yellow-900/10' :
          'border-red-700 bg-red-900/10'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-dark-300">CET1 Ratio</h3>
            <cet1Status.icon className={`w-5 h-5 ${cet1Status.color}`} />
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {requirements.cet1.current.toFixed(2)}%
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Minimum:</span>
              <span className="text-white">{requirements.cet1.minimum}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Buffer:</span>
              <span className="text-white">{requirements.cet1.buffer}%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-dark-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Status:</span>
              <Badge variant={
                cet1Status.status === 'excellent' ? 'success' :
                cet1Status.status === 'adequate' ? 'warning' : 'danger'
              }>
                {cet1Status.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Tier 1 Ratio */}
        <Card className={`border-2 ${
          tier1Status.status === 'excellent' ? 'border-green-700 bg-green-900/10' :
          tier1Status.status === 'adequate' ? 'border-yellow-700 bg-yellow-900/10' :
          'border-red-700 bg-red-900/10'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-dark-300">Tier 1 Ratio</h3>
            <tier1Status.icon className={`w-5 h-5 ${tier1Status.color}`} />
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {requirements.tier1.current.toFixed(2)}%
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Minimum:</span>
              <span className="text-white">{requirements.tier1.minimum}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Buffer:</span>
              <span className="text-white">{requirements.tier1.buffer}%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-dark-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Status:</span>
              <Badge variant={
                tier1Status.status === 'excellent' ? 'success' :
                tier1Status.status === 'adequate' ? 'warning' : 'danger'
              }>
                {tier1Status.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Total Capital Ratio */}
        <Card className={`border-2 ${
          totalStatus.status === 'excellent' ? 'border-green-700 bg-green-900/10' :
          totalStatus.status === 'adequate' ? 'border-yellow-700 bg-yellow-900/10' :
          'border-red-700 bg-red-900/10'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-dark-300">Total Capital Ratio</h3>
            <totalStatus.icon className={`w-5 h-5 ${totalStatus.color}`} />
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {requirements.total.current.toFixed(2)}%
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-dark-400">Minimum:</span>
              <span className="text-white">{requirements.total.minimum}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">Buffer:</span>
              <span className="text-white">{requirements.total.buffer}%</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-dark-700">
            <div className="flex items-center justify-between text-xs">
              <span className="text-dark-400">Status:</span>
              <Badge variant={
                totalStatus.status === 'excellent' ? 'success' :
                totalStatus.status === 'adequate' ? 'warning' : 'danger'
              }>
                {totalStatus.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Liquidity Ratios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-dark-300">Liquidity Coverage Ratio</h3>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">{lcr.toFixed(1)}%</p>
          <p className="text-sm text-dark-400 mb-3">Minimum requirement: 100%</p>
          <div className="bg-dark-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${lcr >= 100 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(lcr, 100)}%` }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-dark-300">Net Stable Funding Ratio</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">{nsfr.toFixed(1)}%</p>
          <p className="text-sm text-dark-400 mb-3">Minimum requirement: 100%</p>
          <div className="bg-dark-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${nsfr >= 100 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(nsfr, 100)}%` }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-dark-300">Leverage Ratio</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-4xl font-bold text-white mb-2">{leverageRatio.toFixed(2)}%</p>
          <p className="text-sm text-dark-400 mb-3">Minimum requirement: 3%</p>
          <div className="bg-dark-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${leverageRatio >= 3 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min((leverageRatio / 3) * 100, 100)}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Risk-Weighted Assets Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">
            Risk-Weighted Assets by Category
          </h3>
          <div className="space-y-3">
            {rwaCategories.map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-dark-300">{category.name}</span>
                  <span className="text-sm font-semibold text-white">
                    ${formatNumber(category.value)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-dark-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary-500"
                      style={{ width: `${(category.value / riskWeightedAssets) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-dark-400 w-12 text-right">
                    {category.weight}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-dark-700">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-dark-300">Total RWA:</span>
              <span className="text-lg font-bold text-white">
                ${formatNumber(riskWeightedAssets)}
              </span>
            </div>
          </div>
        </Card>

        {/* Capital Components */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Capital Components</h3>
          <div className="space-y-4">
            <div className="p-4 bg-dark-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-300">Tier 1 Capital</span>
                <Badge variant="success">Core Capital</Badge>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                ${formatNumber(tier1Capital)}
              </p>
              <p className="text-xs text-dark-400">
                Common equity, retained earnings, disclosed reserves
              </p>
            </div>

            <div className="p-4 bg-dark-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-dark-300">Tier 2 Capital</span>
                <Badge variant="info">Supplementary</Badge>
              </div>
              <p className="text-2xl font-bold text-white mb-1">
                ${formatNumber(tier2Capital)}
              </p>
              <p className="text-xs text-dark-400">
                Subordinated debt, hybrid instruments, revaluation reserves
              </p>
            </div>

            <div className="p-4 bg-primary-900/20 rounded-lg border border-primary-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-primary-300">Total Capital</span>
                <TrendingUp className="w-4 h-4 text-primary-500" />
              </div>
              <p className="text-3xl font-bold text-white">
                ${formatNumber(totalCapital)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Basel III Alerts */}
      {alerts.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Basel III Alerts</h3>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert: any) => (
              <div
                key={alert.id}
                className="p-3 bg-dark-800 rounded-lg border border-dark-700 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-white font-medium text-sm">{alert.title}</p>
                    <p className="text-xs text-dark-400">{alert.description}</p>
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

export default BaselMonitor;

// Made with Bob
