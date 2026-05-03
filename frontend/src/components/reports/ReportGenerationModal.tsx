import { useState } from 'react';
import { X, FileText, Calendar, Filter, Download, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface ReportGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportType: {
    id: string;
    name: string;
    description: string;
  } | null;
  onGenerate: (config: ReportConfig) => Promise<void>;
}

export interface ReportConfig {
  reportType: string;
  dateFrom: string;
  dateTo: string;
  format: 'PDF' | 'CSV' | 'EXCEL';
  filters: {
    status?: string;
    severity?: string;
    country?: string;
    minAmount?: number;
    maxAmount?: number;
  };
}

const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({
  isOpen,
  onClose,
  reportType,
  onGenerate,
}) => {
  const [step, setStep] = useState<'config' | 'generating' | 'complete'>('config');
  const [progress, setProgress] = useState(0);
  
  // Form state
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'EXCEL'>('PDF');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [country, setCountry] = useState('all');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');

  if (!isOpen || !reportType) return null;

  const handleGenerate = async () => {
    setStep('generating');
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      const config: ReportConfig = {
        reportType: reportType.id,
        dateFrom,
        dateTo,
        format,
        filters: {
          status: status !== 'all' ? status : undefined,
          severity: severity !== 'all' ? severity : undefined,
          country: country !== 'all' ? country : undefined,
          minAmount: minAmount ? parseFloat(minAmount) : undefined,
          maxAmount: maxAmount ? parseFloat(maxAmount) : undefined,
        },
      };

      await onGenerate(config);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setStep('complete');
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setStep('config');
      setProgress(0);
    }
  };

  const handleClose = () => {
    setStep('config');
    setProgress(0);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-700">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary-500" />
            <div>
              <h2 className="text-xl font-bold text-white">{reportType.name}</h2>
              <p className="text-sm text-dark-400">{reportType.description}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Configuration Step */}
        {step === 'config' && (
          <div className="space-y-6">
            {/* Date Range */}
            <div>
              <label className="flex items-center text-sm font-medium text-dark-300 mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="input w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-dark-400 mb-1 block">To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="input w-full"
                  />
                </div>
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="text-sm font-medium text-dark-300 mb-3 block">
                Report Format
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['PDF', 'CSV', 'EXCEL'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      format === fmt
                        ? 'border-primary-500 bg-primary-500/10 text-white'
                        : 'border-dark-700 bg-dark-800 text-dark-400 hover:border-dark-600'
                    }`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">{fmt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <label className="flex items-center text-sm font-medium text-dark-300 mb-3">
                <Filter className="w-4 h-4 mr-2" />
                Filters (Optional)
              </label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="input w-full"
                    >
                      <option value="all">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="FLAGGED">Flagged</option>
                      <option value="CLEARED">Cleared</option>
                      <option value="ESCALATED">Escalated</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="input w-full"
                    >
                      <option value="all">All Severity</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-dark-400 mb-1 block">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="input w-full"
                  >
                    <option value="all">All Countries</option>
                    <option value="US">United States</option>
                    <option value="GB">United Kingdom</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="CN">China</option>
                    <option value="JP">Japan</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Min Amount ($)</label>
                    <input
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="0"
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-400 mb-1 block">Max Amount ($)</label>
                    <input
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Unlimited"
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-dark-700">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate}>
                <Download className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        )}

        {/* Generating Step */}
        {step === 'generating' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-semibold text-white mb-2">Generating Report...</h3>
            <p className="text-dark-400 mb-6">
              Processing data and compiling your report
            </p>
            
            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="bg-dark-700 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary-500 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-dark-400 mt-2">{progress}% complete</p>
            </div>
          </div>
        )}

        {/* Complete Step */}
        {step === 'complete' && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Report Generated!</h3>
            <p className="text-dark-400 mb-6">
              Your report has been generated and downloaded successfully
            </p>
            
            <div className="bg-dark-800 rounded-lg p-4 max-w-md mx-auto mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-dark-400">File:</span>
                <span className="text-white font-medium">
                  {reportType.id}_{dateFrom}_to_{dateTo}.{format.toLowerCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-dark-400">Date Range:</span>
                <span className="text-white">{dateFrom} to {dateTo}</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-dark-400">Format:</span>
                <span className="text-white">{format}</span>
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleGenerate}>
                <Download className="w-4 h-4 mr-2" />
                Generate Another
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ReportGenerationModal;

// Made with Bob
