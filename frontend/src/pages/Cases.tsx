import { useQuery } from '@tanstack/react-query';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { FolderOpen } from 'lucide-react';
import apiService from '@/services/api';

const Cases = () => {
  const { data: casesData, isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: () => apiService.getCases({ pageSize: 100 }),
  });

  const cases = casesData?.data?.data || [];
  
  // Calculate status counts from real data
  const statusCounts = {
    'Open': cases.filter((c: any) => c.status === 'OPEN').length,
    'Under Review': cases.filter((c: any) => c.status === 'UNDER_REVIEW').length,
    'Escalated': cases.filter((c: any) => c.status === 'ESCALATED').length,
    'Resolved': cases.filter((c: any) => c.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Case Management</h1>
        <p className="text-dark-400">Track and manage compliance cases</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-dark-400">{status}</h3>
              <FolderOpen className="w-5 h-5 text-primary-500" />
            </div>
            <p className="text-3xl font-bold text-white">
              {isLoading ? '...' : count}
            </p>
          </Card>
        ))}
      </div>

      <Card>
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Cases Module</h3>
          <p className="text-dark-400">
            {isLoading ? 'Loading cases...' : `${cases.length} total cases in system`}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Cases;

// Made with Bob
