import { AlertTriangle, Clock } from 'lucide-react';
import { Alert } from '@/types';
import Badge from '@/components/ui/Badge';
import { formatRelativeTime, getSeverityColor } from '@/utils/format';
import clsx from 'clsx';

interface AlertItemProps {
  alert: Alert;
  onClick?: () => void;
}

const AlertItem = ({ alert, onClick }: AlertItemProps) => {
  const getSeverityVariant = (severity: string) => {
    const variants: Record<string, 'danger' | 'warning' | 'info'> = {
      critical: 'danger',
      high: 'danger',
      medium: 'warning',
      low: 'info',
    };
    return variants[severity] || 'info';
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        'p-4 rounded-lg border transition-all cursor-pointer',
        'bg-dark-800 border-dark-700 hover:border-dark-600 hover:bg-dark-750'
      )}
    >
      <div className="flex items-start space-x-3">
        <div className={clsx('p-2 rounded-lg', getSeverityColor(alert.severity))}>
          <AlertTriangle className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-semibold text-white truncate">
              {alert.title}
            </h4>
            <Badge variant={getSeverityVariant(alert.severity)} size="sm">
              {alert.severity}
            </Badge>
          </div>
          
          <p className="text-sm text-dark-400 mb-2 line-clamp-2">
            {alert.description}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <Badge variant="info" size="sm">
                {alert.type}
              </Badge>
              <span className="text-dark-500">
                TX: {alert.transactionId.slice(0, 8)}...
              </span>
            </div>
            
            <div className="flex items-center text-dark-500">
              <Clock className="w-3 h-3 mr-1" />
              {formatRelativeTime(alert.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertItem;

// Made with Bob
