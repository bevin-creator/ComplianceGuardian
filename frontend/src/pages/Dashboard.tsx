import { useQuery } from '@tanstack/react-query';
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
import { formatNumber, formatPercentage } from '@/utils/format';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await apiService.uploadTransactions(file);
        // Refetch metrics after upload
        window.location.reload();
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
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
        
        <div className="flex items-center space-x-3">
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="btn btn-primary inline-flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Upload Transactions
            </div>
            <input
              id="file-upload"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
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
                {metrics?.complianceScore || 94.8}
              </span>
              <span className="text-2xl text-primary-400">/ 100</span>
            </div>
            <p className="text-sm text-dark-400 mt-2">
              System operating within acceptable parameters
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
          value={formatNumber(metrics?.totalTransactions || 12847)}
          change={8.2}
          trend="up"
          icon={ArrowLeftRight}
          iconColor="text-blue-500"
        />
        <MetricsCard
          title="Flagged Transactions"
          value={formatNumber(metrics?.flaggedTransactions || 234)}
          change={-12.5}
          trend="down"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
        <MetricsCard
          title="Open Cases"
          value={formatNumber(metrics?.openCases || 18)}
          change={5.3}
          trend="up"
          icon={FolderOpen}
          iconColor="text-yellow-500"
        />
        <MetricsCard
          title="Compliance Score"
          value={formatPercentage(metrics?.complianceScore || 94.8)}
          change={2.1}
          trend="up"
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
            {metrics?.amlViolations || 89}
          </p>
          <p className="text-sm text-dark-500">Detected this month</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-dark-400">KYC Deficiencies</h4>
            <Shield className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metrics?.kycDeficiencies || 45}
          </p>
          <p className="text-sm text-dark-500">Pending review</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-dark-400">Basel Breaches</h4>
            <Shield className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-2">
            {metrics?.baselBreaches || 12}
          </p>
          <p className="text-sm text-dark-500">Capital ratio alerts</p>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

// Made with Bob
