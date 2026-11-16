import React from 'react';
import { Row, Col, Card, Typography, Tag, Button, List } from 'antd';
import { Check, Layers, ArrowRight } from 'lucide-react';
import { PageHeader, PackageBadge } from '../../components';
import { ERP_PACKAGES } from '../../config/erpPackages';
import type { ErpPackageType } from '../../types';

const { Title, Text, Paragraph } = Typography;

export const ErpPackageMatrixPage: React.FC = () => {
  const packagesList = Object.values(ERP_PACKAGES);

  return (
    <div>
      <PageHeader
        title="ERP Package Matrix & Tier Definition"
        subtitle="Universal configuration mapping modules, feature gates, and operational boundaries for each ERP tier."
      />

      <Row gutter={[20, 20]}>
        {packagesList.map((pkg) => (
          <Col xs={24} md={8} key={pkg.id}>
            <Card
              bordered
              style={{
                borderRadius: 10,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: pkg.id === 'BOTH' ? '2px solid #51258C' : '1px solid #E8E0F0',
                position: 'relative',
              }}
              styles={{ body: { display: 'flex', flexDirection: 'column', flex: 1, padding: 24 } }}
            >
              {pkg.id === 'BOTH' && (
                <div
                  style={{
                    position: 'absolute',
                    top: -12,
                    right: 20,
                    backgroundColor: '#51258C',
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 10px',
                    borderRadius: 12,
                    textTransform: 'uppercase',
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <PackageBadge packageType={pkg.id as ErpPackageType} />
                <Title level={3} style={{ marginTop: 12, marginBottom: 4, color: '#1E152A' }}>
                  {pkg.name}
                </Title>
                <Text style={{ fontSize: 13, color: '#7546B8', fontWeight: 600 }}>
                  {pkg.tagline}
                </Text>
              </div>

              <Paragraph style={{ color: '#5C526A', fontSize: 13, minHeight: 48 }}>
                {pkg.description}
              </Paragraph>

              <div style={{ margin: '16px 0', borderTop: '1px solid #E8E0F0', paddingTop: 16, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 12, color: '#8E849E', marginBottom: 12, textTransform: 'uppercase' }}>
                  Included Capabilities:
                </div>
                <List
                  dataSource={pkg.features}
                  renderItem={(feature) => (
                    <List.Item style={{ padding: '6px 0', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            backgroundColor: '#EFE7F7',
                            color: '#51258C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: 13, color: '#1E152A' }}>{feature}</span>
                      </div>
                    </List.Item>
                  )}
                />
              </div>

              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: 16,
                  borderTop: '1px solid #E8E0F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ fontSize: 11, color: '#8E849E', display: 'block' }}>Package ID:</span>
                  <Tag color="purple">{pkg.id}</Tag>
                </div>
                <span style={{ fontSize: 12, color: '#51258C', fontWeight: 600 }}>Active in Runtime</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
