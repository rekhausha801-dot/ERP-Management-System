import React, { useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker, Switch, message } from 'antd';
import { Calendar, Clock, Mail, Bell } from 'lucide-react';
import dayjs from 'dayjs';

interface ReportScheduleModalProps {
  open: boolean;
  reportName: string;
  onClose: () => void;
}

export const ReportScheduleModal: React.FC<ReportScheduleModalProps> = ({
  open,
  reportName,
  onClose,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: any) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success(`Automated delivery scheduled for ${reportName} (${values.frequency})!`);
      form.resetFields();
      onClose();
    }, 600);
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1E3A8A', fontWeight: 800 }}>
          <Calendar size={18} />
          <span>Configure Automated Report Schedule</span>
        </div>
      }
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Save & Activate Schedule"
      cancelText="Cancel"
      width={560}
    >
      <div style={{ marginBottom: 16, padding: '10px 14px', backgroundColor: '#F0F9FF', borderRadius: 8, border: '1px solid #BAE6FD' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0369A1' }}>Target Report: {reportName}</div>
        <div style={{ fontSize: 12, color: '#0284C7', marginTop: 2 }}>
          Recipients will receive periodic exports in high-fidelity PDF and Excel attachments.
        </div>
      </div>

      <Form form={form} layout="vertical" initialValues={{ frequency: 'Weekly', format: 'PDF & Excel', active: true }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Daily">Daily Summary (End of Day)</Select.Option>
              <Select.Option value="Weekly">Weekly Digest (Monday 08:00 AM)</Select.Option>
              <Select.Option value="Monthly">Monthly Closing (1st of Month)</Select.Option>
              <Select.Option value="Quarterly">Quarterly Review</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="format" label="Export Format" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="PDF & Excel">Both PDF & Excel</Select.Option>
              <Select.Option value="PDF Only">PDF Document Only</Select.Option>
              <Select.Option value="Excel Only">Excel (.xlsx) Only</Select.Option>
              <Select.Option value="CSV Only">CSV Data Only</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="recipients"
          label="Recipient Email Addresses (comma separated)"
          rules={[{ required: true, message: 'Please enter at least one email' }]}
          initialValue="management@company.com, finance.lead@company.com"
        >
          <Input prefix={<Mail size={14} color="#64748B" />} placeholder="cfo@company.com, audit@company.com" />
        </Form.Item>

        <Form.Item name="branchScope" label="Branch Filter Scope" initialValue="All Branches">
          <Select>
            <Select.Option value="All Branches">All Enterprise Branches</Select.Option>
            <Select.Option value="Chennai HQ">Chennai HQ</Select.Option>
            <Select.Option value="Bengaluru Tech Park">Bengaluru Tech Park</Select.Option>
            <Select.Option value="Coimbatore Plant">Coimbatore Plant</Select.Option>
            <Select.Option value="Hosur Hub">Hosur Hub</Select.Option>
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0F172A' }}>Enable In-App Notification Alert</div>
            <div style={{ fontSize: 11, color: '#64748B' }}>Notify admins in top-bar bell icon when scheduled report generates</div>
          </div>
          <Form.Item name="active" valuePropName="checked" noStyle>
            <Switch defaultChecked />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};
