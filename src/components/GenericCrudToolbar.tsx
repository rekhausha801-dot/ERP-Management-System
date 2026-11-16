import React, { useState } from 'react';
import { Card, Input, Button, Modal, Form, Typography, Space, Tooltip } from 'antd';
import { Search, Filter, RotateCcw, Plus } from 'lucide-react';

const { Text } = Typography;

interface GenericCrudToolbarProps {
  searchPlaceholder?: string;
  onSearch: (value: string) => void;
  onReset?: () => void;
  onCreateNew?: () => void;
  createButtonText?: string;
  extraActions?: React.ReactNode;
}

export const GenericCrudToolbar: React.FC<GenericCrudToolbarProps> = ({
  searchPlaceholder = 'Search records...',
  onSearch,
  onReset,
  onCreateNew,
  createButtonText = 'Add New',
  extraActions,
}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    onSearch(val);
  };

  const handleReset = () => {
    setSearchValue('');
    if (onReset) onReset();
    else onSearch('');
  };

  return (
    <Card
      styles={{ body: { padding: '12px 16px' } }}
      style={{
        marginBottom: 16,
        borderRadius: 8,
        border: '1px solid #E8E0F0',
        backgroundColor: '#FFFFFF',
      }}
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
            prefix={<Search size={16} color="#8E849E" />}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            allowClear
            style={{ width: 280, borderRadius: 6 }}
          />
          {onReset && (
            <Tooltip title="Reset Filters">
              <Button icon={<RotateCcw size={15} />} onClick={handleReset}>
                Reset
              </Button>
            </Tooltip>
          )}
        </Space>

        <Space wrap size="middle">
          {extraActions}
          {onCreateNew && (
            <Button
              type="primary"
              icon={<Plus size={16} />}
              onClick={onCreateNew}
              style={{
                backgroundColor: '#51258C',
                borderColor: '#51258C',
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              {createButtonText}
            </Button>
          )}
        </Space>
      </div>
    </Card>
  );
};
