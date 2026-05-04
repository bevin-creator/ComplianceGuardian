import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { ingestReport } from '../api/endpoints';

export const ReportPage: React.FC = () => {
  const [reportId, setReportId] = useState('');
  const [reportData, setReportData] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse report data as JSON
      let payload: any = { reportId };
      if (reportData.trim()) {
        try {
          const parsed = JSON.parse(reportData);
          payload = { ...payload, ...parsed };
        } catch {
          throw new Error('Invalid JSON in report data');
        }
      }

      const response = await ingestReport(payload);
      setSuccess(`Report submitted successfully! Trace ID: ${response.traceId}`);
      // Reset form
      setReportId('');
      setReportData('{}');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Submit Compliance Report">
        <p className="text-gray-600 mb-6">
          Submit a compliance report for analysis and anomaly detection.
        </p>

        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Report ID"
            name="reportId"
            value={reportId}
            onChange={(e) => setReportId(e.target.value)}
            required
            placeholder="RPT-12345"
          />

          <div className="mb-4">
            <label className="label">
              Report Data (JSON)
              <span className="text-gray-500 text-xs ml-2">(Optional)</span>
            </label>
            <textarea
              className="input font-mono text-sm"
              rows={8}
              value={reportData}
              onChange={(e) => setReportData(e.target.value)}
              placeholder={`{
  "type": "quarterly",
  "period": "Q1-2024",
  "metrics": {
    "totalTransactions": 1500,
    "flaggedTransactions": 12
  }
}`}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter report data as JSON object
            </p>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" loading={loading}>
              Submit Report
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setReportId('');
                setReportData('{}');
              }}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};


