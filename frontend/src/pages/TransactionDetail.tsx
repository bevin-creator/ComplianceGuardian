import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, AlertTriangle, User, MapPin, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import apiService from '@/services/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDateTime, getRiskColor } from '@/utils/format';

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => apiService.getTransaction(id!),
    enabled: !!id,
  });

  const transaction = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-dark-700 rounded animate-pulse" />
        <div className="h-96 bg-dark-700 rounded animate-pulse" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-dark-600 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Transaction Not Found</h2>
        <Button onClick={() => navigate('/transactions')}>Back to Transactions</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/transactions')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Transaction Details</h1>
            <p className="text-dark-400 font-mono">{transaction.id}</p>
          </div>
        </div>
        <Badge
          variant={
            transaction.status === 'flagged' ? 'danger' :
            transaction.status === 'cleared' ? 'success' : 'warning'
          }
        >
          {transaction.status}
        </Badge>
      </div>

      {/* Risk Score Card */}
      <Card className="bg-gradient-to-r from-red-900/20 to-orange-900/10 border-red-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-red-300 mb-1">Risk Score</p>
            <p className={`text-5xl font-bold ${getRiskColor(transaction.riskScore)}`}>
              {transaction.riskScore}
            </p>
          </div>
          <AlertTriangle className="w-16 h-16 text-red-500 opacity-20" />
        </div>
      </Card>

      {/* Transaction Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center space-x-3 mb-4">
            <DollarSign className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Transaction Info</h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-dark-400">Amount</dt>
              <dd className="text-lg font-semibold text-white">
                {formatCurrency(transaction.amount, transaction.currency)}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-dark-400">Currency</dt>
              <dd className="text-base text-white">{transaction.currency}</dd>
            </div>
            <div>
              <dt className="text-sm text-dark-400">Timestamp</dt>
              <dd className="text-base text-white">{formatDateTime(transaction.timestamp)}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <div className="flex items-center space-x-3 mb-4">
            <User className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Customer Info</h3>
          </div>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-dark-400">Name</dt>
              <dd className="text-lg font-semibold text-white">{transaction.customerName}</dd>
            </div>
            <div>
              <dt className="text-sm text-dark-400">Customer ID</dt>
              <dd className="text-base text-white font-mono">{transaction.customerId}</dd>
            </div>
            <div>
              <dt className="text-sm text-dark-400">Country</dt>
              <dd className="text-base text-white">{transaction.country}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Rules Triggered */}
      {transaction.rulesTriggered && transaction.rulesTriggered.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-4">Rules Triggered</h3>
          <div className="space-y-2">
            {transaction.rulesTriggered.map((rule, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                <span className="text-white font-medium">{rule}</span>
                <Badge variant="danger">Violation</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Create Case</Button>
          <Button variant="secondary">Request AI Analysis</Button>
          <Button variant="secondary">Export Report</Button>
          <Button variant="danger">Escalate</Button>
        </div>
      </Card>
    </div>
  );
};

export default TransactionDetail;

// Made with Bob
