import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { ingestTransaction } from '../api/endpoints';
import { Transaction } from '../api/types';

export const TransactionPage: React.FC = () => {
  const [formData, setFormData] = useState<Transaction>({
    transactionId: '',
    amount: 0,
    currency: 'USD',
    originCountry: '',
    destinationCountry: '',
    customerId: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await ingestTransaction(formData);
      setSuccess(
        `Transaction submitted successfully! Trace ID: ${response.traceId}`
      );
      // Reset form
      setFormData({
        transactionId: '',
        amount: 0,
        currency: 'USD',
        originCountry: '',
        destinationCountry: '',
        customerId: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card title="Submit Transaction">
        <p className="text-gray-600 mb-6">
          Submit a financial transaction for compliance scanning and risk analysis.
        </p>

        {success && (
          <Alert type="success" message={success} onClose={() => setSuccess(null)} />
        )}
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Transaction ID"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            required
            placeholder="TXN-12345"
          />

          <Input
            label="Amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
            placeholder="10000.00"
          />

          <Input
            label="Currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
            placeholder="USD"
            maxLength={3}
          />

          <Input
            label="Origin Country"
            name="originCountry"
            value={formData.originCountry}
            onChange={handleChange}
            required
            placeholder="US"
            maxLength={2}
          />

          <Input
            label="Destination Country"
            name="destinationCountry"
            value={formData.destinationCountry}
            onChange={handleChange}
            required
            placeholder="GB"
            maxLength={2}
          />

          <Input
            label="Customer ID"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            required
            placeholder="CUST-67890"
          />

          <div className="flex space-x-4">
            <Button type="submit" loading={loading}>
              Submit Transaction
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setFormData({
                  transactionId: '',
                  amount: 0,
                  currency: 'USD',
                  originCountry: '',
                  destinationCountry: '',
                  customerId: '',
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


