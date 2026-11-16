import React from 'react';
import { Card, Input, Space, Button } from 'antd';
import { Search, RotateCcw } from 'lucide-react';

interface FilterToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onReset?: () => void;
  children?: React.ReactNode;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  searchPlaceholder = 'Search records...',
  searchValue,
  onSearchChange,
  onReset,
  children,
}) => {
  return (
    <Card
      style={{
        marginBottom: 16,
        borderRadius: 8,
        border: '1px solid #f0f0f0',
      }}
      styles={{ body: { padding: '12px 16px' } }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Space wrap size="middle">
          <Input
            placeholder={searchPlaceholder}
            prefix={<Search size={16} style={{ color: '#8c8c8c' }} />}
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            style={{ width: 260 }}
            allowClear
          />
          {children}
        </Space>

        {onReset && (
          <Button
            icon={<RotateCcw size={14} style={{ marginRight: 4 }} />}
            onClick={onReset}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            Reset Filters
          </Button>
        )}
      </div>
    </Card>
  );
};

export default FilterToolbar;
