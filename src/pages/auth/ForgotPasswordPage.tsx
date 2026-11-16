import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';
import { Mail, ArrowLeft, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState('');

  const onFinish = (values: { email: string }) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setEmailSentTo(values.email);
      setSubmitted(true);
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
            Reset Your Password
          </Title>
          <Text style={{ color: '#5C526A', fontSize: 14 }}>
            Enter your email to receive recovery instructions
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
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle2 size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <Title level={4} style={{ color: '#1E152A', margin: 0 }}>
                Verification Link Dispatched
              </Title>
              <Paragraph style={{ color: '#5C526A', marginTop: 8, fontSize: 14 }}>
                We have transmitted password reset guidance to <strong>{emailSentTo}</strong>.
              </Paragraph>
              <Link to="/reset-password">
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#51258C',
                    borderColor: '#51258C',
                    marginTop: 12,
                    borderRadius: 6,
                  }}
                >
                  Proceed to Reset Screen (Demo)
                </Button>
              </Link>
            </div>
          ) : (
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Registered Business Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email' },
                  { type: 'email', message: 'Enter a valid corporate email' },
                ]}
              >
                <Input
                  size="large"
                  prefix={<Mail size={16} color="#8E849E" style={{ marginRight: 6 }} />}
                  placeholder="name@company.com"
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
                  Send Recovery Link
                </Button>
              </Form.Item>
            </Form>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Link
              to="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#7546B8',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <ArrowLeft size={14} /> Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
