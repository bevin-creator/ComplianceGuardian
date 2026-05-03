import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { ingestKYC } from '../api/endpoints';

export const KYCPage: React.FC = () => {
  const [customerId, setCustomerId] = useState('');
  const [additionalData, setAdditionalData] = useState('{}');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Parse additional data as JSON
      let payload: any = { customerId };
      if (additionalData.trim()) {
        try {
          const parsed = JSON.parse(additionalData);
          payload = { ...payload, ...parsed };
        } catch {
          throw new Error('Invalid JSON in additional data');
        }
      }

      const response = await ingestKYC(payload);
      setSuccess(`KYC record submitted successfully! Trace ID: ${response.traceId}`);
      // Reset form
      setCustomerId('');
      setAdditionalData('{}');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit KYC record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Submit KYC Record">
        <p className="text-gray-600 mb-6">
          Submit Know Your Customer (KYC) data for compliance verification.
        </p>

        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Customer ID"
            name="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
            placeholder="CUST-12345"
          />

          <div className="mb-4">
            <label className="label">
              Additional Data (JSON)
              <span className="text-gray-500 text-xs ml-2">(Optional)</span>
            </label>
            <textarea
              className="input font-mono text-sm"
              rows={6}
              value={additionalData}
              onChange={(e) => setAdditionalData(e.target.value)}
              placeholder='{"name": "John Doe", "country": "US", "verified": true}'
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter additional KYC data as JSON object
            </p>
          </div>

          <div className="flex space-x-4">
            <Button type="submit" loading={loading}>
              Submit KYC Record
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCustomerId('');
                setAdditionalData('{}');
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

// Made with Bob
