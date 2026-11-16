import React from 'react';
import { Tag } from 'antd';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = status.toLowerCase();

  let color = 'default';

  if (
    norm.includes('active') ||
    norm.includes('completed') ||
    norm.includes('paid') ||
    norm.includes('approved') ||
    norm.includes('qualified') ||
    norm.includes('resolved') ||
    norm.includes('available') ||
    norm.includes('in stock') ||
    norm.includes('success')
  ) {
    color = 'success';
  } else if (
    norm.includes('pending') ||
    norm.includes('working') ||
    norm.includes('progress') ||
    norm.includes('sent') ||
    norm.includes('review') ||
    norm.includes('scheduled') ||
    norm.includes('inspecting') ||
    norm.includes('partially') ||
    norm.includes('low stock') ||
    norm.includes('expiring')
  ) {
    color = 'warning';
  } else if (
    norm.includes('inactive') ||
    norm.includes('overdue') ||
    norm.includes('failed') ||
    norm.includes('rejected') ||
    norm.includes('lost') ||
    norm.includes('emergency') ||
    norm.includes('out of stock') ||
    norm.includes('expired')
  ) {
    color = 'error';
  } else if (
    norm.includes('new') ||
    norm.includes('draft') ||
    norm.includes('open') ||
    norm.includes('en route')
  ) {
    color = 'processing';
  }

  return (
    <Tag
      color={color}
      style={{
        fontWeight: 600,
        borderRadius: 4,
        padding: '2px 8px',
        textTransform: 'capitalize',
      }}
    >
      {status}
    </Tag>
  );
};
