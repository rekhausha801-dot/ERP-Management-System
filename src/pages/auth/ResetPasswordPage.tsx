import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';
import { Lock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F1FA',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div
            style={{
              width: 52,
              height: 52,
              margin: '0 auto 12px',
              borderRadius: 12,
              backgroundColor: '#51258C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <Title level={3} style={{ margin: 0, color: '#1E152A', fontWeight: 700 }}>
            Create New Password
          </Title>
          <Text style={{ color: '#5C526A', fontSize: 14 }}>
            Ensure your password is at least 8 characters with numbers & symbols
          </Text>
        </div>

        <Card
          bordered
          style={{
            borderRadius: 12,
            boxShadow: '0 8px 24px rgba(81, 37, 140, 0.08)',
            border: '1px solid #E8E0F0',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          {success ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <Title level={4} style={{ color: '#1E152A', margin: 0 }}>
                Password Updated Successfully
              </Title>
              <Paragraph style={{ color: '#5C526A', marginTop: 8, fontSize: 14 }}>
                Your enterprise security profile is now updated. You can login with your new credentials.
              </Paragraph>
              <Button
                type="primary"
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: '#51258C',
                  borderColor: '#51258C',
                  marginTop: 12,
                  borderRadius: 6,
                }}
                icon={<ArrowRight size={15} />}
              >
                Sign In Now
              </Button>
            </div>
          ) : (
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please enter a new password' },
                  { min: 8, message: 'Must be at least 8 characters long' },
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<Lock size={16} color="#8E849E" style={{ marginRight: 6 }} />}
                  placeholder="Enter new password"
                />
              </Form.Item>

              <Form.Item
                label="Confirm New Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  size="large"
                  prefix={<Lock size={16} color="#8E849E" style={{ marginRight: 6 }} />}
                  placeholder="Re-type new password"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 24, marginBottom: 12 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                  style={{
                    backgroundColor: '#51258C',
                    borderColor: '#51258C',
                    height: 44,
                    fontWeight: 600,
                    borderRadius: 8,
                  }}
                >
                  Save & Update Password
                </Button>
              </Form.Item>
            </Form>
          )}

          {!success && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/login" style={{ color: '#7546B8', fontSize: 13, fontWeight: 600 }}>
                Cancel and return to login
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
