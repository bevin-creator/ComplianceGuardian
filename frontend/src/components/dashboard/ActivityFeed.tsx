import { Activity, ArrowLeftRight, FolderOpen, FileText, AlertTriangle } from 'lucide-react';
import { ActivityItem } from '@/types';
import Card from '@/components/ui/Card';
import { formatRelativeTime } from '@/utils/format';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return ArrowLeftRight;
      case 'case':
        return FolderOpen;
      case 'report':
        return FileText;
      case 'alert':
        return AlertTriangle;
      default:
        return Activity;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'text-blue-400 bg-blue-900/20';
      case 'case':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'report':
        return 'text-green-400 bg-green-900/20';
      case 'alert':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-dark-400 bg-dark-700';
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <Activity className="w-5 h-5 text-dark-400" />
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 text-dark-600 mx-auto mb-2" />
            <p className="text-dark-400">No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getIcon(activity.type);
            const iconColor = getIconColor(activity.type);

            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${iconColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">
                    {activity.title}
                  </p>
                  <p className="text-sm text-dark-400 mt-0.5">
                    {activity.description}
                  </p>
                  <div className="flex items-center mt-1 text-xs text-dark-500">
                    {activity.user && (
                      <>
                        <span>{activity.user}</span>
                        <span className="mx-1">•</span>
                      </>
                    )}
                    <span>{formatRelativeTime(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {activities.length > 0 && (
        <button className="w-full mt-4 py-2 text-sm text-primary-500 hover:text-primary-400 font-medium transition-colors">
          View All Activity
        </button>
      )}
    </Card>
  );
};

export default ActivityFeed;

// Made with Bob
