import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderOpen } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/cases')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Case Details</h1>
          <p className="text-dark-400">Case ID: {id}</p>
        </div>
      </div>
      
      <Card>
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-dark-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Case Detail View</h3>
          <p className="text-dark-400">Detailed case information coming soon</p>
        </div>
      </Card>
    </div>
  );
};

export default CaseDetail;

// Made with Bob
