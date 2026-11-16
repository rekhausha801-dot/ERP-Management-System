import React from 'react';
import { Tag } from 'antd';
import type { ErpPackageType } from '../types/erp';
import { ERP_PACKAGES } from '../config/erpPackages';

interface PackageBadgeProps {
  packageType: ErpPackageType;
  showTagline?: boolean;
}

export const PackageBadge: React.FC<PackageBadgeProps> = ({ packageType, showTagline = false }) => {
  const pkg = ERP_PACKAGES[packageType] || ERP_PACKAGES.BOTH;

  const colorMap: Record<ErpPackageType, string> = {
    BOTH: '#51258C',
    SALES: '#1d4ed8',
    SERVICE: '#059669',
  };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Tag
        color={colorMap[packageType]}
        style={{
          margin: 0,
          fontWeight: 600,
          borderRadius: 4,
          padding: '2px 8px',
          letterSpacing: '0.02em',
        }}
      >
        {pkg.name} ({pkg.code})
      </Tag>
      {showTagline && (
        <span style={{ fontSize: 12, color: 'var(--erp-text-secondary)' }}>
          {pkg.tagline}
        </span>
      )}
    </span>
  );
};
