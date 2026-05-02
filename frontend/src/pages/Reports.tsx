import { FileText, Download } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Reports = () => {
  const reportTypes = [
    { name: 'AML Summary Report', description: 'Monthly AML compliance summary' },
    { name: 'KYC Deficiency Report', description: 'Outstanding KYC issues' },
    { name: 'Basel III Capital Report', description: 'Capital adequacy analysis' },
    { name: 'SAR Filing Report', description: 'Suspicious Activity Reports' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-dark-400">Generate and download compliance reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.name}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                </div>
                <p className="text-sm text-dark-400 mb-4">{report.description}</p>
                <Button variant="secondary" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reports;

// Made with Bob
