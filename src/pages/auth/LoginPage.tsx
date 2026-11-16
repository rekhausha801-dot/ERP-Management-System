import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message, Checkbox } from 'antd';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = (values: { email: string; password?: string }) => {
    setLoading(true);
    setTimeout(() => {
      login(values.email, 'superadmin');
      message.success('Welcome back to Nexus ERP Enterprise');
      navigate('/dashboard');
      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d233a 0%, #1a365d 50%, #0d233a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 12,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
        styles={{ body: { padding: '40px 32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              backgroundColor: '#0d233a',
              color: '#d4af37',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              boxShadow: '0 4px 12px rgba(13, 35, 58, 0.3)',
            }}
          >
            <ShieldCheck size={28} />
          </div>
          <Title level={3} style={{ margin: 0, color: '#0d233a', fontWeight: 700 }}>
            NEXUS ERP
          </Title>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Enterprise Resource Planning & Multi-Company Management
          </Text>
        </div>

        <Form
          layout="vertical"
          initialValues={{ email: 'admin@apexglobal.com', remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Work Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your work email!' },
              { type: 'email', message: 'Enter a valid email address' },
            ]}
          >
            <Input
              size="large"
              prefix={<Mail size={16} style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="e.g. admin@apexglobal.com"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            initialValue="admin123"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              size="large"
              prefix={<Lock size={16} style={{ color: '#94a3b8', marginRight: 6 }} />}
              placeholder="••••••••"
            />
          </Form.Item>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember session</Checkbox>
            </Form.Item>
            <Button type="link" style={{ padding: 0, fontSize: 13 }}>
              Forgot password?
            </Button>
          </div>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{
              backgroundColor: '#0d233a',
              borderColor: '#0d233a',
              height: 44,
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Sign In to ERP Portal
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
