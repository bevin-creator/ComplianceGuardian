import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeftRight,
  AlertTriangle,
  TrendingUp,
  FolderOpen,
  Shield,
  Upload
} from 'lucide-react';
import apiService from '@/services/api';
import MetricsCard from '@/components/dashboard/MetricsCard';
import AlertItem from '@/components/dashboard/AlertItem';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TransactionUploadModal from '@/components/upload/TransactionUploadModal';
import { useToast } from '@/components/ui/ToastContainer';
import { formatNumber, formatPercentage } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Fetch dashboard metrics
  const { data: metricsData, isLoading: metricsLoading } = useQuery({
    queryKey: ['metrics'],
    queryFn: () => apiService.getMetrics(),
  });

  // Fetch recent alerts
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts', { pageSize: 5 }],
    queryFn: () => apiService.getAlerts({ pageSize: 5 }),
  });

  // Fetch recent activity
  const { data: activityData, isLoading: activityLoading } = useQuery({
    queryKey: ['activity', { pageSize: 10 }],
    queryFn: () => apiService.getActivity({ pageSize: 10 }),
  });

  const metrics = metricsData?.data;
  const alerts = alertsData?.data?.data || [];
  const activities = activityData?.data?.data || [];

  const handleUploadSuccess = () => {
    // Refetch all dashboard data
    queryClient.invalidateQueries({ queryKey: ['metrics'] });
    queryClient.invalidateQueries({ queryKey: ['alerts'] });
    queryClient.invalidateQueries({ queryKey: ['activity'] });
    showToast('Dashboard data refreshed successfully', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-dark-400">
            Monitor compliance health and system activity
          </p>
        </div>
        
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Transactions
        </Button>
      </div>

      {/* Compliance Health Index */}
      <Card className="bg-gradient-to-r from-primary-900/20 to-primary-800/10 border-primary-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-primary-300 mb-1">
              Compliance Health Index (CHI)
            </p>
            <div className="flex items-baseline space-x-2">
              <span className="text-5xl font-bold text-white">
                {metricsLoading ? '...' : (metrics?.complianceScore?.toFixed(1) || '0.0')}
              </span>
              <span className="text-2xl text-primary-400">/ 100</span>
            </div>
            <p className="text-sm text-dark-400 mt-2">
              {metricsLoading ? 'Loading...' : 'System operating within acceptable parameters'}
            </p>
          </div>
          <div className="text-right">
            <Shield className="w-20 h-20 text-primary-500 opacity-20" />
          </div>
        </div>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Transactions"
          value={metricsLoading ? '...' : formatNumber(metrics?.totalTransactions || 0)}
          change={0}
          trend="neutral"
          icon={ArrowLeftRight}
          iconColor="text-blue-500"
        />
        <MetricsCard
          title="Flagged Transactions"
          value={metricsLoading ? '...' : formatNumber(metrics?.flaggedTransactions || 0)}
          change={0}
          trend="neutral"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
        <MetricsCard
          title="Open Cases"
          value={metricsLoading ? '...' : formatNumber(metrics?.openCases || 0)}
          change={0}
          trend="neutral"
          icon={FolderOpen}
          iconColor="text-yellow-500"
        />
        <MetricsCard
          title="Compliance Score"
          value={metricsLoading ? '...' : formatPercentage(metrics?.complianceScore || 0)}
          change={0}
          trend="neutral"
          icon={TrendingUp}
          iconColor="text-green-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Section - 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Critical Alerts</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/cases')}
              >
                View All
              </Button>
            </div>

            {alertsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-dark-700 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-dark-600 mx-auto mb-2" />
                <p className="text-dark-400">No critical alerts</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onClick={() => navigate(`/transactions/${alert.transactionId}`)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Activity Feed - 1 column */}
        <div>
          {activityLoading ? (
            <Card>
              <div className="h-96 bg-dark-700 rounded-lg animate-pulse" />
            </Card>
          ) : (
            <ActivityFeed activities={activities} />
          )}
        </div>
      </div>

      {/* Violation Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-dark-400">AML Violations</h4>
            <Shield className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metricsLoading ? '...' : (metrics?.violationBreakdown?.AML || 0)}
          </p>
          <p className="text-sm text-dark-500">Detected this month</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-dark-400">KYC Deficiencies</h4>
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metricsLoading ? '...' : (metrics?.violationBreakdown?.KYC || 0)}
          </p>
          <p className="text-sm text-dark-500">Pending review</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-dark-400">Basel Breaches</h4>
            <Shield className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metricsLoading ? '...' : (metrics?.violationBreakdown?.BASEL || 0)}
          </p>
          <p className="text-sm text-dark-500">Capital ratio alerts</p>
        </Card>
      </div>

      <TransactionUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;

// Made with Bob
