import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '@/components/ui/Card';
import clsx from 'clsx';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
}

const MetricsCard = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  iconColor = 'text-primary-500',
}: MetricsCardProps) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-dark-400';
  };

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-dark-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {trend === 'up' && <TrendingUp className="w-4 h-4" />}
              {trend === 'down' && <TrendingDown className="w-4 h-4" />}
              <span className={clsx('text-sm font-medium', getTrendColor())}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-dark-500">vs last month</span>
            </div>
          )}
        </div>
        
        <div className={clsx('p-3 rounded-lg bg-dark-700', iconColor)}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default MetricsCard;

// Made with Bob
