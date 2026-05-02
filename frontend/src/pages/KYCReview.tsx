import { UserCheck } from 'lucide-react';
import Card from '@/components/ui/Card';

const KYCReview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">KYC Review</h1>
        <p className="text-dark-400">Know Your Customer compliance review</p>
      </div>
      <Card>
        <div className="text-center py-12">
          <UserCheck className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">KYC Review System</h3>
          <p className="text-dark-400">Customer verification and review interface coming soon</p>
        </div>
      </Card>
    </div>
  );
};

export default KYCReview;

// Made with Bob
