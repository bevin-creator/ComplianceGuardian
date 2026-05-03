import { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Loader, FileText } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useToast } from '@/components/ui/ToastContainer';
import apiService from '@/services/api';

interface BatchIngestionResult {
  batchId: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  errors: string[];
  startTime: string;
  endTime: string;
}

interface TransactionUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionUploadModal = ({ isOpen, onClose, onSuccess }: TransactionUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<BatchIngestionResult | null>(null);
  const { showToast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = ['.csv', '.xlsx', '.xls'];
      const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
      
      if (!validTypes.includes(fileExt)) {
        showToast('Please select a CSV or Excel file', 'error');
        return;
      }
      
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        showToast('File size exceeds 10MB limit', 'error');
        return;
      }
      
      setFile(selectedFile);
      setResult(null);
      showToast(`File selected: ${selectedFile.name}`, 'info');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await apiService.uploadTransactions(formData);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data) {
        setResult(response.data);
        
        if (response.data.failedRecords === 0) {
          showToast(
            `Successfully uploaded ${response.data.successfulRecords} transactions!`,
            'success'
          );
          setTimeout(() => {
            onSuccess();
            handleClose();
          }, 2000);
        } else {
          showToast(
            `Upload completed with ${response.data.failedRecords} errors`,
            'warning'
          );
        }
      }
    } catch (err: any) {
      showToast(
        err.response?.data?.message || 'Upload failed. Please try again.',
        'error'
      );
      setResult(null);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setUploadProgress(0);
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Upload Transactions</h2>
          <button
            onClick={handleClose}
            className="text-dark-400 hover:text-white transition-colors"
            disabled={uploading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!result ? (
          <div className="space-y-6">
            {/* File Selection */}
            <div className="border-2 border-dashed border-dark-600 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <Upload className="w-12 h-12 text-dark-500 mx-auto mb-4" />
              
              {file ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-primary-400">
                    <FileText className="w-5 h-5" />
                    <span className="font-medium">{file.name}</span>
                  </div>
                  <p className="text-sm text-dark-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <p className="text-dark-300 mb-4">
                  Choose a CSV or Excel file to upload
                </p>
              )}
              
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
                disabled={uploading}
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <span className={`btn btn-secondary btn-sm ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {file ? 'Change File' : 'Select File'}
                </span>
              </label>
            </div>

            {/* File Format Info */}
            <div className="bg-dark-700 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-white mb-2">Supported Formats:</h3>
              <ul className="text-sm text-dark-400 space-y-1">
                <li>• CSV files (.csv)</li>
                <li>• Excel files (.xlsx, .xls)</li>
                <li>• Maximum file size: 10 MB</li>
                <li>• Maximum records: 10,000 per file</li>
              </ul>
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-400">Processing...</span>
                  <span className="text-white font-medium">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-dark-500 text-center">
                  Parsing and validating transactions...
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-dark-700">
              <Button variant="ghost" onClick={handleClose} disabled={uploading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="flex items-center"
              >
                {uploading ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Upload Result */
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {result.failedRecords === 0 ? (
                <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              )}
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {result.failedRecords === 0 ? 'Upload Successful!' : 'Upload Completed with Errors'}
                </h3>
                <p className="text-dark-400 text-sm">Batch ID: {result.batchId}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-dark-700 p-4 rounded-lg">
                <p className="text-dark-400 text-sm mb-1">Total Records</p>
                <p className="text-2xl font-bold text-white">{result.totalRecords}</p>
              </div>
              <div className="bg-green-900/20 border border-green-700 p-4 rounded-lg">
                <p className="text-green-400 text-sm mb-1">Successful</p>
                <p className="text-2xl font-bold text-green-400">{result.successfulRecords}</p>
              </div>
              <div className="bg-red-900/20 border border-red-700 p-4 rounded-lg">
                <p className="text-red-400 text-sm mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-400">{result.failedRecords}</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-dark-700 p-4 rounded-lg max-h-48 overflow-y-auto">
                <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  Validation Errors ({result.errors.length})
                </h4>
                <ul className="space-y-2 text-sm text-red-400">
                  {result.errors.slice(0, 10).map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                  {result.errors.length > 10 && (
                    <li className="text-dark-500 italic">
                      ... and {result.errors.length - 10} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex justify-end pt-4 border-t border-dark-700">
              <Button onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default TransactionUploadModal;

// Made with Bob
