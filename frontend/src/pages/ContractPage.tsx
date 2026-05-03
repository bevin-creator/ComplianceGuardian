import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { ingestContract } from '../api/endpoints';
import { Contract } from '../api/types';

export const ContractPage: React.FC = () => {
  const [formData, setFormData] = useState<Contract>({
    contractId: '',
    partyA: '',
    partyB: '',
    jurisdiction: '',
    contractType: '',
    effectiveDate: '',
    expiryDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await ingestContract(formData);
      setSuccess(
        `Contract submitted successfully! Trace ID: ${response.traceId}`
      );
      // Reset form
      setFormData({
        contractId: '',
        partyA: '',
        partyB: '',
        jurisdiction: '',
        contractType: '',
        effectiveDate: '',
        expiryDate: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit contract');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Submit Contract">
        <p className="text-gray-600 mb-6">
          Submit a contract for compliance review and jurisdiction validation.
        </p>

        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Contract ID"
            name="contractId"
            value={formData.contractId}
            onChange={handleChange}
            required
            placeholder="CNT-12345"
          />

          <Input
            label="Party A"
            name="partyA"
            value={formData.partyA}
            onChange={handleChange}
            required
            placeholder="Company A Ltd"
          />

          <Input
            label="Party B"
            name="partyB"
            value={formData.partyB}
            onChange={handleChange}
            required
            placeholder="Company B Inc"
          />

          <Input
            label="Jurisdiction"
            name="jurisdiction"
            value={formData.jurisdiction}
            onChange={handleChange}
            required
            placeholder="US"
          />

          <Input
            label="Contract Type"
            name="contractType"
            value={formData.contractType}
            onChange={handleChange}
            required
            placeholder="Service Agreement"
          />

          <Input
            label="Effective Date"
            name="effectiveDate"
            type="date"
            value={formData.effectiveDate}
            onChange={handleChange}
            required
          />

          <Input
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            required
          />

          <div className="flex space-x-4">
            <Button type="submit" loading={loading}>
              Submit Contract
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setFormData({
                  contractId: '',
                  partyA: '',
                  partyB: '',
                  jurisdiction: '',
                  contractType: '',
                  effectiveDate: '',
                  expiryDate: '',
                })
              }
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
