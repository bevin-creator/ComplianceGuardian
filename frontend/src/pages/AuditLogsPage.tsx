import React, { useState, useEffect } from 'react';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Alert } from '../components/common/Alert';
import { getAuditLogs } from '../api/endpoints';
import { AuditLog } from '../api/types';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traceIdFilter, setTraceIdFilter] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const fetchLogs = async (traceId?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAuditLogs({
        traceId: traceId || undefined,
        limit: 50,
      });
      setLogs(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(traceIdFilter);
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toUpperCase()) {
      case 'HIGH':
        return 'badge-danger';
      case 'MEDIUM':
        return 'badge-warning';
      case 'LOW':
        return 'badge-success';
      default:
        return 'badge-info';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card title="Audit Logs">
        <p className="text-gray-600 mb-6">
          View compliance scan results and violation details.
        </p>

        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Filter Form */}
        <form onSubmit={handleFilter} className="mb-6 flex gap-4">
          <div className="flex-1">
            <Input
              label="Filter by Trace ID"
              name="traceId"
              value={traceIdFilter}
              onChange={(e) => setTraceIdFilter(e.target.value)}
              placeholder="Enter trace ID to filter"
            />
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit">Filter</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setTraceIdFilter('');
                fetchLogs();
              }}
            >
              Clear
            </Button>
          </div>
        </form>

        {/* Logs Table */}
        {loading ? (
          <LoadingSpinner message="Loading audit logs..." />
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="mt-4">No audit logs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm text-gray-600">
                        {log.traceId}
                      </span>
                      <span className={`badge ${getRiskLevelColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                      <span className="text-sm text-gray-500">
                        Score: {log.riskScore.toFixed(2)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{log.eventType}</span>
                      <span className="mx-2">•</span>
                      <span>
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      <span className="mx-2">•</span>
                      <span>
                        {log.violations.length} violation(s)
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setExpandedLog(expandedLog === log.id ? null : log.id)
                    }
                  >
                    {expandedLog === log.id ? 'Hide' : 'Details'}
                  </Button>
                </div>

                {/* Expanded Details */}
                {expandedLog === log.id && log.violations.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-3">Violations:</h4>
                    <div className="space-y-3">
                      {log.violations.map((violation, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 rounded p-3"
                        >
                          <div className="flex items-start gap-2">
                            <span className="badge badge-danger">
                              {violation.type}
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {violation.description}
                              </p>
                              {violation.explanation && (
                                <p className="text-sm text-gray-600 mt-1">
                                  {violation.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};


