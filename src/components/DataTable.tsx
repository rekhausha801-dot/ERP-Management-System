import React from 'react';
import { Card, Table, Typography } from 'antd';
import type { TableProps } from 'antd';

const { Text } = Typography;

interface DataTableProps<T> extends Omit<TableProps<T>, 'title'> {
  cardTitle?: string;
  extra?: React.ReactNode;
}

export function DataTable<T extends object>({
  cardTitle,
  extra,
  ...tableProps
}: DataTableProps<T>) {
  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        border: '1px solid #f0f0f0',
      }}
      styles={{ body: { padding: '16px' } }}
      title={cardTitle ? <Text strong style={{ fontSize: 16 }}>{cardTitle}</Text> : undefined}
      extra={extra}
    >
      <Table<T>
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        scroll={{ x: 'max-content' }}
        {...tableProps}
      />
    </Card>
  );
}

export default DataTable;
