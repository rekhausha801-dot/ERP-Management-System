import React from 'react';
import { Row, Col, Card, Typography, Tag, List } from 'antd';
import { Check } from 'lucide-react';
import { PageHeader } from '../../components';
import { ERP_PACKAGES } from '../../config/erpPackageConfig';
import type { ErpPackageId } from '../../config/erpPackageConfig';

const { Title, Text, Paragraph } = Typography;

export const ERPPlans: React.FC = () => {
  const packages = Object.values(ERP_PACKAGES);

  return (
    <div>
      <PageHeader
        title="ERP Package Matrix & Tier Definition"
        subtitle="Universal configuration mapping modules, feature gates, and operational limits."
      />

      <Row gutter={[20, 20]}>
        {packages.map((pkg) => (
          <Col xs={24} md={8} key={pkg.id}>
            <Card
              bordered
              style={{
                borderRadius: 10,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: pkg.id === 'COMPLETE' ? '2px solid #51258C' : '1px solid #E7E0F0',
              }}
              styles={{ body: { display: 'flex', flexDirection: 'column', flex: 1, padding: 24 } }}
            >
              <div style={{ marginBottom: 12 }}>
                <span
                  style={{
                    backgroundColor: pkg.badgeBg,
                    color: pkg.badgeColor,
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {pkg.code}
                </span>
                <Title level={4} style={{ marginTop: 12, marginBottom: 2, color: '#242033' }}>
                  {pkg.name}
                </Title>
                <Text style={{ fontSize: 13, color: '#7546B8', fontWeight: 600 }}>{pkg.tagline}</Text>
              </div>

              <Paragraph style={{ color: '#77718A', fontSize: 13, minHeight: 44 }}>
                {pkg.description}
              </Paragraph>

              <div style={{ margin: '14px 0', borderTop: '1px solid #E7E0F0', paddingTop: 14, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 11, color: '#9E98AD', marginBottom: 10, textTransform: 'uppercase' }}>
                  Included Capabilities:
                </div>
                <List
                  dataSource={pkg.features}
                  renderItem={(feature) => (
                    <List.Item style={{ padding: '5px 0', border: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: '#F0EAF8',
                            color: '#51258C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Check size={11} strokeWidth={3} />
                        </div>
                        <span style={{ fontSize: 13, color: '#242033' }}>{feature}</span>
                      </div>
                    </List.Item>
                  )}
                />
              </div>

              <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #E7E0F0', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#77718A' }}>Package Key: <strong>{pkg.id}</strong></span>
                <span style={{ fontSize: 12, color: '#51258C', fontWeight: 600 }}>Active in Runtime</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
