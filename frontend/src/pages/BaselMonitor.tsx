import { Building2 } from 'lucide-react';
import Card from '@/components/ui/Card';

const BaselMonitor = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Basel Monitor</h1>
        <p className="text-dark-400">Basel III capital requirements monitoring</p>
      </div>
      <Card>
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Basel III Monitoring</h3>
          <p className="text-dark-400">Capital ratio and regulatory compliance tracking coming soon</p>
        </div>
      </Card>
    </div>
  );
};

export default BaselMonitor;

// Made with Bob
