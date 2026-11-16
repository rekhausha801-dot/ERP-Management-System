import React from 'react';
import { Tag } from 'antd';

export type StatusType =
  | 'active'
  | 'inactive'
  | 'in_progress'
  | 'completed'
  | 'pending'
  | 'paid'
  | 'cancelled'
  | 'on_hold'
  | 'present'
  | 'absent'
  | 'leave';

interface StatusBadgeProps {
  status: StatusType | string;
}

const statusColorMap: Record<string, { color: string; label: string }> = {
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'default', label: 'Inactive' },
  in_progress: { color: 'processing', label: 'In Progress' },
  completed: { color: 'success', label: 'Completed' },
  pending: { color: 'warning', label: 'Pending' },
  paid: { color: 'success', label: 'Paid' },
  cancelled: { color: 'error', label: 'Cancelled' },
  on_hold: { color: 'default', label: 'On Hold' },
  present: { color: 'success', label: 'Present' },
  absent: { color: 'error', label: 'Absent' },
  leave: { color: 'warning', label: 'On Leave' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusColorMap[status.toLowerCase()] || {
    color: 'default',
    label: status.replace(/_/g, ' ').toUpperCase(),
  };

  return <Tag color={config.color}>{config.label}</Tag>;
};

export default StatusBadge;
