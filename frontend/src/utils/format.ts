import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatDate = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getRiskColor = (score: number): string => {
  if (score >= 80) return 'text-red-400';
  if (score >= 60) return 'text-orange-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-green-400';
};

export const getSeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    critical: 'text-red-400 bg-red-900/20 border-red-700',
    high: 'text-orange-400 bg-orange-900/20 border-orange-700',
    medium: 'text-yellow-400 bg-yellow-900/20 border-yellow-700',
    low: 'text-blue-400 bg-blue-900/20 border-blue-700',
  };
  return colors[severity] || colors.low;
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    open: 'text-blue-400 bg-blue-900/20 border-blue-700',
    investigating: 'text-yellow-400 bg-yellow-900/20 border-yellow-700',
    under_review: 'text-yellow-400 bg-yellow-900/20 border-yellow-700',
    escalated: 'text-red-400 bg-red-900/20 border-red-700',
    resolved: 'text-green-400 bg-green-900/20 border-green-700',
    closed: 'text-gray-400 bg-gray-900/20 border-gray-700',
    pending: 'text-yellow-400 bg-yellow-900/20 border-yellow-700',
    flagged: 'text-red-400 bg-red-900/20 border-red-700',
    cleared: 'text-green-400 bg-green-900/20 border-green-700',
  };
  return colors[status] || colors.open;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatStatusLabel = (status: string): string => {
  return status
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ');
};

// Made with Bob
