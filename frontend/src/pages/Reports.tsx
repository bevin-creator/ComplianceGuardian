import { useState } from 'react';
import { FileText, Download, Clock, CheckCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ReportGenerationModal, { ReportConfig } from '@/components/reports/ReportGenerationModal';
import { useToast } from '@/components/ui/ToastContainer';
import apiService from '@/services/api';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  category: 'AML' | 'KYC' | 'Basel' | 'SAR';
}

const Reports = () => {
  const { showToast } = useToast();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [recentReports, setRecentReports] = useState<Array<{
    id: string;
    name: string;
    generatedAt: string;
    format: string;
  }>>([]);

  const reportTypes: ReportType[] = [
    {
      id: 'aml-summary',
      name: 'AML Summary Report',
      description: 'Comprehensive AML compliance summary with flagged transactions and risk analysis',
      icon: FileText,
      category: 'AML',
    },
    {
      id: 'kyc-deficiency',
      name: 'KYC Deficiency Report',
      description: 'Outstanding KYC issues and customer verification deficiencies',
      icon: FileText,
      category: 'KYC',
    },
    {
      id: 'basel-capital',
      name: 'Basel III Capital Report',
      description: 'Capital adequacy analysis and regulatory capital requirements',
      icon: FileText,
      category: 'Basel',
    },
    {
      id: 'sar-filing',
      name: 'SAR Filing Report',
      description: 'Suspicious Activity Reports ready for regulatory submission',
      icon: FileText,
      category: 'SAR',
    },
    {
      id: 'transaction-summary',
      name: 'Transaction Summary Report',
      description: 'Detailed transaction analysis with volume and value metrics',
      icon: FileText,
      category: 'AML',
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment Report',
      description: 'Comprehensive risk scoring and heat map analysis',
      icon: FileText,
      category: 'AML',
    },
  ];

  const handleGenerateReport = async (config: ReportConfig) => {
    try {
      // Call the backend API to generate report
      const response = await apiService.generateReport(config);
      
      // Add to recent reports
      const newReport = {
        id: `report-${Date.now()}`,
        name: selectedReport?.name || 'Report',
        generatedAt: new Date().toISOString(),
        format: config.format,
      };
      setRecentReports([newReport, ...recentReports.slice(0, 4)]);
      
      showToast(`${selectedReport?.name} generated successfully`, 'success');
      
      // Simulate file download
      const blob = new Blob([JSON.stringify(response)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${config.reportType}_${config.dateFrom}_to_${config.dateTo}.${config.format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      showToast('Failed to generate report', 'error');
      throw error;
    }
  };

  const openReportModal = (report: ReportType) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-dark-400">Generate and download compliance reports with custom filters</p>
      </div>

      {/* Recent Reports */}
      {recentReports.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
            <Badge variant="success">
              <CheckCircle className="w-3 h-3 mr-1" />
              {recentReports.length} Generated
            </Badge>
          </div>
          <div className="space-y-2">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-dark-800 rounded-lg hover:bg-dark-750 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-primary-500" />
                  <div>
                    <p className="text-sm font-medium text-white">{report.name}</p>
                    <p className="text-xs text-dark-400 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(report.generatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant="info">{report.format}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Report Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:border-primary-700 transition-colors">
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <report.icon className="w-5 h-5 text-primary-500" />
                  </div>
                  <Badge variant="info" size="sm">
                    {report.category}
                  </Badge>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{report.name}</h3>
              <p className="text-sm text-dark-400 mb-4 flex-1">{report.description}</p>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openReportModal(report)}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Report Generation Modal */}
      <ReportGenerationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedReport(null);
        }}
        reportType={selectedReport}
        onGenerate={handleGenerateReport}
      />
    </div>
  );
};

export default Reports;

// Made with Bob
