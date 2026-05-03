import { Shield } from 'lucide-react';
import Card from '@/components/ui/Card';

const AMLMonitor = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">AML Monitor</h1>
        <p className="text-dark-400">Anti-Money Laundering compliance monitoring</p>
      </div>
      <Card>
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">AML Monitoring</h3>
          <p className="text-dark-400">Comprehensive AML monitoring interface coming soon</p>
        </div>
      </Card>
    </div>
  );
};

export default AMLMonitor;

// Made with Bob
